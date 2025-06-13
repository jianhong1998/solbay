import serverlessExpress from '@codegenie/serverless-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Handler } from 'aws-lambda';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

let server: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser(configService.get('COOKIE_SECRET') ?? 'secret'));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors({
    origin: [configService.get('CLIENT_HOST')],
    credentials: true, // Allow cookies to be sent and received
  });

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();

  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (event, context, callback) => {
  server = server ?? (await bootstrap());
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return server(event, context, callback);
};
