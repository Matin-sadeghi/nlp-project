import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ProcessTextDto {
  @ApiProperty({
    description: 'Full path of the input text file',
    example: 'C:/Users/Ali/Desktop/input.txt',
  })
  @IsNotEmpty()
  @IsString()
  filePath: string;

  @ApiPropertyOptional({
    description: 'Convert text to lowercase',
    default: false,
  })
  @IsBoolean()
  lowercase?: boolean;

  @ApiPropertyOptional({
    description: 'Tokenize input text',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  tokenize?: boolean;

  @ApiPropertyOptional({
    description: 'Calculate word frequencies',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  wordCount?: boolean;

  @ApiPropertyOptional({
    description: 'Apply Porter stemming',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  stemming?: boolean;
}

export class ProcessTextResponseDto {
  @ApiPropertyOptional({
    description: 'Lowercased version of the input text',
    example: 'this is a sample text',
  })
  lowercase?: string;

  @ApiPropertyOptional({
    description: 'Tokenized text',
    example: ['this', 'is', 'a', 'sample', 'text'],
  })
  tokens?: string[];

  @ApiPropertyOptional({
    description: 'Word frequency map',
    example: {
      this: 1,
      is: 1,
      a: 1,
      sample: 1,
      text: 1,
    },
  })
  wordCount?: Record<string, number>;

  @ApiPropertyOptional({
    description: 'Stemmed tokens using Porter Stemmer',
    example: ['thi', 'is', 'a', 'sampl', 'text'],
  })
  stemming?: string[];

  @ApiProperty({
    example: 'output/text_processing_1700000000000.txt',
  })
  outputFilePath: string;
}
