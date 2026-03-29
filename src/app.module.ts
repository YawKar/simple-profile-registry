import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigsModule } from './configs/configs.module';
import { FeaturesModule } from './features/features.module';
import { ProvidersModule } from './providers/providers.module';

@Module({
  imports: [AuthModule, ConfigsModule, FeaturesModule, ProvidersModule],
})
export class AppModule {}
