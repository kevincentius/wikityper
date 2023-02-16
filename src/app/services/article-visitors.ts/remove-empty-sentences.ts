import { Article } from "src/app/model/article";

export function removeEmptySentences(article: Article) {
  for (let section of article.sections) {
    section.paragraphs = section.paragraphs.filter(p => p.fullText.trim().length > 0);
  }
  article.sections = article.sections.filter(s => s.paragraphs.length > 0);
}
