import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';

import { EnvironmentVariableUtil } from 'src/common/utils/environment-variable.util';
import { LoggerUtil } from 'src/common/utils/logger.util';
import { EntityManager } from 'typeorm';

import { AuthService } from '../services/auth.service';
import { UserService } from 'src/user/services/user.service';
import { LoginReqDTO } from '../dtos/login.dto';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_COOKIE_NAME } from '../constants';
import { User } from 'src/common/decorators';
import { UserModel } from 'src/user/models/user.model';
import { ConnectionUtil } from 'src/solana-connection/utils/connection.util';
import {
  IVerifyTokenReqDTO,
  IVerifyTokenResDTO,
} from '../dtos/verify-token.dto';
import { LogoutReqDTO } from '../dtos/logout.dto';

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

    const { token } = await this.authService.generateToken(user.uuid);

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
  public async getSigner() {
    const signer = ConnectionUtil.getSigner();
    return {
      publicKey: signer.publicKey.toBase58(),
    };
  }

  @Post('/verify-token')
  @HttpCode(200)
  public async verifyToken(
    @User() user: UserModel,
    @Body() reqBody: IVerifyTokenReqDTO,
  ): Promise<IVerifyTokenResDTO> {
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
  public async logout(
    @Body() reqBody: LogoutReqDTO,
    @User() user: UserModel | undefined,
    @Res() res: Response,
  ): Promise<void> {
    const finalResponse = await this.authService.processLogout({
      publicKey: new PublicKey(reqBody.publicKey),
      res,
      user,
    });

    finalResponse.send();
  }
}
