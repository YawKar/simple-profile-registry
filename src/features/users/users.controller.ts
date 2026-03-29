import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserRequestDto } from './dtos/create-user-request.dto';
import { UsersService } from './users.service';
import { CreateUserResponseDto } from './dtos/create-user-response.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { NoJwt } from 'src/auth/decorators/no-jwt.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUserLogin } from 'src/auth/decorators/current-user-login.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @NoJwt()
  @Post('new')
  async createNewUser(@Body() createUserRequestDto: CreateUserRequestDto) {
    const user = await this.usersService.createNewUser(createUserRequestDto);
    return new CreateUserResponseDto(user);
  }

  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async deleteUser(@CurrentUserLogin() login: string) {
    await this.usersService.softDeleteUser(login);
    await this.usersService.invalidateRefreshToken(login);
  }

  @ApiBearerAuth('access-token')
  @Patch()
  async patchUser(
    @CurrentUserLogin() login: string,
    @Body() patchUserDto: PatchUserDto,
  ) {
    await this.usersService.patchUser(login, patchUserDto.patches);
  }
}
