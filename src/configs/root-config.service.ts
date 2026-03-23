import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthConfig,
  DatabaseConfig,
  HashConfig,
  RootConfig,
  ServerConfig,
} from './root-config';

@Injectable()
export class RootConfigService {
  constructor(private readonly configService: ConfigService<RootConfig>) {}

  get server(): ServerConfig {
    return this.configService.getOrThrow('server');
  }

  get hash(): HashConfig {
    return this.configService.getOrThrow('hash');
  }

  get database(): DatabaseConfig {
    return this.configService.getOrThrow('database');
  }

  get auth(): AuthConfig {
    return this.configService.getOrThrow('auth');
  }
}
