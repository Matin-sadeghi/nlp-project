import { Module } from '@nestjs/common';
import { IRController } from './information-retrieval.controller';
import { IRService } from './information-retrieval.service';

@Module({
  controllers: [IRController],
  providers: [IRService],
})
export class IRModule {}
