import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
      // أضف هذا
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3002', 'http://127.0.0.1:3002'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });
  app.use(cookieParser());   // ←←← هذا السطر مهم
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
