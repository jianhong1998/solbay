import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { Public } from './common/decorators';
import { EnvironmentVariableUtil } from './common/utils/environment-variable.util';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly envVarUtil: EnvironmentVariableUtil,
  ) {}

  @Get('/')
  @Public()
  getHello(): void {
    this.appService.healthCheck();
  }

  @Get('/version')
  @Public()
  checkVersion(): { version: string } {
    return this.appService.getVersion();
  }
}
