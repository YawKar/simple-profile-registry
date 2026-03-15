import { Module } from '@nestjs/common';
import { AppController, CatsController, MeController } from './app.controller';
import { AppService } from './app.service';
import { CatsService } from './cats/cats.service';

@Module({
  imports: [],
  controllers: [AppController, CatsController, MeController],
  providers: [AppService, CatsService],
})
export class AppModule {}
