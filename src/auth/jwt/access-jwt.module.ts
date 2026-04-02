import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigsModule } from 'src/configs/configs.module';
import { RootConfigService } from 'src/configs/root-config.service';

export const ACCESS_JWT_SERVICE: symbol = Symbol('ACCESS_JWT_SERVICE');

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigsModule],
      inject: [RootConfigService],
      useFactory: (rootConfigService: RootConfigService) => {
        return {
          secret: rootConfigService.auth.jwt.access.secret,
          signOptions: {
            algorithm: 'HS256',
            expiresIn: rootConfigService.auth.jwt.access.expirationDuration,
            allowInsecureKeySizes: false,
          },
        };
      },
    }),
  ],
  providers: [
    {
      provide: ACCESS_JWT_SERVICE,
      useExisting: JwtService,
    },
  ],
  exports: [ACCESS_JWT_SERVICE],
})
export class AccessJwtModule {}
