import { Article } from "src/app/model/article";
import { Pos } from "src/app/views/race/race/pos";

export interface StyleConfig {
  // 1 word = 5 letters incl. punctuations.
  prefWords: number;
  maxWords: number;
  
}
 
export interface SessionConfigState {
  rawArticle: Article;
  processedArticle: Article;
  startPos: Pos;
  endPos: Pos;
}
