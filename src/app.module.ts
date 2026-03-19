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
} from './app.controller';
import { AppService } from './app.service';
import { CatsService } from './cats/cats.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ExceptionsController } from './exceptions/exceptions.controller';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'prestable', 'stable')
          .required(),
        PORT: Joi.number().port().required(),
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
  ],
  providers: [AppService, CatsService],
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
