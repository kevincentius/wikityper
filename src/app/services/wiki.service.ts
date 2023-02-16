import { Injectable } from '@angular/core';
import { Article, Paragraph, Section } from 'src/app/model/article';
import { WikiSearchResult } from 'src/app/model/wiki-search-result';
import { fetch } from 'wtf_wikipedia';

@Injectable({
  providedIn: 'root'
})
export class WikiService {
  cachedArticles = new Map<number, Article>();

  constructor() { }

  async search(searchQuery: string): Promise<WikiSearchResult> {
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
    const response = await window.fetch(endpoint);
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return (await response.json()).query;
  }

  async searchData(searchQuery: string): Promise<Article[]> {
    const searchResult = await this.search(searchQuery);

    const docs: any[] = await fetch(searchResult.search.map(entry => entry.pageid)) as any[];
    
    const articles = await docs.map(doc => this.asArticle(doc));

    this.cachedArticles.clear();
    articles.forEach(article => this.cachedArticles.set(article.id, article));

    return articles;
  }
  
  private asArticle(doc: any): Article {
    const sections: Section[] = [];
    for (const section of doc.sections()) {
      if (section.text().trim().length < 20) continue;

      const paragraphs: Paragraph[] = section.paragraphs().map((p: any) => {
        const fullText = p.sentences().map((s: any) => s.json().text).join(' ');
        const paragraph: Paragraph = {
          fullText,
          words: fullText.split(' ').filter((word: string) => word.trim().length > 0),
        };
        return paragraph;
      });

      sections.push({
        title: section.title(),
        paragraphs: paragraphs,
      });
    }

    const article = {
      id: doc.pageID(),
      title: doc.title(),
      sections,
    };
    return article;
  }

  async getCachedArticle(id: number): Promise<Article> {
    const cached = this.cachedArticles.get(id);

    if (cached) {
      return cached;
    }
    
    const localCached = JSON.parse(localStorage.getItem(`cachedArticle`) ?? 'null');
    if (localCached && localCached.id == id) {
      return localCached;
    }

    const doc = await fetch(id);
    const loaded = this.asArticle(doc);
    this.cachedArticles.set(id, loaded);
    localStorage.setItem('cachedArticle', JSON.stringify(loaded));
    return loaded;
  }
}
