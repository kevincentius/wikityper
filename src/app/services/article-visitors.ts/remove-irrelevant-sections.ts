import { Article } from "src/app/model/article";

export function removeSectionsByTitle(article: Article, opt={
  titleBlacklist: [
    'See also',
    'External links',
    'References',
  ]
}) {
  article.sections = article.sections.filter(
    s => opt.titleBlacklist.findIndex(v => v.toLowerCase() == s.title.toLowerCase()) == -1
  );
}
