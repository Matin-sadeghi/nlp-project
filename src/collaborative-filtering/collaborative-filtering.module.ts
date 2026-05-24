import { Module } from '@nestjs/common';
import { CFController } from './collaborative-filtering.controller';
import { CFService } from './collaborative-filtering.service';

@Module({
  controllers: [CFController],
  providers: [CFService],
})
export class CFModule {}
