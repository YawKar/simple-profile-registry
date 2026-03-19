import {
  Controller,
  Get,
  Ip,
  Headers,
  Body,
  Param,
  Query,
  HttpCode,
  Header,
  Post,
  BadRequestException,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  UseGuards,
  UseInterceptors,
  All,
} from '@nestjs/common';
import { AppService } from './app.service';
import { type IncomingHttpHeaders } from 'node:http';
import { type ParsedQs } from 'qs';
import { CatsService } from './cats/cats.service';
import { Cat } from './cats/interfaces/cat.interface';
import { IsInt, IsString } from 'class-validator';
import { MyGuardGuard, Roles } from './my-guard/my-guard.guard';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

class CreateCatDto {
  @IsString()
  name: string;
  @IsInt()
  age: number;
  @IsString()
  breed: string;
}

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Get()
  findAll(): Cat[] {
    return this.catsService.findAll();
  }

  @Post()
  @UsePipes(ValidationPipe)
  createCat(@Body() createCatDto: CreateCatDto) {
    if (createCatDto === undefined) {
      throw new BadRequestException();
    }
    this.catsService.create(createCatDto);
  }
}

@Controller('pipes')
export class PipesController {
  @Get(':id')
  getPipe(@Param('id', ParseIntPipe) id: number) {
    return `The number is correct: ${id}!`;
  }
}

@UseGuards(MyGuardGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('me')
export class MeController {
  @Get()
  @HttpCode(201)
  @Header('Cache-Control', 'none')
  @Roles(['Admin', 'Friend'])
  getMeInfo(
    @Ip() ip: string,
    @Param() params: string[],
    @Query() query: ParsedQs,
    @Headers() headers: IncomingHttpHeaders,
    @Body() body: string,
  ) {
    return {
      ip,
      params,
      query,
      headers,
      body,
    };
  }
}

@Controller('timeout')
export class TimeoutController {
  @UseInterceptors(TimeoutInterceptor, LoggingInterceptor)
  @All()
  async shouldTimeout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
}
