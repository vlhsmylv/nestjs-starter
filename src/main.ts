import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Cookie parser
  app.use(cookieParser());

  // CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('NestJS Authentication API')
    .setDescription(
      `
      A secure authentication and user management API built with NestJS.
      
      ## Features
      - JWT Authentication with HTTP-Only Cookies
      - Email Verification with OTP
      - User Profile Management
      - Password Management
      - Field-level Encryption
      - Rate Limiting
      
      ## Authentication
      This API uses JWT tokens stored in HTTP-only cookies for authentication.
      After successful login, the token will be automatically included in subsequent requests.
    `,
    )
    .setVersion('1.0')
    .addTag('Authentication', 'Authentication related endpoints')
    .addTag('User', 'User management endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addCookieAuth(
      'auth-cookie',
      {
        type: 'apiKey',
        in: 'cookie',
        name: 'auth-cookie',
      },
      'cookie-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation available at: ${await app.getUrl()}/api`);
}
bootstrap();
