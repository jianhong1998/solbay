import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { randomBytes } from 'crypto';
import { EnvironmentVariableUtil } from 'src/common/utils/environment-variable.util';

@Injectable()
export class TokenUtil {
  constructor(
    private readonly jwtService: JwtService,
    private readonly environmentVariableUtil: EnvironmentVariableUtil,
  ) {}

  public async generateToken<T extends object>(
    payload: T,
  ): Promise<{
    token: string;
    hashedSecret: string;
  }> {
    const { hashedSecret, verifySecret } = await this.generateVerifySecret();

    const finalPayload = { ...payload, verifySecret };
    const token = this.jwtService.sign(finalPayload);

    return { hashedSecret, token };
  }

  public async verifyToken<T extends object>(
    token: string,
    hashedSecret: string,
  ): Promise<boolean> {
    try {
      this.jwtService.verify(token, { ignoreExpiration: false });
    } catch (_error) {
      Logger.log('Invalid token.', 'VerifyToken');
      return false;
    }

    const { verifySecret: secret } = this.decodeToken<
      T & { verifySecret: string }
    >(token);

    const isVerifySecretValid = await this.verifySecret({
      secret,
      hashedSecret,
    });

    return isVerifySecretValid;
  }

  public verifyTokenWithoutSecret(token: string): boolean {
    try {
      this.jwtService.verify(token, { ignoreExpiration: false });
      return true;
    } catch (_error) {
      Logger.log('Invalid token.', 'VerifyToken');
      return false;
    }
  }

  public decodeToken<T extends object>(token: string): T {
    return this.jwtService.decode<T>(token);
  }

  private async generateVerifySecret(): Promise<{
    hashedSecret: string;
    verifySecret: string;
  }> {
    const { jwtSecret } = this.environmentVariableUtil.getVariables();
    const randomSecret = randomBytes(16).toString('hex');
    const initSecret = `${jwtSecret}-${randomSecret}`;

    const hashedSecret = await hash(initSecret);
    return { hashedSecret, verifySecret: randomSecret };
  }

  private async verifySecret(params: {
    secret: string;
    hashedSecret: string;
  }): Promise<boolean> {
    const { hashedSecret, secret } = params;
    const { jwtSecret } = this.environmentVariableUtil.getVariables();

    const concatedSecret = `${jwtSecret}-${secret}`;
    return await verify(hashedSecret, concatedSecret);
  }
}
