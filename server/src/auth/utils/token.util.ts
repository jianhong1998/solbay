import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoggerUtil } from 'src/common/utils/logger.util';

@Injectable()
export class TokenUtil {
  constructor(
    private readonly jwtService: JwtService,
    private readonly loggerUtil: LoggerUtil,
  ) {}

  public async generateToken<T extends object>(
    payload: T,
  ): Promise<{
    token: string;
  }> {
    const token = this.jwtService.sign(payload);

    return { token };
  }

  public async verifyToken(token: string): Promise<boolean> {
    const logger = this.loggerUtil.createLogger('VerifyToken');

    try {
      this.jwtService.verify(token, { ignoreExpiration: false });
      return true;
    } catch (_error) {
      logger.log('Invalid token or token is expired.');
      return false;
    }
  }

  public decodeToken<T extends object>(token: string): T {
    return this.jwtService.decode<T>(token);
  }
}
