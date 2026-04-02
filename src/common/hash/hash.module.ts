import { Module } from '@nestjs/common';
import { ConfigsModule } from 'src/configs/configs.module';
import { HashService } from './hash.service';

@Module({
  imports: [ConfigsModule],
  providers: [HashService],
  exports: [HashService],
})
export class HashModule {}
