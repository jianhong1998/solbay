import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { PublicKey } from '@solana/web3.js';
import { Response } from 'express';
import { User } from 'src/common/decorators';
import { Public } from 'src/common/decorators/public.decorator';
import { EnvironmentVariableUtil } from 'src/common/utils/environment-variable.util';
import { LoggerUtil } from 'src/common/utils/logger.util';
import { ConnectionUtil } from 'src/solana-connection/utils/connection.util';
import { UserModel } from 'src/user/models/user.model';
import { UserService } from 'src/user/services/user.service';
import { EntityManager } from 'typeorm';

import { TOKEN_COOKIE_NAME } from '../constants';
import { LoginReqDTO } from '../dtos/login.dto';
import { LogoutReqDTO } from '../dtos/logout.dto';
import {
  IVerifyTokenReqDTO,
  IVerifyTokenResDTO,
} from '../dtos/verify-token.dto';
import { AuthService } from '../services/auth.service';

@Controller('/auth')
export class AuthController {
  envVars: ReturnType<EnvironmentVariableUtil['getVariables']>;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly loggerUtil: LoggerUtil,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    envVarUtil: EnvironmentVariableUtil,
  ) {
    this.envVars = envVarUtil.getVariables();
  }

  @Post('/')
  @HttpCode(200)
  @Public()
  public async login(@Body() body: LoginReqDTO, @Res() res: Response) {
    const { transaction: serializedTransaction, publicKey: publicKeyString } =
      body;
    const logger = this.loggerUtil.createLogger('Login');

    const verifyLoginTransactionResult =
      this.authService.verifyLoginTransaction(
        serializedTransaction,
        publicKeyString,
      );

    if (!verifyLoginTransactionResult)
      throw new BadRequestException('Invalid transaction');

    const userPublicKey = new PublicKey(publicKeyString);

    await this.userService.createUserIfNotExist({
      publicKey: userPublicKey,
      entityManager: this.entityManager,
    });

    const user = await this.userService.getUserByPublicKey({
      publicKey: userPublicKey,
      entityManager: this.entityManager,
    });

    if (!user) {
      throw new Error('Failed to create user data');
    }

    const { token } = this.authService.generateToken(user.uuid);

    res
      .cookie(TOKEN_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
      .send();

    logger.log(`JWT is issued to user ${user.uuid}`);
  }

  @Get('/signer')
  @Public()
  public getSigner() {
    const signer = ConnectionUtil.getSigner();
    return {
      publicKey: signer.publicKey.toBase58(),
    };
  }

  @Post('/verify-token')
  @HttpCode(200)
  public verifyToken(
    @User() user: UserModel,
    @Body() reqBody: IVerifyTokenReqDTO,
  ): IVerifyTokenResDTO {
    const logger = this.loggerUtil.createLogger('VerifyTokenEndpoint');

    if (!user) {
      const message = 'User not found.';

      logger.warn(message);
      return new IVerifyTokenResDTO(false, message);
    }

    const { publicKey: publicKeyString } = reqBody;

    if (user.publicKey !== publicKeyString) {
      const message = 'User and public key not matched.';

      logger.warn(message);
      return new IVerifyTokenResDTO(false, message);
    }

    return new IVerifyTokenResDTO(true);
  }

  @Post('/logout')
  @HttpCode(200)
  @Public()
  public logout(
    @Body() reqBody: LogoutReqDTO,
    @User() user: UserModel | undefined,
    @Res() res: Response,
  ): void {
    const finalResponse = this.authService.processLogout({
      publicKey: new PublicKey(reqBody.publicKey),
      res,
      user,
    });

    finalResponse.send();
  }
}
