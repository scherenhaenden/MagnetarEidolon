import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
    },
  });

  app.setGlobalPrefix('api');
  await app.listen(3100, '0.0.0.0');
}

void bootstrap();
