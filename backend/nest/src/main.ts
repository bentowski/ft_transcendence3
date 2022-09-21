import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  //const config: ConfigService = app.get(ConfigService);
  //const port: number = config.get<number>('POSTGRES_PORT');
  //app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true}));

  const config = new DocumentBuilder()
      .setTitle('Bob l\'ePONGe')
      .setDescription('The best game in the submarine world.')
      .setVersion('beta0.0.0.0.1')
      .addTag('user')
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);

}
bootstrap();
