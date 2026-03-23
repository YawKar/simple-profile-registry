import { Module } from '@nestjs/common';
import { PostgresqlModule } from './postgresql/postgresql.module';

@Module({
  imports: [PostgresqlModule],
})
export class DatabasesModule {}
