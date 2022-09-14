import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
//import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  //const config: ConfigService = app.get(ConfigService);
  //const port: number = config.get<number>('POSTGRES_PORT');
  //app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true}));
  await app.listen(3000);
}
bootstrap();
