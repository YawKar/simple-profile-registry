import { INestApplication } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { CHECK_NODE_DEV_IS_TEST } from './check-node-dev-is-test';

export async function truncateAllDataSources(app: INestApplication) {
  CHECK_NODE_DEV_IS_TEST();
  const discoveryService = app.get<DiscoveryService>(DiscoveryService);
  const dataSources = discoveryService
    .getProviders()
    .filter((provider) => provider.instance instanceof DataSource)
    .map((provider) => provider.instance as DataSource);
  for (const ds of dataSources) {
    // dropBeforeSync = true
    await ds.synchronize(true);
  }
}
