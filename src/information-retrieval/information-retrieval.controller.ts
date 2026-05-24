import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IRService } from './information-retrieval.service';
import { IRRequestDto, IRResponseDto } from './information-retrieval.dto';

@ApiTags('Information Retrieval')
@Controller('ir')
export class IRController {
  constructor(private readonly irService: IRService) {}

  @Post('search')
  @ApiResponse({ status: 200, type: IRResponseDto })
  search(@Body() dto: IRRequestDto) {
    return this.irService.search(dto.query, dto.topK);
  }
}
