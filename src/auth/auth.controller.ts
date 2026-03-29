import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { NoJwt } from './decorators/no-jwt.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { SignInResponseDto } from './dtos/sign-in-response.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { SignInRequestDto } from './dtos/sign-in-request.dto';
import { JwtRefreshAuthGuard } from './jwt-refresh-auth.guard';
import { type Request } from 'express';
import { CurrentUserLogin } from './decorators/current-user-login.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({
    type: SignInRequestDto,
  })
  @UseGuards(LocalAuthGuard)
  @NoJwt()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@CurrentUserLogin() login?: string): Promise<SignInResponseDto> {
    if (login === undefined) {
      throw new UnauthorizedException();
    }
    const tokens = await this.authService.login(login);
    return new SignInResponseDto(tokens);
  }

  @ApiBearerAuth('refresh-token')
  @UseGuards(JwtRefreshAuthGuard)
  @NoJwt()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @CurrentUserLogin() login: string,
    @Req() request: Request,
  ): Promise<SignInResponseDto> {
    const refreshTokenId: unknown = request?.user?.['id'];
    return await this.authService.refresh(login, refreshTokenId);
  }

  @ApiBearerAuth('refresh-token')
  @UseGuards(JwtRefreshAuthGuard)
  @NoJwt()
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @CurrentUserLogin() login: string,
    @Req() request: Request,
  ): Promise<void> {
    const refreshTokenId: unknown = request?.user?.['id'];
    await this.authService.logout(login, refreshTokenId);
  }
}
