import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/features/users/users.service';
import { HashService } from 'src/common/hash/hash.service';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayload } from './dtos/access-token-payload';
import { ACCESS_JWT_SERVICE } from './jwt/access-jwt.module';
import { REFRESH_JWT_SERVICE } from './jwt/refresh-jwt.module';
import { RefreshTokenPayload } from './dtos/refresh-token-payload';
import { randomUUID } from 'crypto';
import { SignInResponseDto } from './dtos/sign-in-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly hashService: HashService,
    @Inject(ACCESS_JWT_SERVICE)
    private accessJwtService: JwtService,
    @Inject(REFRESH_JWT_SERVICE)
    private refreshJwtService: JwtService,
  ) {}

  async validateUser(login: string, password: string) {
    const user = await this.usersService.findOneByLogin(login, {
      login: true,
      hashedPassword: true,
    });
    if (
      user === null ||
      !(await this.hashService.compare(password, user.hashedPassword))
    ) {
      throw new UnauthorizedException();
    }

    return user.login;
  }

  async refresh(
    login: string,
    givenRefreshTokenId: any,
  ): Promise<SignInResponseDto> {
    if (typeof givenRefreshTokenId !== 'string') {
      throw new UnauthorizedException();
    }
    const isMatch = await this.usersService.doRefreshTokensMatch(
      login,
      givenRefreshTokenId,
    );
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    return await this.login(login);
  }

  async login(login: string): Promise<SignInResponseDto> {
    const user = await this.usersService.findOneByLogin(login);
    if (!user) {
      throw new UnauthorizedException();
    }

    const accessPayload: AccessTokenPayload = { login };
    const refreshPayload: RefreshTokenPayload = {
      id: randomUUID(),
      login,
    };

    await this.usersService.updateRefreshToken(login, refreshPayload.id);

    return {
      access_token: await this.accessJwtService.signAsync(accessPayload),
      refresh_token: await this.refreshJwtService.signAsync(refreshPayload),
    };
  }

  async logout(login: string, givenRefreshTokenId: any): Promise<void> {
    if (typeof givenRefreshTokenId !== 'string') {
      throw new UnauthorizedException();
    }
    const isMatch = await this.usersService.doRefreshTokensMatch(
      login,
      givenRefreshTokenId,
    );
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    await this.usersService.invalidateRefreshToken(login);
  }
}
