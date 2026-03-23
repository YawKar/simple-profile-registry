import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigsModule } from 'src/configs/configs.module';
import { RootConfigService } from 'src/configs/root-config.service';
import { UserEntity } from 'src/features/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [RootConfigService],
      imports: [ConfigsModule],
      useFactory(rootConfigService: RootConfigService) {
        return {
          synchronize: true, // TODO: make migrations
          type: 'postgres',
          host: rootConfigService.database.host,
          port: rootConfigService.database.port,
          database: rootConfigService.database.dbName,
          username: rootConfigService.database.username,
          password: rootConfigService.database.password,
          entities: [UserEntity],
        };
      },
    }),
  ],
})
export class PostgresqlModule {}
