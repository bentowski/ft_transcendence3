import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';
import { TypeormStore } from 'connect-typeorm';
import { SessionEntity } from './auth/entities/session-entity';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle("Bob l'ePONGe")
    .setDescription('The best game in the submarine world.')
    .setVersion('beta0.0.0.0.1')
    .addTag('user')
    .build();

  //const document = SwaggerModule.createDocument(app, config);
  //SwaggerModule.setup('api', app, document);

  const sessionRepo = app.get(DataSource).getRepository(SessionEntity);
  app.use(
    session({
      cookie: {
        maxAge: 60000 * 60 * 24,
        httpOnly: true,
        //secure: true,
      },
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new TypeormStore().connect(sessionRepo),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3000);
}
bootstrap();
