import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { UsersRepository } from './users.repository';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import setupControllerEnv from 'test/utils/setup-controller-env';
import ms from 'ms';
import { clearThrottlingStorage } from 'test/utils/clear-throttling-storage';
import { truncateAllDataSources } from 'test/utils/truncate-all-data-sources';

describe('UsersRepository', () => {
  let pgContainer: StartedPostgreSqlContainer;
  let app: INestApplication<App>;
  let usersRepository: UsersRepository;

  beforeAll(async () => {
    ({ app, pgContainer } = await setupControllerEnv(process.env));
    usersRepository = app.get<UsersRepository>(UsersRepository);
  }, ms('30s'));

  afterAll(async () => {
    await pgContainer.stop();
  }, ms('30s'));

  beforeEach(async () => {
    clearThrottlingStorage(app);
    await truncateAllDataSources(app);
  });

  it('should be defined', () => {
    expect(usersRepository).toBeDefined();
  });
});
