import { Module } from '@nestjs/common';
import { DecoratorsModule } from './decorators/decorators.module';

@Module({
  imports: [DecoratorsModule],
})
export class CommonModule {}
