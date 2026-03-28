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
import { Login } from './decorators/login.decorator';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { SignInRequestDto } from './dtos/sign-in-request.dto';
import { JwtRefreshAuthGuard } from './jwt-refresh-auth.guard';
import { type Request } from 'express';

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
  async signIn(@Login() login?: string): Promise<SignInResponseDto> {
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
    @Login() login: string,
    @Req() request: Request,
  ): Promise<SignInResponseDto> {
    const refreshTokenId: unknown = request?.user?.['id'];
    return await this.authService.refresh(login, refreshTokenId);
  }
}
