import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser(configService.get('COOKIE_SECRET') ?? 'secret'));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.enableCors({
    origin: [configService.get('CLIENT_HOST')],
    credentials: true, // Allow cookies to be sent and received
  });

  await app.listen(process.env.PORT ?? 3001);
}

void bootstrap();
