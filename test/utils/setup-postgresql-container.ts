import { Test, TestingModule } from '@nestjs/testing';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import ms from 'ms';
import { ConfigsModule } from 'src/configs/configs.module';
import { RootConfigService } from 'src/configs/root-config.service';
import { CHECK_NODE_DEV_IS_TEST } from './check-node-dev-is-test';

export default async function setupPostgreSqlContainer(env: NodeJS.ProcessEnv) {
  CHECK_NODE_DEV_IS_TEST();

  env.CONFIG_FILE = 'test/config/testing.app.yaml';
  env.TEST_DB_HOST = 'dummy-host-dont-use-it';
  env.TEST_DB_PORT = '5432';

  const configModule: TestingModule = await Test.createTestingModule({
    imports: [ConfigsModule],
  }).compile();
  const config = configModule.get<RootConfigService>(RootConfigService);

  const pgContainer = await new PostgreSqlContainer('postgres:18-alpine3.23')
    .withResourcesQuota({
      cpu: 1,
      memory: 0.5,
    })
    .withDatabase(config.database.dbName)
    .withUsername(config.database.username)
    .withPassword(config.database.password)
    .withExposedPorts(config.database.port)
    .withStartupTimeout(ms('30s'))
    .start();

  env.TEST_DB_HOST = pgContainer.getHost();
  env.TEST_DB_PORT = pgContainer.getMappedPort(config.database.port).toString();

  return pgContainer;
}
