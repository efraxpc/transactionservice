import { NestFactory } from '@nestjs/core';
import { TransactionModule } from './transaction/transaction.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// función bootstrap
async function bootstrap() {
  // Crea una instancia de la aplicación NestJS
  const app = await NestFactory.create(TransactionModule);

  // Nueva configuración del documento Swagger
  const config = new DocumentBuilder()
    .setTitle('Transaction API') // Título de la API
    .setDescription('Transaction API description') // Descripción de la API
    .setVersion('1.0') // Versión de la API
    .build(); // Construye el documento

  // Crea un documento Swagger
  const document = SwaggerModule.createDocument(app, config);

  // Configura el módulo Swagger
  SwaggerModule.setup('api', app, document);

  // Inicia la aplicación y escucha las solicitudes en el puerto 3000
  await app.listen(3000);
}

bootstrap();