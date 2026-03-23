import { Test, TestingModule } from '@nestjs/testing';
import setupPostgreSqlContainer from './setup-postgresql-container';
import { AppModule } from 'src/app.module';
import setupGlobals from 'src/common/setup-globals';

export default async function setupControllerEnv(env: NodeJS.ProcessEnv) {
  const pgContainer = await setupPostgreSqlContainer(env);

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  setupGlobals(app);
  return {
    app: await app.init(),
    pgContainer,
  };
}
