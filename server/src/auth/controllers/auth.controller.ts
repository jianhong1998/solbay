import { Controller, Post, Res } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';

import { EnvironmentVariableUtil } from 'src/common/utils/environment-variable.util';
import { LoggerUtil } from 'src/common/utils/logger.util';
import { EntityManager } from 'typeorm';

import { AuthService } from '../services/auth.service';

@Controller('/auth')
export class AuthController {
  envVars: ReturnType<EnvironmentVariableUtil['getVariables']>;

  constructor(
    private readonly authService: AuthService,
    private readonly loggerUtil: LoggerUtil,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    envVarUtil: EnvironmentVariableUtil,
  ) {
    this.envVars = envVarUtil.getVariables();
  }

  @Post('/')
  @Public()
  login(@Res() res: Response) {
    const token = '';

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
  }
}
