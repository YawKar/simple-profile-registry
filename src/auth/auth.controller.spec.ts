import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { AuthController } from './auth.controller';
import { INestApplication } from '@nestjs/common';
import ms from 'ms';
import request from 'supertest';
import { App } from 'supertest/types';
import setupControllerEnv from 'test/setup-controller-env';
import { SignInResponseDto } from './dtos/sign-in-response.dto';
import { UsersService } from 'src/features/users/users.service';

describe('AuthController', () => {
  let app: INestApplication<App>;
  let pgContainer: StartedPostgreSqlContainer;
  let controller: AuthController;
  let usersService: UsersService;

  beforeAll(async () => {
    ({ app, pgContainer } = await setupControllerEnv(process.env));
    controller = app.get<AuthController>(AuthController);
    usersService = app.get<UsersService>(UsersService);
  }, ms('30s'));

  afterAll(async () => {
    await pgContainer.stop();
  }, ms('30s'));

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('login should return access_token and refresh_token', async () => {
    const user = {
      login: 'yawkar',
      email: 'yawkar@yaw.co',
      age: 23,
      description: '',
      password: 'Abc_123!',
    };
    await usersService.createNewUser(user);
    const tokens = (
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          login: user.login,
          password: user.password,
        })
        .expect(200)
    ).body as SignInResponseDto;
    expect(tokens).toHaveProperty('access_token');
    expect(tokens).toHaveProperty('refresh_token');
  });

  it('refresh should generate new tokens', async () => {
    const user = {
      login: 'yawkar2',
      email: 'yawkar2@yaw.co',
      age: 23,
      description: '',
      password: 'Abc_123!',
    };
    await usersService.createNewUser(user);
    const tokens = (
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          login: user.login,
          password: user.password,
        })
        .expect(200)
    ).body as SignInResponseDto;

    const newTokens = (
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .auth(tokens.refresh_token, { type: 'bearer' })
        .expect(200)
    ).body as SignInResponseDto;

    expect(tokens).not.toEqual(newTokens);
  });
});
