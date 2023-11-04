import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;

  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true }); // Cors para que se pueda acceder desde cualquier lado
  
  app.use(json({ limit: '500mb' })); // Tamaño máximo de los datos (60mb)

  app.setGlobalPrefix("api/v1");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const config = new DocumentBuilder() // Documentación
  //.addBearerAuth()
  .setTitle('UCAB Linkedin')
  .setDescription('Esta es la api de UCAB Linkedin')
  .build();

const document = SwaggerModule.createDocument(app, config); // Documentación
SwaggerModule.setup('api', app, document); // Documentación

  await app.listen(PORT);
}
bootstrap();
