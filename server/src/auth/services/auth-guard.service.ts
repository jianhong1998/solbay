import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UUID } from 'crypto';
import { Request, Response } from 'express';
import {
  IS_SELLER_DECORATOR_KEY,
  PUBLIC_DECORATOR_KEY,
} from 'src/common/constants';
import { LoggerUtil } from 'src/common/utils/logger.util';
import { SellerModel } from 'src/user/models/seller.model';
import { UserModel } from 'src/user/models/user.model';
import { SellerDBUtil } from 'src/user/utils/sellerDB.util';
import { UserDBUtil } from 'src/user/utils/userDB.util';

import { TOKEN_COOKIE_NAME } from '../constants';
import { TokenUtil } from '../utils/token.util';

type IGetUserAndSellerResult =
  | {
      user: UserModel;
      seller: SellerModel | null;
    }
  | {
      user: null;
      seller: null;
    };

@Injectable()
export class AuthGuardService implements CanActivate {
  private readonly unauthorizedMessage =
    'You are required to login before continue.';

  constructor(
    private readonly reflector: Reflector,
    private readonly userDBUtil: UserDBUtil,
    private readonly tokenUtil: TokenUtil,
    private readonly loggerUtil: LoggerUtil,
    private readonly sellerDBUtil: SellerDBUtil,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    // return this.processCanActivateCheckV1(context);
    return this.processCanActivateCheckV2(context);
  }

