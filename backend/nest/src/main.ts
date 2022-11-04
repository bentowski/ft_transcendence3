import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';

//import { DocumentBuilder } from '@nestjs/swagger';
//import { DataSource } from 'typeorm';
//import bodyParser from 'body-parser';
//import { ValidationPipe } from '@nestjs/common';
//import * as session from 'express-session';
//import * as passport from 'passport';
//import { TypeormStore } from 'connect-typeorm';
//import { SessionEntity } from './auth/entities/session-entity';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      credentials: true,
      origin: true,
    },
  });
  app.use(cookieParser());

  /*
 const sessionRepo = app
   .get(AppModule)
   .getDataSource()
   .getRepository(SessionEntity);
 app.use(
   session({
     cookie: {
       maxAge: 10 * 1000,
       httpOnly: true,
       //secure: true,
     },
     name: 'come to the dark side we have cookies',
     secret: process.env.SESSION_SECRET,
     resave: false,
     saveUninitialized: false,
     store: new TypeormStore({
       cleanupLimit: 2,
       limitSubquery: false,
       ttl: 10 * 1000,
     }).connect(sessionRepo),
   }),
 );
 //app.use(bodyParser.urlencoded({ extended: true }));
 //app.get('/profile', (req, res) => {
 //  req.session.isAuth = true;
 //  req.send('Hello Welcome session');
 //});
 */

  //app.use(passport.initialize());
  //app.use(passport.authenticate('42', { failureRedirect: '/auth/login' }));
  //app.use(passport.session());

  //SWITCH THIS FOLLOWING METHOD ON BEFORE PRODUCTION
  //app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
