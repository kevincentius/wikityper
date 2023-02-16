import { Article, StatCounts } from "src/app/model/article";

export function countStats(article: Article) {
  article.sections.forEach(section => {
    section.paragraphs.forEach(paragraph => {
      paragraph.counts = countParagraphStats(paragraph.fullText);
    });
    section.counts = sumCounts(section.paragraphs);
  });
  article.counts = sumCounts(article.sections);
}

function countParagraphStats(text: string): StatCounts {
  return {
    wordCount: text.split(' ').length,
    charCount: text.length,
    letterCount: text.replace(/[^a-zA-Z]/g, '').length,
    digitsCount: text.replace(/\D/g, '').length,
    punctuationCount: text.replace(/[^.,!?'"]/g, '').length,
    symbolsCount: text.replace(/[0-9a-zA-Z.,!?'"]/g, '').length,
  };
}

function sumCounts(items: { counts?: StatCounts }[]): StatCounts {
  const counts = items.map(i => i.counts!);
  const sum = (counts: StatCounts[], getter: ((_: StatCounts) => number)) => counts.map(getter).reduce((a: number, b: number) => a + b);
  return {
    wordCount: sum(counts, c => c.wordCount),
    charCount: sum(counts, c => c.charCount),
    digitsCount: sum(counts, c => c.digitsCount),
    letterCount: sum(counts, c => c.letterCount),
    punctuationCount: sum(counts, c => c.punctuationCount),
    symbolsCount: sum(counts, c => c.symbolsCount),
  };
}