  private async processCanActivateCheckV1(
    context: ExecutionContext,
  ): Promise<boolean> {
    const logger = this.loggerUtil.createLogger('VerifyToken V1');
    logger.log('Start verifying token');

    const isPublic =
      this.reflector.getAllAndOverride<boolean>(PUBLIC_DECORATOR_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? false;
    const shouldVerifyUserIsSeller =
      this.reflector.getAllAndOverride<boolean>(IS_SELLER_DECORATOR_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? false;

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromRequestV1(req);
    const isTokeValid = this.tokenUtil.verifyToken(token);

    if (!isTokeValid) {
      logger.log(`Token no longer valid: ${token}`);
      throw new UnauthorizedException(this.unauthorizedMessage);
    }

    const publicKeyString = req.headers['x-public-key'] as unknown as
      | undefined
      | string
      | string[];

    if (typeof publicKeyString === 'undefined') {
      logger.log(`Public key is invalid: ${publicKeyString}`);
      throw new BadRequestException(`Public key not found in request`);
    }

    if (Array.isArray(publicKeyString)) {
      logger.log(
        `Receive invalid public key in request header: ${JSON.stringify(publicKeyString)}`,
      );
      throw new BadRequestException(
        `Invalid pubic key: ${JSON.stringify(publicKeyString)}`,
      );
    }

    const { userId } = this.tokenUtil.decodeToken<{ userId?: UUID }>(token);

    if (!userId) {
      logger.warn(`Invalid userId in token: ${userId}`);
      throw new UnauthorizedException(this.unauthorizedMessage);
    }

    const user = await this.userDBUtil.getOne({
      criterial: {
        uuid: userId,
      },
    });

    if (!user) {
      logger.log(`User not found: ${userId}`);
      throw new UnauthorizedException(this.unauthorizedMessage);
    }

    if (user.publicKey !== publicKeyString) {
      logger.log(
        `Public key (${publicKeyString}) is unmatched with user (${user.uuid})`,
      );
      throw new UnauthorizedException(this.unauthorizedMessage);
    }

    const seller = await this.sellerDBUtil.getOne({
      criterial: {
        user: {
          uuid: user.uuid,
        },
      },
      relation: {
        user: true,
      },
    });

    if (shouldVerifyUserIsSeller && !seller)
      throw new ForbiddenException(
        'Please register your info for getting seller access',
      );

    req.user = user;
    req.seller = seller ?? undefined;

    logger.log('Token is valid');
    return true;
  }

  private async processCanActivateCheckV2(
    context: ExecutionContext,
  ): Promise<boolean> {
    const logger = this.loggerUtil.createLogger('VerifyToken V2');
    logger.log('Start verifying token');

    const isPublic =
      this.reflector.getAllAndOverride<boolean>(PUBLIC_DECORATOR_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? false;
    const shouldVerifyUserIsSeller =
      this.reflector.getAllAndOverride<boolean>(IS_SELLER_DECORATOR_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? false;

    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const token = this.extractTokenFromRequestV2(req);
    const publicKeyString = this.extractPublicKeyFromRequest(req, logger);

    const isTokenValid = token ? this.tokenUtil.verifyToken(token) : false;

    /* Case: no public key and is not public endpoint. Throw BadRequestExeption. */
    if (!publicKeyString && !isPublic) {
      throw new BadRequestException(`Invalid public key`);
    }

    /* Step: Get User & Seller */

    let user: UserModel | null = null;
    let seller: SellerModel | null = null;

    if (token && isTokenValid) {
      const decodedTokenObj = this.tokenUtil.decodeToken<{ userId: UUID }>(
        token,
      );
      const { userId } = decodedTokenObj;

      if (!userId)
        logger.error(`userId not in token: ${JSON.stringify(decodedTokenObj)}`);

      const result = await this.getUserAndSeller(userId);
      user = result.user;
      seller = result.seller;
    }

    if (user && user.publicKey === publicKeyString) {
      req.user = user;
      req.seller = seller ?? undefined;
    }

    if (user && user.publicKey !== publicKeyString) {
      logger.log(
        `Public key (${publicKeyString}) is unmatched with user (${user.uuid})`,
      );
    }

    /* Step: remove token from cookie if it is invalid */
    if (!isTokenValid || !user || user.publicKey !== publicKeyString)
      res.cookie(TOKEN_COOKIE_NAME, '', { expires: new Date() });

    if (!isTokenValid) {
      logger.log(`Token no longer valid: ${token}`);
    }

    /* Step: Determine if can access */

    if (isPublic && shouldVerifyUserIsSeller)
      throw new Error(
        'Should not use @IsPublic and @IsSeller at the same time',
      );

    if (isPublic) return true;

    if (!user) {
      throw new UnauthorizedException(this.unauthorizedMessage);
    }

    if (shouldVerifyUserIsSeller && !seller)
      throw new ForbiddenException(
        'Please register your info for getting seller access',
      );

    return true;
  }

  private extractTokenFromRequestV1(req: Request): string {
    const logger = this.loggerUtil.createLogger('ExtractTokenFromRequest');

    if (!req.cookies) {
      logger.log('Cookie is not found in request.');
      throw new UnauthorizedException(this.unauthorizedMessage);
    }

    if (
      !(TOKEN_COOKIE_NAME in req.cookies) ||
      typeof req.cookies[TOKEN_COOKIE_NAME] !== 'string'
    ) {
      logger.log(
        `Invalid token in request cookies: ${JSON.stringify(req.cookies)}.`,
      );
      throw new UnauthorizedException(this.unauthorizedMessage);
    }

    const token = req.cookies[TOKEN_COOKIE_NAME];

    if (typeof token !== 'string') {
      logger.log(`Invalid token: (Type - ${typeof token}) ${String(token)}`);
      throw new UnauthorizedException(this.unauthorizedMessage);
    }

    return token;
  }

  private extractTokenFromRequestV2(req: Request): string | null {
    const logger = this.loggerUtil.createLogger('ExtractTokenFromRequest');

    if (!req.cookies) {
      logger.log('Cookie is not found in request.');
      return null;
    }

    if (
      !(TOKEN_COOKIE_NAME in req.cookies) ||
      typeof req.cookies[TOKEN_COOKIE_NAME] !== 'string'
    ) {
      logger.log(
        `Invalid token in request cookies: ${JSON.stringify(req.cookies)}.`,
      );
      return null;
    }

    const token = req.cookies[TOKEN_COOKIE_NAME];

    if (typeof token !== 'string') {
      logger.log(`Invalid token: (Type - ${typeof token}) ${String(token)}`);
      return null;
    }

    return token;
  }

  private extractPublicKeyFromRequest(
    req: Request,
    logger: Logger,
  ): string | null {
    const publicKeyString = req.headers['x-public-key'];

    if (typeof publicKeyString === 'undefined') {
      logger.log(`Public key not found in request: ${publicKeyString}`);
      return null;
    }

    if (Array.isArray(publicKeyString)) {
      logger.log(
        `Receive invalid public key in request header: ${JSON.stringify(publicKeyString)}`,
      );
      return null;
    }

    return publicKeyString;
  }

  private async getUserAndSeller(
    userId: UUID,
  ): Promise<IGetUserAndSellerResult> {
    const user = await this.userDBUtil.getOne({
      criterial: {
        uuid: userId,
      },
    });

    if (!user) {
      return {
        user: null,
        seller: null,
      };
    }

    const seller = await this.sellerDBUtil.getOne({
      criterial: {
        user: {
          uuid: user?.uuid ?? ('' as UUID),
        },
      },
      relation: {
        user: true,
      },
    });

    return {
      user,
      seller,
    };
  }
}
