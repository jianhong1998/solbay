import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { DataSourceOptions } from 'typeorm';

import { ENTITY_MODELS } from './entity-model';

export default class DatabaseConfig {
  private static synchroniseEnabledEnvSet = new Set(['dev', 'local']);
  private static sslEnabledEnvSet = new Set(['dev', 'staging', 'prod']);

  static getConfig(configService: ConfigService): DataSourceOptions {
    const migrationPathName = join(__dirname, '/migrations/*.{js,ts}');
    const buildMode = configService.get('BUILD_MODE') ?? 'tsc';

    let pathToRootFolder = '../../../';

    if (buildMode === 'webpack') pathToRootFolder = '../';
    if (buildMode === 'swc') pathToRootFolder = '../../';

    const rscaPath = join(
      __dirname,
      pathToRootFolder,
      'ap-southeast-1-bundle.pem',
    );
    const pemCa = readFileSync(rscaPath);

    return {
      type: 'postgres',
      host: configService.get('DATABASE_HOST') ?? 'localhost',
      port: configService.get<number>('DATABASE_PORT') ?? 5432,
      username: configService.get('DATABASE_USER') ?? 'postgres',
      password: configService.get('DATABASE_PASSWORD') ?? 'postgres',
      database: configService.get('DATABASE_DB') ?? 'rostering_app_db',
      entities: ENTITY_MODELS,
      migrations: [migrationPathName],
      migrationsRun: true,
      synchronize: this.synchroniseEnabledEnvSet.has(
        configService.get('NODE_ENV'),
      ),
      ssl: this.sslEnabledEnvSet.has(configService.get('NODE_ENV'))
        ? {
            rejectUnauthorized: true,
            ca: [pemCa],
          }
        : undefined,
    };
  }
}
