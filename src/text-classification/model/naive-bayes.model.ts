export class NaiveBayesModel {
  vocabulary = new Set<string>();
  classProbabilities: Record<string, number> = {};
  wordProbabilities: Record<string, Record<string, number>> = {};
  classWordCounts: Record<string, number> = {};
}
