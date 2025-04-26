import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';

type IEnvironmentVariableList = {
  // App Operation Related
  nodeEnv: string;
  buildMode: string;
  version: string;
  clientHost: string;
  serverHost: string;

  // Database Related
  databaseHost: string;
  databasePort: number;
  databaseUser: string;
  databasePassword: string;
  databaseDb: string;

  // JWT Related
  jwtSecret: string;
  jwtExpire: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type IFeatureFlagList = {
  // Feature Flag Related
};

@Injectable()
export class EnvironmentVariableUtil {
  private environmentVariableList: IEnvironmentVariableList | undefined;
  private featureFlagList: IFeatureFlagList | undefined;

  constructor(private readonly configService: ConfigService) {}

  public getVariables(): IEnvironmentVariableList {
    if (this.environmentVariableList) return this.environmentVariableList;

    this.environmentVariableList = {
      nodeEnv: this.configService.get('NODE_ENV') ?? 'dev',
      buildMode: this.configService.get('BUILD_MODE') ?? 'tsc',
      version: this.configService.get('VERSION') ?? '-',
      clientHost:
        this.configService.get('CLIENT_HOST') ?? 'http://localhost:3000',
      serverHost:
        this.configService.get('SERVER_HOST') ?? 'http://localhost:3001',

      databaseHost: this.configService.get('DATABASE_HOST') ?? 'localhost',
      databasePort: this.configService.get<number>('DATABASE_PORT') ?? 5432,
      databaseUser: this.configService.get('DATABASE_USER') ?? 'postgres',
      databasePassword:
        this.configService.get('DATABASE_PASSWORD') ?? 'postgres',
      databaseDb: this.configService.get('DATABASE_DB') ?? 'rostering_app_db',

      jwtSecret:
        this.configService.get('JWT_SECRET') ?? randomBytes(16).toString('hex'),
      jwtExpire: this.configService.get('JWT_EXPIRE') ?? '15 mins',
    };

    return this.environmentVariableList;
  }

  public getFeatureFlags(): IFeatureFlagList {
    if (!this.featureFlagList) {
      this.featureFlagList = {};
    }

    return this.featureFlagList;
  }
}
