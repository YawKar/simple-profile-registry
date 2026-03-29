import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import ms from 'ms';
import { UsersService } from './users.service';
import { CreateUserResponseDto } from './dtos/create-user-response.dto';
import { SignInResponseDto } from 'src/auth/dtos/sign-in-response.dto';
import setupControllerEnv from 'test/utils/setup-controller-env';
import { truncateAllDataSources } from 'test/utils/truncate-all-data-sources';
import { clearThrottlingStorage } from 'test/utils/clear-throttling-storage';

describe('UsersController (e2e)', () => {
  let app: INestApplication<App>;
  let usersService: UsersService;
  let pgContainer: StartedPostgreSqlContainer;

  beforeAll(async () => {
    ({ app, pgContainer } = await setupControllerEnv(process.env));
    usersService = app.get<UsersService>(UsersService);
  }, ms('30s'));

  afterAll(async () => {
    await pgContainer.stop();
  }, ms('30s'));

  beforeEach(async () => {
    clearThrottlingStorage(app);
    await truncateAllDataSources(app);
  });

  it('create new user successfully', async () => {
    const user = await request(app.getHttpServer())
      .post('/users/new')
      .send({
        login: 'yawkar',
        age: 23,
        email: 'yawkar@yawka.co',
        description: 'just a regular',
        password: 'Abc_123!',
      })
      .expect(201);
    expect(user.body).toHaveProperty('id');
    expect((user.body as CreateUserResponseDto).id).toHaveLength(36);
  });

  it('cannot register without description', async () => {
    await request(app.getHttpServer())
      .post('/users/new')
      .send({
        login: 'yawkar2',
        email: 'yawkar2@yawka.co',
        age: 23,
        password: 'Abc_123!',
      })
      .expect(400);
    await request(app.getHttpServer())
      .post('/users/new')
      .send({
        login: 'yawkar3',
        email: 'yawkar3@yawka.co',
        age: 23,
        description: '', // empty
        password: 'Abc_123!',
      })
      .expect(201);
  });

  it('delete user successfully', async () => {
    const user = {
      login: 'yawkar4',
      age: 23,
      email: 'yawkary4@yawka.co',
      description: 'just a regular',
      password: 'Abc_123!',
    };
    await request(app.getHttpServer())
      .post('/users/new')
      .send(user)
      .expect(201);
    await expect(
      usersService.findOneByLogin(user.login),
    ).resolves.not.toBeNull();
    const creds = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        login: user.login,
        password: user.password,
      })
      .expect(200);
    expect(creds.body).toHaveProperty('access_token');
    expect(creds.body).toHaveProperty('refresh_token');
    await request(app.getHttpServer())
      .delete('/users')
      .auth((creds.body as SignInResponseDto).access_token, { type: 'bearer' })
      .expect(204);
    await expect(usersService.findOneByLogin(user.login)).resolves.toBeNull();
  });
});
