import { Module } from '@nestjs/common';
import { TypeOrmExceptionFilter } from './type-orm-exception.filter';
import { ThrottlersModule } from './throttlers.module';

@Module({
  providers: [TypeOrmExceptionFilter],
  imports: [ThrottlersModule],
})
export class CommonModule {}
