import { Module } from '@nestjs/common';
import { ConfigsModule } from 'src/configs/configs.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/features/users/users.module';
import { HashModule } from 'src/common/hash/hash.module';
import { AccessJwtModule } from './jwt/access-jwt.module';
import { RefreshJwtModule } from './jwt/refresh-jwt.module';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';

@Module({
  imports: [
    UsersModule,
    ConfigsModule,
    HashModule,
    AccessJwtModule,
    RefreshJwtModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    LocalStrategy,
    JwtAuthGuard,
  ],
  exports: [JwtAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
