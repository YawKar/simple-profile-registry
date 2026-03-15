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
} from '@nestjs/common';
import { AppService } from './app.service';
import { type IncomingHttpHeaders } from 'node:http';
import { type ParsedQs } from 'qs';
import { CatsService } from './cats/cats.service';
import { Cat } from './cats/interfaces/cat.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

class CreateCatDto {
  name: string;
  age: number;
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
  createCat(@Body() createCatDto: CreateCatDto) {
    if (createCatDto === undefined) {
      throw new BadRequestException();
    }
    this.catsService.create(createCatDto);
  }
}

@Controller('me')
export class MeController {
  @Get()
  @HttpCode(201)
  @Header('Cache-Control', 'none')
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
