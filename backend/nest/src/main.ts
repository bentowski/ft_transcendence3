import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
//import * as session from 'express-session';
//import * as passport from 'passport';
//import { TypeormStore } from 'connect-typeorm';
//import { SessionEntity } from './auth/entities/session-entity';
//import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: true, //['http://localhost:3000'],
  });

  app.use(cookieParser());

  //const sessionRepo = app.get(DataSource).getRepository(SessionEntity);

  const config = new DocumentBuilder()
    .setTitle("Bob l'ePONGe")
    .setDescription('The best game in the submarine world.')
    .setVersion('beta0.0.0.0.1')
    .addTag('user')
    .build();

  //const document = SwaggerModule.createDocument(app, config);
  //SwaggerModule.setup('api', app, document);

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
