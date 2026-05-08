import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server: express.Express = express();

const createNestServer = async (expressInstance: express.Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.init();
};

createNestServer(server);

export default server;
