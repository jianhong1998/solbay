import { Injectable, Logger } from '@nestjs/common';

import { EnvironmentVariableUtil } from './environment-variable.util';

@Injectable()
export class LoggerUtil {
  private readonly varList: ReturnType<EnvironmentVariableUtil['getVariables']>;

  constructor(private readonly envVarUtil: EnvironmentVariableUtil) {
    this.varList = envVarUtil.getVariables();
  }

  public createLogger(logKey: string): Logger {
    const shouldLogTimestamp = this.varList.nodeEnv === 'dev';

    return new Logger(logKey, { timestamp: shouldLogTimestamp });
  }
}
