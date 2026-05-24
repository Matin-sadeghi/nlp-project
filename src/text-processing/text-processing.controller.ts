import { Controller, Post, Body } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { TextProcessingService } from './text-processing.service';
import { ProcessTextDto } from './process-text.dto';
import { ProcessTextResponseDto } from './process-text.dto';
import { readTextFile } from '../utils/file.util';

@ApiTags('Text Processing')
@Controller('text-processing')
export class TextProcessingController {
  constructor(private readonly textProcessingService: TextProcessingService) {}

  @Post()
  @ApiOperation({
    summary: 'Apply basic NLP preprocessing on a text file',
  })
  @ApiBody({ type: ProcessTextDto })
  @ApiResponse({
    status: 200,
    description: 'Processed text output',
    type: ProcessTextResponseDto,
  })
  processText(@Body() dto: ProcessTextDto): ProcessTextResponseDto {
    const text = readTextFile(dto.filePath);
    return this.textProcessingService.process(text, dto);
  }
}
