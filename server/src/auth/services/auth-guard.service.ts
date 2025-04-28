import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UUID } from 'crypto';
import { Request } from 'express';
import {
  IS_SELLER_DECORATOR_KEY,
  PUBLIC_DECORATOR_KEY,
} from 'src/common/constants';
import { LoggerUtil } from 'src/common/utils/logger.util';
import { SellerDBUtil } from 'src/user/utils/sellerDB.util';
import { UserDBUtil } from 'src/user/utils/userDB.util';

import { TOKEN_COOKIE_NAME } from '../constants';
import { TokenUtil } from '../utils/token.util';

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
    const logger = this.loggerUtil.createLogger('VerifyToken');
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

    const token = this.extractTokenFromRequest(req);
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

    const { userId } = this.tokenUtil.decodeToken<{ userId: UUID }>(token);

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
    return true;
  }

  private extractTokenFromRequest(req: Request): string {
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
}
