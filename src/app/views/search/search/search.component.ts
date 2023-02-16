import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Article } from 'src/app/model/article';
import { SearchState } from 'src/app/model/search-state';
import { TypePage } from 'src/app/model/type-page';
import { countStats } from 'src/app/services/article-visitors.ts/count-stats';
import { StateService } from 'src/app/services/state.service';
import { WikiService } from 'src/app/services/wiki.service';
import { TextPreviewComponent } from 'src/app/views/search/text-preview/text-preview.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  debug = false;

  s: SearchState = {
    search: '',
  };

  @ViewChild('textPreview', { static: false })
  private textPreview!: TextPreviewComponent;

  @ViewChild('searchBar')
  private searchBar!: ElementRef<HTMLInputElement>;

  constructor(
    private wikiService: WikiService,
    private router: Router,
    private stateService: StateService,
  ) {
    if (stateService.searchState) {
      this.s = stateService.searchState;
    } else {
      const localStored = localStorage.getItem('searchState');
      if (localStored) {
        this.s = JSON.parse(localStored);
      }
      stateService.searchState = this.s;

      if (this.debug) {
        this.s.search = 'horse';
        this.onSearch();
      }
    }
  }

  ngAfterViewInit() {
    this.searchBar.nativeElement.focus();
  }
  
  async onSearch() {
    this.s.articles = undefined;
    if (this.debug) {
      this.s.articles = JSON.parse(localStorage.getItem('debugCacheArticles') ?? 'undefined');
    }

    if (!this.s.articles) {
      this.s.articles = (await this.wikiService.searchData(this.s.search));
      localStorage.setItem('debugCacheArticles', JSON.stringify(this.s.articles));
    }

    localStorage.setItem('searchState', JSON.stringify(this.s));
  }

  onArticleClick(rawArticle: Article) {
    const article = JSON.parse(JSON.stringify(rawArticle));

    countStats(article);

    this.s.previewArticle = article;
    console.log(this.textPreview);

    setTimeout(() => {
      this.textPreview.showArticle(rawArticle, article);
    });

    console.log(this.s.previewArticle);
  }

  onStartRace(page: TypePage) {
    const words: string[] = [];
    const pos = page.startPos.createCopy();
    while (pos.getWord() && !pos.equals(page.endPos!)) {
      words.push(pos.getWord()!);
      pos.nextWord();
    }

    this.stateService.prepareRaceData({
      words: words
    });

    this.router.navigate(['race']);
  }

  onArticleMouseOver(article: Article) {
  }
}
