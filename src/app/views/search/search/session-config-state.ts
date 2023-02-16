import { Article } from "src/app/model/article";

export interface StyleConfig {
  // 1 word = 5 letters incl. punctuations.
  prefWords: number;
  maxWords: number;
  
}
 
export interface SessionConfigState {
  rawArticle: Article;
  processedArticle: Article;
  startWord: number;
  endWord: number;
}
