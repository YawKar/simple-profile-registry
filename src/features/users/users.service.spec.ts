import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import ms from 'ms';
import { UsersService } from 'src/features/users/users.service';
import setupControllerEnv from 'test/utils/setup-controller-env';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { truncateAllDataSources } from 'test/utils/truncate-all-data-sources';
import { clearThrottlingStorage } from 'test/utils/clear-throttling-storage';

describe('UsersService', () => {
  let usersService: UsersService;
  let pgContainer: StartedPostgreSqlContainer;
  let app: INestApplication<App>;

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

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('should create new users and be able to soft delete them without finding them after', async () => {
    await expect(
      usersService.createNewUser({
        age: 1,
        description: 'some guy',
        email: 'some@guy.com',
        login: 'someguy',
        password: 'someguyspassword',
      }),
    ).resolves.not.toThrow();
    await expect(usersService.softDeleteUser('someguy')).resolves.not.toThrow();
    await expect(usersService.findOneByLogin('someguy')).resolves.toBeNull();
  });

  it('should patch', async () => {
    await expect(
      usersService.createNewUser({
        age: 10,
        description: 'some guy',
        email: 'some2@guy.com',
        login: 'someguy2',
        password: 'someguyspassword',
      }),
    ).resolves.not.toThrow();
    await expect(
      usersService.patchUser('someguy2', {
        age: 2,
        description: 'just some guy',
      }),
    ).resolves.toHaveProperty('affected', 1);
    const user = await usersService.findOneByLogin('someguy2');
    expect(user).not.toBeNull();
    expect(user).toHaveProperty('age', 2);
    expect(user).toHaveProperty('description', 'just some guy');
    await expect(
      usersService.softDeleteUser('someguy2'),
    ).resolves.not.toThrow();
  });

  it('should not patch after softDelete', async () => {
    await expect(
      usersService.createNewUser({
        age: 10,
        description: 'some guy',
        email: 'some3@guy.com',
        login: 'someguy3',
        password: 'someguyspassword',
      }),
    ).resolves.not.toThrow();
    await expect(
      usersService.softDeleteUser('someguy3'),
    ).resolves.toHaveProperty('affected', 1);
    await expect(
      usersService.patchUser('someguy3', {
        age: 2,
        description: 'just some guy',
      }),
    ).resolves.toHaveProperty('affected', 0);
    await expect(usersService.findOneByLogin('someguy3')).resolves.toBeNull();
  });
});
