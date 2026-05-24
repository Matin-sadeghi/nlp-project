import { Injectable } from '@nestjs/common';
import { PorterStemmer } from 'natural';
import { ProcessTextDto, ProcessTextResponseDto } from './process-text.dto';
import * as fs from 'fs';
import path from 'path';

@Injectable()
export class TextProcessingService {
  tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, '')
      .split(/\s+/)
      .filter(Boolean);
  }

  lowercase(text: string): string {
    return text.toLowerCase();
  }

  wordCount(tokens: string[]): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const token of tokens) {
      counts[token] = (counts[token] || 0) + 1;
    }
    return counts;
  }

  stemming(tokens: string[]): string[] {
    return tokens.map((token) => PorterStemmer.stem(token));
  }

  process(text: string, options: ProcessTextDto): ProcessTextResponseDto {
    const result: ProcessTextResponseDto = { outputFilePath: '' };
    let workingText = text;
    let tokens: string[] = [];

    if (options.lowercase) {
      workingText = this.lowercase(workingText);
      result.lowercase = workingText;
    }

    if (options.tokenize) {
      tokens = this.tokenize(workingText);
      result.tokens = tokens;
    }

    if (options.wordCount) {
      if (tokens.length === 0) {
        tokens = this.tokenize(workingText);
      }
      result.wordCount = this.wordCount(tokens);
    }

    if (options.stemming) {
      if (tokens.length === 0) {
        tokens = this.tokenize(workingText);
      }
      result.stemming = this.stemming(tokens);
    }

    const outputDir: string = path.join(process.cwd(), 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const fileName = `text_processing_${Date.now()}.txt`;
    const filePath = path.join(outputDir, fileName);
    result.outputFilePath = filePath;
    fs.writeFileSync(filePath, JSON.stringify(result, null, 2), 'utf-8');

    return result;
  }
}
