import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigsModule } from 'src/configs/configs.module';
import { RootConfigService } from 'src/configs/root-config.service';

export const REFRESH_JWT_SERVICE: symbol = Symbol('REFRESH_JWT_SERVICE');

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigsModule],
      inject: [RootConfigService],
      useFactory: (rootConfigService: RootConfigService) => {
        return {
          secret: rootConfigService.auth.jwt.refresh.secret,
          signOptions: {
            algorithm: 'HS256',
            expiresIn: rootConfigService.auth.jwt.refresh.expirationDuration,
            allowInsecureKeySizes: false,
          },
        };
      },
    }),
  ],
  providers: [
    {
      provide: REFRESH_JWT_SERVICE,
      useExisting: JwtService,
    },
  ],
  exports: [REFRESH_JWT_SERVICE],
})
export class RefreshJwtModule {}
