import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PUBLIC_DECORATOR_KEY } from 'src/common/constants';
import { UserDBUtil } from 'src/user/utils/userDB.util';

import { TokenUtil } from '../utils/token.util';

@Injectable()
export class AuthGuardService implements CanActivate {
  private readonly unauthorizedMessage =
    'You are required to login before continue.';

  constructor(
    private readonly reflector: Reflector,
    private readonly userDBUtil: UserDBUtil,
    private readonly tokenUtil: TokenUtil,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const LOG_KEY = 'VerifyToken';
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      PUBLIC_DECORATOR_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromRequest(req);
    const verificationCode = this.extractVerificationCodeFromRequest(req);
    const isTokeValid = await this.tokenUtil.verifyToken(
      token,
      verificationCode,
    );

    if (!isTokeValid) {
      Logger.log(`Token no longer valid: ${token}`, LOG_KEY);
      throw new UnauthorizedException(this.unauthorizedMessage);
    }

    const { userId } = this.tokenUtil.decodeToken<{ userId: string }>(token);

    if (!userId) {
      Logger.warn(`Invalid userId in token: ${userId}`, LOG_KEY);
      throw new UnauthorizedException(this.unauthorizedMessage);
    }

    const user = await this.userDBUtil.getOne({
      criterial: {
        uuid: userId,
      },
    });

    if (!user) {
      Logger.log(`User not found: ${userId}`, LOG_KEY);
      throw new UnauthorizedException(this.unauthorizedMessage);
    }

    req.user = user;
    return true;
  }

  private extractTokenFromRequest(req: Request): string {
    const LOG_KEY = 'ExtractTokenFromRequest';

    if (!req.cookies) {
      Logger.log('Cookie is not found in request.', LOG_KEY);
      throw new UnauthorizedException(this.unauthorizedMessage);
    }

    if (!('token' in req.cookies) || typeof req.cookies.token !== 'string') {
      Logger.log(
        `Invalid token in request cookies: ${JSON.stringify(req.cookies)}.`,
        LOG_KEY,
      );
      throw new UnauthorizedException(this.unauthorizedMessage);
    }

    const { token } = req.cookies;

    if (typeof token !== 'string') {
      Logger.log(`Invalid token: (Type - ${typeof token}) ${token}`, LOG_KEY);
      throw new UnauthorizedException(this.unauthorizedMessage);
    }

    return token;
  }

  private extractVerificationCodeFromRequest(req: Request) {
    const LOG_KEY = 'ExtractVerificationCodeFromRequest';

    if (!req.headers.authorization) {
      Logger.log(
        `Verification code is not in request header authorization section`,
        LOG_KEY,
      );
      throw new UnauthorizedException(this.unauthorizedMessage);
    }

    if (typeof req.headers.authorization !== 'string') {
      const { authorization } = req.headers;
      const authorizationType = typeof authorization;
      let authorizationMessage = '';

      if (typeof authorization === 'object') {
        authorizationMessage = JSON.stringify(authorization);
      } else {
        authorizationMessage = String(authorization);
      }

      Logger.log(
        `Invalid verification code: (Type - ${authorizationType}) ${authorizationMessage}`,
        LOG_KEY,
      );
      throw new UnauthorizedException(this.unauthorizedMessage);
    }

    const [authLevel, verificationCode] = req.headers.authorization.split(' ');

    if (authLevel.toLowerCase() !== 'bearer') {
      Logger.error(`Invalid authLevel: ${authLevel}`);
      throw new UnauthorizedException(this.unauthorizedMessage);
    }

    return verificationCode;
  }
}
