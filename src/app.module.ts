import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import {
  AppController,
  CatsController,
  MeController,
  PipesController,
  TimeoutController,
  UsersController,
} from './app.controller';
import { AppService } from './app.service';
import { CatsService } from './cats/cats.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ExceptionsController } from './exceptions/exceptions.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [process.env.ENV_FILE!],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'prestable', 'stable')
          .required(),
        PORT: Joi.number().port().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().port().required(),
        DB_NAME: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        database: configService.get<string>('DB_NAME'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        entities: [User],
        synchronize: true,
      }),
    }),
  ],
  controllers: [
    AppController,
    CatsController,
    MeController,
    ExceptionsController,
    PipesController,
    TimeoutController,
    UsersController,
  ],
  providers: [AppService, CatsService, UsersService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(CatsController)
      .apply(LoggerMiddleware)
      .forRoutes({
        path: 'me{/*anything}', // this one will include the `/me`, `/me/` and `/me/whatever123-lse`
        // path: 'me/{*anything}',
        method: RequestMethod.GET,
      });
  }
}
