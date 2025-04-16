import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EnvironmentVariableUtil } from './utils/environment-variable.util';
import { LoggerUtil } from './utils/logger.util';

@Module({
  imports: [ConfigModule],
  providers: [EnvironmentVariableUtil, LoggerUtil],
  exports: [EnvironmentVariableUtil, LoggerUtil],
})
export class CommonModule {}
