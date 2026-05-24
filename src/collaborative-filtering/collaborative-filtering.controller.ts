import { Controller, Post, Body } from '@nestjs/common';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  RecommendResultDto,
  RecommendUserDto,
} from './collaborative-filtering.dto';
import { CFService } from './collaborative-filtering.service';

@ApiTags('Collaborative Filtering')
@Controller('cf')
export class CFController {
  constructor(private readonly cfService: CFService) {}

  @Post('recommend')
  @ApiOperation({
    summary:
      'Recommend music items to the user based on collaborative filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'List of suggestions',
    type: RecommendResultDto,
  })
  recommend(@Body() body: RecommendUserDto): RecommendResultDto {
    const topK = body.topK || 10;
    const recommendations = this.cfService.recommend(body.userId, topK);
    return recommendations;
  }
}
