import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { AuthService } from './auth.service';
import ms from 'ms';
import { UsersService } from 'src/features/users/users.service';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import setupControllerEnv from 'test/setup-controller-env';
import { JwtService } from '@nestjs/jwt';
import { REFRESH_JWT_SERVICE } from './jwt/refresh-jwt.module';
import { RefreshTokenPayload } from './dtos/refresh-token-payload';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let refreshJwtService: JwtService;
  let app: INestApplication<App>;
  let pgContainer: StartedPostgreSqlContainer;

  beforeAll(async () => {
    ({ app, pgContainer } = await setupControllerEnv(process.env));

    service = app.get<AuthService>(AuthService);
    usersService = app.get<UsersService>(UsersService);
    refreshJwtService = app.get<JwtService>(REFRESH_JWT_SERVICE);
  }, ms('30s'));

  afterAll(async () => {
    await pgContainer.stop();
  }, ms('30s'));

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should signIn an existing user', async () => {
    await usersService.createNewUser({
      age: 30,
      description: 'just a regular everyday normal motherfucker',
      email: 'motherfucker@jonlajoie.com',
      login: 'jon-lajoie',
      password: 'regulareveryday',
    });
    await expect(
      service.validateUser('jon-lajoie', 'regulareveryday'),
    ).resolves.not.toThrow();
    await usersService.softDeleteUser('jon-lajoie');
  });

  it('should throw unauthorized on a non-existing user', async () => {
    await expect(
      service.validateUser('jon-lajoie2', 'regulareveryday2'),
    ).rejects.toThrow(/Unauthorized/);
  });

  it('should throw on a login for a non-existing user', async () => {
    await expect(service.login('oasenuthoesuntohe')).rejects.toThrow(
      /Unauthorized/,
    );
  });

  it('should refresh tokens on refresh', async () => {
    const user = {
      age: 30,
      description: '',
      email: 'user1@mail.com',
      login: 'user1',
      password: 'user1Abc!_',
    };
    await usersService.createNewUser(user);

    const tokens = await service.login(user.login);
    const refreshPayload =
      await refreshJwtService.verifyAsync<RefreshTokenPayload>(
        tokens.refresh_token,
      );
    await expect(
      usersService.doRefreshTokensMatch(user.login, refreshPayload.id),
    ).resolves.toBe(true);

    const newTokens = await service.refresh(user.login, refreshPayload.id);
    const newRefreshPayload =
      await refreshJwtService.verifyAsync<RefreshTokenPayload>(
        newTokens.refresh_token,
      );
    await expect(
      usersService.doRefreshTokensMatch(user.login, newRefreshPayload.id),
    ).resolves.toBe(true);
  });
});
