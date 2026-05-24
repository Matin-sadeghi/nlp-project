import { Module } from '@nestjs/common';
import { TextProcessingController } from './text-processing.controller';
import { TextProcessingService } from './text-processing.service';

@Module({
  imports: [],
  controllers: [TextProcessingController],
  providers: [TextProcessingService],
})
export class TextProcessingModule {}
