import { Module } from '@nestjs/common';
import { TypeOrmExceptionFilter } from './type-orm-exception.filter';

@Module({
  providers: [TypeOrmExceptionFilter],
})
export class CommonModule {}
