import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

const FIXED_DATE = new Date('2026-03-16T12:00:00Z');

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(FIXED_DATE);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/cats (GET)', () => {
    return request(app.getHttpServer()).get('/cats').expect(200).expect('[]');
  });

  const tcases: [string, number, any][] = [
    ['/exceptions/predefined', 403, { message: 'Forbidden', statusCode: 403 }],
    [
      '/exceptions/predefined-with-message',
      403,
      { message: 'custom message', error: 'Forbidden', statusCode: 403 },
    ],
    [
      '/exceptions/predefined-with-object',
      403,
      { field1: 'custom field1', field2: 'custom field2' },
    ],
    [
      '/exceptions/plain-http-exception-forbidden',
      403,
      { statusCode: 403, message: 'forbidden' },
    ],
    [
      '/exceptions/plain-http-exception-with-custom-object',
      409,
      { field1: 'custom field1', field2: 'custom field2' },
    ],
    [
      '/exceptions/my-custom-exception',
      409,
      { message: 'This is the custom message' },
    ],
    [
      '/exceptions/my-custom-exception-with-filter',
      409,
      {
        статие: 409,
        годовния: FIXED_DATE.toISOString(),
        path: '/exceptions/my-custom-exception-with-filter',
      },
    ],
  ];

  for (const tcase of tcases) {
    it(tcase[0], () => {
      return request(app.getHttpServer())
        .get(tcase[0])
        .expect(tcase[1])
        .expect(tcase[2]);
    });
  }
});
