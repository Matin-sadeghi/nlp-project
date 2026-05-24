import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ClassifyRequestDto {
  @ApiProperty({
    example: 'Dataset/Classification-Train-And-Test/test/example.txt',
    description: 'Path to the text file to classify',
  })
  @IsNotEmpty()
  filePath: string;
}

export class ClassifyResponseDto {
  @ApiProperty({ example: 'politics' })
  predictedClass: string;

  @ApiProperty({
    example: {
      sports: -34.2,
      politics: -12.5,
      tech: -20.1,
    },
  })
  classScores: Record<string, number>;

  @ApiProperty({
    example: 'Dataset/Classification-Train-And-Test/output/example_output.txt',
    description:
      'Path to the output file where classification result is stored',
  })
  outputFilePath: string;
}
