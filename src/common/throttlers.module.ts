import { Module } from '@nestjs/common';
import {
  ThrottlerGuard,
  ThrottlerModule,
  ThrottlerOptions,
  ThrottlerStorageService,
} from '@nestjs/throttler';
import ms from 'ms';
import { ConfigsModule } from 'src/configs/configs.module';
import { SingleThrottlerConfig } from 'src/configs/root-config';
import { RootConfigService } from 'src/configs/root-config.service';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigsModule],
      inject: [RootConfigService],
      useFactory: (rootConfigService: RootConfigService) => ({
        throttlers: (() => {
          const throttlers: ThrottlerOptions[] = [];
          for (const key in rootConfigService.server.throttle) {
            const throttlerConfig = rootConfigService.server.throttle[
              key
            ] as SingleThrottlerConfig;
            throttlers.push({
              name: key,
              ttl: ms(throttlerConfig.ttl),
              limit: throttlerConfig.limit,
            });
          }
          return throttlers;
        })(),
      }),
    }),
  ],
  providers: [ThrottlerGuard, ThrottlerStorageService],
})
export class ThrottlersModule {}
