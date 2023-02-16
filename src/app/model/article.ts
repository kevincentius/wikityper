
export interface StatCounts {
  wordCount: number;
  charCount: number;
  letterCount: number;
  digitsCount: number;
  punctuationCount: number;
  symbolsCount: number;
}

export interface Sentence {
  fullText: string;
  words: string[];
  counts?: StatCounts;
}

export interface Paragraph {
  fullText: string;
  words: string[];
  counts?: StatCounts;
}

export interface Section {
  title: string;
  paragraphs: Paragraph[];
  counts?: StatCounts;
}

export interface Article {
  id: number;
  title: string;
  counts?: StatCounts;
  sections: Section[];
}
