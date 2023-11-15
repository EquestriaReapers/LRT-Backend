import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as morgan from 'morgan';
import { CORS } from './constants';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  
  const PORT = configService.get('DB_PORT')|| 3000;

  app.use(json({ limit: '500mb' })); // Tamaño máximo de los datos (60mb)

  app.setGlobalPrefix("api/v1");

  app.use(morgan('dev'));
  app.enableCors(CORS);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.useStaticAssets(join(__dirname, '..', 'uploads'), { // Ruta de las imagenes
    prefix: '/uploads/',
  });


  const config = new DocumentBuilder() // Documentación
  //.addBearerAuth()
  .setTitle('UCAB PERFIL')
  .setDescription('Esta es la api de UCAB PERFIL')
  .addBearerAuth()
  .addTag('users')
  .addTag('profile')
  .addTag('skill')
  .addTag('experience')
  .build();

  const document = SwaggerModule.createDocument(app, config); // Documentación
  SwaggerModule.setup('api', app, document); // Documentación

  await app.listen(PORT);
  console.log(`Application running on: ${await app.getUrl()}`);

}
bootstrap();
