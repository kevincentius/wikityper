import { Article } from "src/app/model/article";

export interface WikiSearchResultEntry {
  pageid: number;
  size: number;
  snippet: string;
  timestamp: string;
  title: string;
  wordcount: number;
  
  article: Article;
}

export interface WikiSearchInfo {
  suggestion: string;
  suggestionsnippet: string;
  totalhits: number;
}

export interface WikiSearchResult {
  search: WikiSearchResultEntry[];
  searchInfo: WikiSearchInfo;
}
