import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import csvParser from 'csv-parser';
import {
  RecommendResultDto,
  RecommendedItemDto,
} from './collaborative-filtering.dto';

interface Rating {
  userId: number;
  songID: number;
  rating: number;
}

@Injectable()
export class CFService {
  private ratings: Rating[] = [];
  private users: Set<number> = new Set();
  private songs: Set<number> = new Set();
  private utilityMatrix: Map<number, Map<number, number>> = new Map();
  private meanCenteredMatrix: Map<number, Map<number, number>> = new Map();
  private dataLoaded: boolean = false;

  constructor() {
    this.loadRatings();
  }

  private loadRatings() {
    const filePath = path.join(
      process.cwd(),
      'src',
      'collaborative-filtering',
      'dataset',
      'Songs Dataset Truncated.csv',
    );

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        const userId = parseInt(row["'userID'"]);
        const songID = parseInt(row["'songID'"]);
        const rating = parseFloat(row["'rating'"]);

        if (isNaN(userId) || isNaN(songID) || isNaN(rating)) {
          console.warn('Skipping invalid row:', row);
          return;
        }

        this.ratings.push({ userId, songID, rating });
        this.users.add(userId);
        this.songs.add(songID);

        if (!this.utilityMatrix.has(userId)) {
          this.utilityMatrix.set(userId, new Map());
        }
        this.utilityMatrix.get(userId)!.set(songID, rating);
      })
      .on('end', () => {
        this.meanCenter();
        this.dataLoaded = true;
        console.log(
          `Ratings loaded: ${this.ratings.length} | Users: ${this.users.size} | Songs: ${this.songs.size}`,
        );
      });
  }

  private meanCenter() {
    this.utilityMatrix.forEach((itemMap, userId) => {
      const ratings = Array.from(itemMap.values());
      const mean = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      const centered = new Map<number, number>();
      itemMap.forEach((r, songID) => centered.set(songID, r - mean));
      this.meanCenteredMatrix.set(userId, centered);
    });
  }

  private cosineSimilarity(u: number, v: number): number {
    const uRatings = this.meanCenteredMatrix.get(u);
    const vRatings = this.meanCenteredMatrix.get(v);

    if (!uRatings || !vRatings) return 0;

    let numerator = 0,
      denomU = 0,
      denomV = 0;

    uRatings.forEach((r, songID) => {
      if (vRatings.has(songID)) {
        const rv = vRatings.get(songID)!;
        numerator += r * rv;
      }
      denomU += r * r;
    });

    vRatings.forEach((r) => (denomV += r * r));

    if (denomU === 0 || denomV === 0) return 0;
    return numerator / (Math.sqrt(denomU) * Math.sqrt(denomV));
  }

  recommend(userId: number, topK: number = 10): RecommendResultDto {
    if (!this.dataLoaded) {
      throw new Error('Data is not loaded yet, please wait a moment.');
    }
    if (!this.users.has(userId)) {
      throw new NotFoundException('userId not found');
    }

    // compute similarity with all other users
    const similarities: Map<number, number> = new Map();
    this.users.forEach((otherId) => {
      if (otherId !== userId) {
        similarities.set(otherId, this.cosineSimilarity(userId, otherId));
      }
    });

    // sort users by similarity
    const sortedUsers = Array.from(similarities.entries()).sort(
      (a, b) => b[1] - a[1],
    );

    const userItems = this.utilityMatrix.get(userId)!;
    const predictedRatings: Map<number, number> = new Map();

    this.songs.forEach((songID) => {
      if (!userItems.has(songID)) {
        let num = 0;
        let denom = 0;

        sortedUsers.slice(0, 20).forEach(([otherId, sim]) => {
          const rating = this.utilityMatrix.get(otherId)?.get(songID);
          if (rating !== undefined) {
            num += sim * rating;
            denom += Math.abs(sim);
          }
        });

        if (denom > 0) predictedRatings.set(songID, num / denom);
      }
    });

    const recommendations: RecommendedItemDto[] = Array.from(
      predictedRatings.entries(),
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, topK)
      .map(([songID, predictedRating]) => ({
        songID,
        predictedRating,
      }));

    return { recommendations };
  }
}
