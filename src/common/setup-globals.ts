import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { updateGlobalConfig } from 'nestjs-paginate';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TypeOrmExceptionFilter } from './type-orm-exception.filter';

export default function setupGlobals<Server>(app: INestApplication<Server>) {
  updateGlobalConfig({
    defaultLimit: 10,
    defaultMaxLimit: 100,
    defaultOrigin: undefined,
  });
  app.useGlobalFilters(app.get(TypeOrmExceptionFilter));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'excludeAll',
      excludeExtraneousValues: true,
    }),
  );
  app.useGlobalGuards(app.get<JwtAuthGuard>(JwtAuthGuard));
}
