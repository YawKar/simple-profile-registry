import { INestApplication } from '@nestjs/common';
import { CHECK_NODE_DEV_IS_TEST } from './check-node-dev-is-test';
import { ThrottlerStorageService } from '@nestjs/throttler';

export function clearThrottlingStorage(app: INestApplication) {
  CHECK_NODE_DEV_IS_TEST();
  const throttlerStorageService = app.get<ThrottlerStorageService>(
    ThrottlerStorageService,
  );
  throttlerStorageService.storage.clear();
}
