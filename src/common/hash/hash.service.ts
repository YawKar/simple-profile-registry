import { Injectable } from '@nestjs/common';
import { hash, Options, verify } from '@node-rs/argon2';
import { RootConfigService } from 'src/configs/root-config.service';

@Injectable()
export class HashService {
  private readonly options: Options;
  constructor(private readonly rootConfigService: RootConfigService) {
    this.options = {
      memoryCost: this.rootConfigService.hash.memoryCost,
      timeCost: this.rootConfigService.hash.timeCost,
      parallelism: this.rootConfigService.hash.parallelism,
    };
  }

  async hash(password: string) {
    return await hash(password, this.options);
  }

  async compare(password: string, hash: string) {
    return await verify(hash, password);
  }
}
