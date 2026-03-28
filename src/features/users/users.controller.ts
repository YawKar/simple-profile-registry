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
import { Login } from 'src/auth/decorators/login.decorator';
import { PatchUserDto } from './dtos/patch-user.dto';
import { NoJwt } from 'src/auth/decorators/no-jwt.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

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
  async deleteUser(@Login() login: string) {
    await this.usersService.softDeleteUser(login);
  }

  @ApiBearerAuth('access-token')
  @Patch()
  async patchUser(@Login() login: string, @Body() patchUserDto: PatchUserDto) {
    await this.usersService.patchUser(login, patchUserDto.patches);
  }
}
