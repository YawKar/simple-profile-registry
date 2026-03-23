import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { PostgresqlModule } from 'src/providers/databases/postgresql/postgresql.module';
import { HashModule } from 'src/auth/hash/hash.module';

@Module({
  imports: [
    HashModule,
    PostgresqlModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
