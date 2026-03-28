import {
  Controller,
  Get,
  NotFoundException,
  Param,
  SerializeOptions,
} from '@nestjs/common';
import {
  USER_ENTITY_PAGINATION_CONFIG,
  UsersService,
} from '../users/users.service';
import { GetProfileResponseDto } from './dtos/get-profile-response.dto';
import { UserEntity } from '../users/entities/user.entity';
import { UserByLoginParam } from '../users/decorators/user-by-login-param.decorator';
import {
  Paginate,
  PaginatedSwaggerDocs,
  type PaginateQuery,
} from 'nestjs-paginate';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

@ApiBearerAuth('access-token')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly usersService: UsersService) {}

  @SerializeOptions({
    strategy: 'exposeAll',
  })
  @PaginatedSwaggerDocs(GetProfileResponseDto, USER_ENTITY_PAGINATION_CONFIG)
  @Get()
  async getProfiles(@Paginate() query: PaginateQuery) {
    const results = await this.usersService.findPaginated(query);
    return {
      ...results,
      data: plainToInstance(GetProfileResponseDto, results.data),
    };
  }

  @Get('me')
  getMyProfile(@UserByLoginParam() user: UserEntity) {
    return new GetProfileResponseDto(user);
  }

  @ApiParam({ name: 'login', type: 'string' })
  @Get(':login')
  async getProfileById(@Param('login') login: string) {
    const user = await this.usersService.findOneByLogin(login);
    if (user === null) {
      throw new NotFoundException();
    }
    return new GetProfileResponseDto(user);
  }
}
