import * as fs from 'fs';
import * as path from 'path';
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { NaiveBayesModel } from './model/naive-bayes.model';

@Injectable()
export class ClassificationService implements OnModuleInit {
  private model = new NaiveBayesModel();

  onModuleInit() {
    this.train();
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(/\s+/)
      .filter(Boolean);
  }

  private train() {
    const trainPath = path.join(
      process.cwd(),
      'src',
      'text-classification',
      'dataset',
    );

    const classes = fs.readdirSync(trainPath);

    let totalDocs = 0;
    const classDocCounts: Record<string, number> = {};

    for (const cls of classes) {
      const classDir = path.join(trainPath, cls);
      const files = fs.readdirSync(classDir);

      classDocCounts[cls] = files.length;
      totalDocs += files.length;

      this.model.wordProbabilities[cls] = {};
      this.model.classWordCounts[cls] = 0;

      for (const file of files) {
        const content = fs.readFileSync(path.join(classDir, file), 'utf-8');

        const tokens = this.tokenize(content);

        for (const token of tokens) {
          this.model.vocabulary.add(token);
          this.model.wordProbabilities[cls][token] =
            (this.model.wordProbabilities[cls][token] || 0) + 1;
          this.model.classWordCounts[cls]++;
        }
      }
    }

    // P(C)
    for (const cls of classes) {
      this.model.classProbabilities[cls] = classDocCounts[cls] / totalDocs;
    }

    const vocabSize = this.model.vocabulary.size;

    for (const cls of classes) {
      for (const word of this.model.vocabulary) {
        const count = this.model.wordProbabilities[cls][word] || 0;

        this.model.wordProbabilities[cls][word] =
          (count + 1) / (this.model.classWordCounts[cls] + vocabSize);
      }
    }
  }

  classifyFile(filePath: string) {
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('not found');
    }

    const text = fs.readFileSync(filePath, 'utf-8');
    const tokens = this.tokenize(text);
    const scores: Record<string, number> = {};

    for (const cls in this.model.classProbabilities) {
      let score = Math.log(this.model.classProbabilities[cls]);

      for (const token of tokens) {
        if (this.model.vocabulary.has(token)) {
          score += Math.log(this.model.wordProbabilities[cls][token]);
        }
      }

      scores[cls] = score;
    }

    const predictedClass = Object.entries(scores).sort(
      (a, b) => b[1] - a[1],
    )[0][0];

    // ذخیره نتیجه توی فایل خروجی
    const outputDir = path.join(process.cwd(), 'output');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const fileName = `text_classification_${Date.now()}.txt`;
    const outputFilePath = path.join(outputDir, fileName);

    const outputContent = `Predicted Class: ${predictedClass}\n\nScores:\n${JSON.stringify(scores, null, 2)}`;
    fs.writeFileSync(outputFilePath, outputContent, 'utf-8');

    return {
      predictedClass,
      classScores: scores,
      outputFilePath,
    };
  }
}
