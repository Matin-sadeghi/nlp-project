import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface DocumentVector {
  filePath: string;
  tfidf: Map<string, number>;
}

@Injectable()
export class IRService {
  private documents: DocumentVector[] = [];
  private idf: Map<string, number> = new Map();

  constructor() {
    this.loadDocuments();
  }

  private loadDocuments() {
    const docsPath = path.join(
      process.cwd(),
      'src',
      'information-retrieval',
      'dataset',
    );
    const files = fs.readdirSync(docsPath).filter((f) => f.endsWith('.txt'));

    const df: Map<string, number> = new Map();
    const tempTF: Map<string, Map<string, number>> = new Map();

    for (const file of files) {
      const filePath = path.join(docsPath, file);
      const text = fs.readFileSync(filePath, 'utf-8');
      const tokens = this.tokenize(text);
      const tf: Map<string, number> = new Map();

      tokens.forEach((t) => tf.set(t, (tf.get(t) || 0) + 1));
      tempTF.set(filePath, tf);

      const uniqueTokens = new Set(tokens);
      uniqueTokens.forEach((t) => df.set(t, (df.get(t) || 0) + 1));
    }

    const N = files.length;

    df.forEach((count, word) => {
      this.idf.set(word, Math.log((N + 1) / (count + 1)) + 1);
    });

    tempTF.forEach((tf, filePath) => {
      const tfidf: Map<string, number> = new Map();
      tf.forEach((count, word) => {
        const idfValue = this.idf.get(word) || 0;
        tfidf.set(word, count * idfValue);
      });
      this.documents.push({ filePath, tfidf });
    });

    console.log(`Loaded ${this.documents.length} documents. IR system ready.`);
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(Boolean);
  }

  private cosineSimilarity(
    tfidf1: Map<string, number>,
    tfidf2: Map<string, number>,
  ): number {
    let dot = 0,
      normA = 0,
      normB = 0;

    tfidf2.forEach((val2, word) => {
      const val1 = tfidf1.get(word) || 0;
      dot += val1 * val2;
      normB += val2 ** 2;
      if (val1) {
        normA += val1 ** 2;
      }
    });

    return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-10);
  }

  search(queryText: string, topK: number = 5) {
    const tokens = this.tokenize(queryText);
    const queryTF: Map<string, number> = new Map();
    tokens.forEach((t) => queryTF.set(t, (queryTF.get(t) || 0) + 1));

    const queryTFIDF: Map<string, number> = new Map();
    queryTF.forEach((count, word) => {
      const idfValue =
        this.idf.get(word) || Math.log((this.documents.length + 1) / 1); // unseen word
      queryTFIDF.set(word, count * idfValue);
    });

    const scores = this.documents.map((doc) => ({
      doc: doc.filePath,
      score: this.cosineSimilarity(doc.tfidf, queryTFIDF),
    }));

    scores.sort((a, b) => b.score - a.score);

    return {
      topDocuments: scores.slice(0, topK),
    };
  }
}
