import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class IRRequestDto {
  @ApiProperty({ description: 'Query text to search' })
  @IsNotEmpty()
  query: string;

  @ApiProperty({
    description: 'The number of top results you want returned.',
    required: false,
    default: 5,
  })
  @IsOptional()
  @IsNumber()
  topK?: number;
}

export class DocumentScoreDto {
  @ApiProperty({ description: 'Document file address' })
  doc: string;

  @ApiProperty({ description: 'Document similarity score with query' })
  score: number;
}

export class IRResponseDto {
  @ApiProperty({
    type: [DocumentScoreDto],
    description: 'List of top documents based on similarity',
  })
  topDocuments: DocumentScoreDto[];
}
