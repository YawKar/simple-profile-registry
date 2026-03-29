import { Test, TestingModule } from '@nestjs/testing';
import { HashService } from './hash.service';
import { ConfigsModule } from 'src/configs/configs.module';

describe('HashService', () => {
  let service: HashService;

  beforeAll(async () => {
    process.env.CONFIG_FILE = 'test/config/testing.app.yaml';
    process.env.TEST_DB_HOST = 'dummy';
    process.env.TEST_DB_PORT = '5432';

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigsModule],
      providers: [HashService],
      exports: [HashService],
    }).compile();

    service = module.get<HashService>(HashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('a token should have the argon scheme', async () => {
    expect(await service.hash('some-text')).toMatch(
      /^\$argon2id\$v=19\$m=4096,t=3,p=1\$.*$/,
    );
  });

  it('a token should be exactly 96 chars long', async () => {
    expect(await service.hash('some-text')).toHaveLength(96);
  });

  it('two consecutive tokens should be different', async () => {
    expect(await service.hash('some-text')).not.toStrictEqual(
      await service.hash('some-text'),
    );
  });
});
