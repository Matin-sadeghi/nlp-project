import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClassificationService } from './classification.service';
import { ClassifyRequestDto, ClassifyResponseDto } from './classification.dto';

@ApiTags('Text Classification')
@Controller('classification')
export class ClassificationController {
  constructor(private readonly service: ClassificationService) {}

  @Post()
  @ApiResponse({ status: 200, type: ClassifyResponseDto })
  classify(@Body() dto: ClassifyRequestDto) {
    return this.service.classifyFile(dto.filePath);
  }
}
