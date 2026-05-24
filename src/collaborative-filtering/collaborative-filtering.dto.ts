import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class RecommendUserDto {
  @ApiProperty({ description: 'User ID for song suggestions' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'Number of top offers',
    required: false,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  topK?: number;
}

export class RecommendedItemDto {
  @ApiProperty({ description: 'song ID' })
  songID: number;

  @ApiProperty({ description: "User's predicted rating for this item" })
  predictedRating: number;
}

export class RecommendResultDto {
  @ApiProperty({
    type: [RecommendedItemDto],
    description: 'List of suggested items for the user',
  })
  recommendations: RecommendedItemDto[];
}
