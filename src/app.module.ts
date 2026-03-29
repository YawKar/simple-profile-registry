import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigsModule } from './configs/configs.module';
import { FeaturesModule } from './features/features.module';
import { ProvidersModule } from './providers/providers.module';
import { CommonModule } from './common/common.module';
import { ThrottlersModule } from './common/throttlers.module';

@Module({
  imports: [
    AuthModule,
    CommonModule,
    ConfigsModule,
    FeaturesModule,
    ProvidersModule,
    ThrottlersModule,
  ],
})
export class AppModule {}
