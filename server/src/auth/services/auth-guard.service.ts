import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UUID } from 'crypto';
import { Request } from 'express';
import { PUBLIC_DECORATOR_KEY } from 'src/common/constants';
import { LoggerUtil } from 'src/common/utils/logger.util';
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
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const logger = this.loggerUtil.createLogger('VerifyToken');
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      PUBLIC_DECORATOR_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromRequest(req);
    const isTokeValid = this.tokenUtil.verifyToken(token);

    if (!isTokeValid) {
      logger.log(`Token no longer valid: ${token}`);
      throw new UnauthorizedException(this.unauthorizedMessage);
    }

    const publicKeyString = req.headers['x-public-key'];

    if (!publicKeyString) {
      logger.log(`Public key is invalid: ${publicKeyString}`);
      throw new BadRequestException(`Public key not found in request`);
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

    req.user = user;
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
