import { NotFoundException } from '@nestjs/common';
import * as fs from 'fs';

export function readTextFile(filePath: string): string {
  console.log(filePath);
  if (!fs.existsSync(filePath)) {
    throw new NotFoundException('Not found file');
  }

  return fs.readFileSync(filePath, 'utf-8');
}
