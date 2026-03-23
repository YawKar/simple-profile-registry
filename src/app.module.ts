import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigsModule } from './configs/configs.module';
import { FeaturesModule } from './features/features.module';
import { ProvidersModule } from './providers/providers.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    AuthModule,
    ConfigsModule,
    FeaturesModule,
    ProvidersModule,
    CommonModule,
  ],
})
export class AppModule {}
