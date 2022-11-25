import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
//import * as csurf from 'csurf';
//import * as express from 'express';
//import { DocumentBuilder } from '@nestjs/swagger';
//import { DataSource } from 'typeorm';
//import bodyParser from 'body-parser';
//import * as session from 'express-session';
//import * as passport from 'passport';
//import { TypeormStore } from 'connect-typeorm';
//import { SessionEntity } from './auth/entities/session-entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
      cors: {
        credentials: true,
        origin: true
      },
    });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
