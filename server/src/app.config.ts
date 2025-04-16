import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { DataSource } from 'typeorm';

import DatabaseConfig from './database/database.config';

export class AppConfig {
  private constructor() {}

  public static configModule = ConfigModule.forRoot({
    envFilePath: ['.env'],
    cache: false,
    isGlobal: true,
  });

  public static typeormModule = TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      DatabaseConfig.getConfig(configService),
    dataSourceFactory: async (options) =>
      await new DataSource(options).initialize(),
  });

  public static jwtModule = JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    global: true,
    useFactory: (configService: ConfigService) => ({
      secret:
        configService.get('JWT_SECRET') ?? randomBytes(16).toString('hex'),
      signOptions: {
        expiresIn: configService.get('JWT_EXPIRE') ?? '15 mins',
      },
    }),
  });
}
