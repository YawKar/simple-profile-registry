import setupControllerEnv from 'test/setup-controller-env';
import { INestApplication } from '@nestjs/common';
import { Paginated } from 'nestjs-paginate';
import request from 'supertest';
import { App } from 'supertest/types';
import ms from 'ms';
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { UsersService } from '../users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { GetProfileResponseDto } from './dtos/get-profile-response.dto';
import { CreateUserRequestDto } from '../users/dtos/create-user-request.dto';

describe('ProfilesController', () => {
  let app: INestApplication<App>;
  let usersService: UsersService;
  let authService: AuthService;
  let pgContainer: StartedPostgreSqlContainer;

  beforeAll(async () => {
    ({ app, pgContainer } = await setupControllerEnv(process.env));
    await app.init();
    usersService = app.get<UsersService>(UsersService);
    authService = app.get<AuthService>(AuthService);
  }, ms('30s'));

  afterAll(async () => {
    await pgContainer.stop();
  }, ms('30s'));

  it('get my own profile', async () => {
    const user = {
      login: 'abc',
      email: 'abc@abc.abc',
      age: 123,
      password: 'Abc1_23!',
      description: 'lol',
    };
    await usersService.createNewUser(user);
    const { access_token } = await authService.login(user.login);
    const profileDto: GetProfileResponseDto = (
      await request(app.getHttpServer())
        .get('/profiles/me')
        .auth(access_token, { type: 'bearer' })
        .expect(200)
    ).body as GetProfileResponseDto;
    for (const key in user) {
      if (key === 'password') continue;
      expect(profileDto[key]).toEqual(user[key]);
    }
  });

  it('get list of profiles', async () => {
    const users: CreateUserRequestDto[] = [];
    for (let i = 1; i <= 5; i++) {
      users.push({
        login: `specificUser${i}`,
        email: `specificUser${i}@abc.abc`,
        age: 123,
        password: 'Abc1_23!',
        description: 'lol',
      });
      await usersService.createNewUser(users.at(-1)!);
    }

    const viewer = users[0];
    const { access_token } = await authService.login(viewer.login);

    const response = (
      await request(app.getHttpServer())
        .get('/profiles')
        .query({
          page: 1,
          limit: 5,
          sortBy: 'login:ASC',
          search: 'specificUser',
          searchBy: ['login'],
        })
        .auth(access_token, { type: 'bearer' })
        .expect(200)
    ).body as Paginated<GetProfileResponseDto>;
    expect(response.data).toEqual(
      users.map((user) => {
        const { password, ...withoutPassword } = user;
        return withoutPassword;
      }),
    );
  });

  it('get profile by login', async () => {
    const user: CreateUserRequestDto = {
      login: 'test.user',
      email: 'test.user@test.com',
      age: 123,
      password: 'Abc1_23!',
      description: 'lol',
    };
    await usersService.createNewUser(user);

    const anotherUser = {
      ...user,
      login: 'another.user',
      email: 'another.user@test.com',
    };
    await usersService.createNewUser(anotherUser);

    const { access_token } = await authService.login(user.login);

    const response = (
      await request(app.getHttpServer())
        .get(`/profiles/${anotherUser.login}`)
        .auth(access_token, { type: 'bearer' })
        .expect(200)
    ).body as GetProfileResponseDto;
    const { password, ...withoutPassword } = anotherUser;
    expect(response).toEqual(withoutPassword);
  });
});
