import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AppConfig } from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthGuardService } from './auth/services/auth-guard.service';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { ExampleModule } from './example/example.module';

@Module({
  imports: [
    AppConfig.configModule,
    AppConfig.typeormModule,
    AppConfig.jwtModule,
    CommonModule,
    AuthModule,
    UserModule,
    ExampleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuardService,
    },
  ],
})
export class AppModule {}
