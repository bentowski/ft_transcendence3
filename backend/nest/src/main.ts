import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';
import { TypeormStore } from 'connect-typeorm';
import { SessionEntity } from './auth/entities/session-entity';
import { DataSource } from 'typeorm';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: ['http://localhost:3000'],
      methods: ['GET', 'POST'],
    },
  });

  const config = new DocumentBuilder()
    .setTitle("Bob l'ePONGe")
    .setDescription('The best game in the submarine world.')
    .setVersion('beta0.0.0.0.1')
    .addTag('user')
    .build();

  //const document = SwaggerModule.createDocument(app, config);
  //SwaggerModule.setup('api', app, document);

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
  //app.use(cookieParser());
  //app.use(bodyParser.urlencoded({ extended: true }));
  app.use(passport.initialize());
  app.use(passport.session());
  //app.get('/profile', (req, res) => {
  //  req.session.isAuth = true;
  //  req.send('Hello Welcome session');
  //});

  //app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
