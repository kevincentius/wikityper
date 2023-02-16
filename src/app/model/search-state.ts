import { Article } from "src/app/model/article";

export interface SearchState {
  search: string;

  articles?: Article[];
  previewArticle?: Article;
}
