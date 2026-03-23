import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessTokenPayload } from './dtos/access-token-payload';
import { RootConfigService } from 'src/configs/root-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(rootConfigService: RootConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: rootConfigService.auth.jwt.secret,
    });
  }

  validate(payload: AccessTokenPayload): AccessTokenPayload {
    return payload;
  }
}
