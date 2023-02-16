import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Article } from 'src/app/model/article';
import { SearchState } from 'src/app/model/search-state';
import { TextPreviewState } from 'src/app/model/text-preview-state';
import { TypePage } from 'src/app/model/type-page';
import { config } from 'src/app/services/config';
import { StateService } from 'src/app/services/state.service';
import { Pos } from 'src/app/views/race/race/pos';
import { StyleConfig } from 'src/app/views/search/search/session-config-state';

@Component({
  selector: 'app-text-preview',
  templateUrl: './text-preview.component.html',
  styleUrls: ['./text-preview.component.scss']
})
export class TextPreviewComponent {
  @Output() start = new EventEmitter();
  @Input() article!: Article;

  styleConfig: StyleConfig = {
    prefWords: 50,
    maxWords: 50,
  };

  s: TextPreviewState = {
    pages: [],
    selectedPage: 0,
  }
  
  constructor(
    private stateService: StateService,
  ) {
    if (stateService.textPreviewState) {
      this.s = this.stateService.textPreviewState;
    } else {
      this.stateService.textPreviewState = this.s;
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    let found = true;
    if (e.key == '<') {
      this.onPrevClick();
    } else if (e.key == '>') {
      this.onNextClick();
    } else if (e.key == 'Enter' && e.shiftKey) {
      this.onStartClick();
    } else {
      found = false;
    }

    if (found) {
      e.preventDefault();
    }
  }

  showArticle(rawArticle: Article, processedArticle: Article) {
    this.s.pages = this.calcPages(processedArticle);
    this.s.selectedPage = 0;
    
    this.selectPage(0);
  }

  selectPage(index: number) {
    this.s.selectedPage = Math.min(Math.max(0, index), this.s.pages.length - 1);
    if (this.s.selectedPage != index) {
      const page = this.s.pages[index];
    }
  }

  private calcPages(article: Article) {
    let startPos: Pos | undefined = new Pos(article);

    const pages = [];
    while (startPos) {
      let [endPos, clippedText] = this.calcEndPos(startPos);
      pages.push({
        startPos: startPos,
        endPos: endPos,
        clippedText: clippedText,
      });
      startPos = endPos?.createCopy();
    }
    console.log(pages);
    return pages;
  }

  private calcEndPos(startPos: Pos): [Pos | null, string] {
    const words: string[] = [];
    let endPos: Pos | null = startPos.createCopy();
    let charsLeft = this.styleConfig.maxWords * 5;
    while (endPos && endPos.getWord()) {
      const word = endPos.getWord();
      if (word) {
        charsLeft -= endPos.getWord()!.length;
        words.push(endPos.getWord()!);
      }
      
      if (!endPos.nextWord()) {
        endPos = null;
      }

      if (charsLeft <= 0 && config.sentenceTerminationCharacters.indexOf(word!.charAt(word!.length - 1)) != -1
        || charsLeft <= -200) {
        break;
      }
    }
    
    return [endPos, words.join(' ')];
  }

  onStartClick() {
    this.start.emit(this.s.pages[this.s.selectedPage]);
  }

  onPrevClick() {
    this.selectPage(this.s.selectedPage - 1);
  }

  onNextClick() {
    this.selectPage(this.s.selectedPage + 1);
  }
}
