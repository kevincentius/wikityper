
export interface StatCounts {
  wordCount: number;
  charCount: number;
  letterCount: number;
  digitsCount: number;
  punctuationCount: number;
  symbolsCount: number;
}

export interface Article {
  id: number;
  title: string;
  counts: StatCounts;
  sentences: string[];
}
