import { Test, TestingModule } from '@nestjs/testing';
import setupPostgreSqlContainer from './setup-postgresql-container';
import { AppModule } from 'src/app.module';
import setupGlobals from 'src/common/setup-globals';
import { CHECK_NODE_DEV_IS_TEST } from './check-node-dev-is-test';
import { DiscoveryModule } from '@nestjs/core';

export default async function setupControllerEnv(env: NodeJS.ProcessEnv) {
  CHECK_NODE_DEV_IS_TEST();

  const pgContainer = await setupPostgreSqlContainer(env);

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule, DiscoveryModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  setupGlobals(app);
  return {
    app: await app.init(),
    pgContainer,
  };
}
