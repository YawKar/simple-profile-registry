import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController, CatsController, MeController } from './app.controller';
import { AppService } from './app.service';
import { CatsService } from './cats/cats.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ExceptionsController } from './exceptions/exceptions.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    CatsController,
    MeController,
    ExceptionsController,
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
