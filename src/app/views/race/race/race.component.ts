import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { config } from 'src/app/services/config';
import { StateService } from 'src/app/services/state.service';
import { PlayerState } from 'src/app/views/race/race/player-state';
import { WordState } from 'src/app/views/race/race/word-state';

@Component({
  selector: 'app-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.scss']
})
export class RaceComponent implements OnInit {
  config = config;
  typingAreaHeight = 1000;

  playerState!: PlayerState;

  @ViewChild('currentWordSpan', { static: false })
  currentWordSpanRef!: ElementRef<HTMLSpanElement>;

  @ViewChildren('doneWordSpans')
  doneWordSpans!: QueryList<ElementRef<HTMLSpanElement>>;

  @ViewChildren('previewWordSpans')
  previewWordSpans!: QueryList<ElementRef<HTMLSpanElement>>;

  scrollerPos = 0;

  timeout!: any;
  lastLoopMs!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stateService: StateService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.prepareRace();
    });

    this.startLoop();
  }

  ngOnDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    const key = e.key;
    const w = this.playerState.currentWord;
    
    if (key == 'Escape') {
      this.router.navigate(['']);
    } else if (key == 'Backspace') {
      w.typeBackspace();
    } else if (key == ' ') {
      if (w.isFinished()) {
        this.playerState.doneWords.push(w.target);
        this.playerState.previewWords.shift();
        if (this.playerState.pos + 1 < this.playerState.words.length) {
          this.playerState.pos++;
          w.setTarget(this.playerState.words[this.playerState.pos]);
        }
      } else {
        w.typeLetter('_');
      }
    } else if (config.allowedCharacters.indexOf(key) != -1) {
      const pos = this.playerState.pos;
      w.typeLetter(key);

      if (w.isFinished() && this.playerState.pos + 1 == this.playerState.words.length) {
        this.finish();
      }
    } else {

    }

    if (!this.playerState.stats.startMs && w.correctlyTyped.length > 0) {
      this.playerState.stats.startMs = Date.now();
    } else 

    e.preventDefault();
  }

  private finish() {
    this.playerState.stats.endMs = Date.now();
          
    this.stateService.sessionStats = this.playerState.stats;
    this.router.navigate(['result']);
  }

  startLoop() {
    if (!this.timeout) {
      this.lastLoopMs = Date.now();
      this.loop();
    }
  }

  loop() {
    this.timeout = requestAnimationFrame(() => {
      const ct = Date.now();
      const dt = (ct - this.lastLoopMs) / 1000;
      this.lastLoopMs = ct;

      this.updateTypingArea(dt);
      
      this.loop();
    });
  }

  private updateTypingArea(dt: number) {
    const currElm = this.currentWordSpanRef?.nativeElement;
    if (currElm) {
      // adjust typing area
      this.typingAreaHeight = this.getHeightOfNLines(currElm, config.doneLines + 1 + config.previewLines);
      
      // auto scroll text
      const targetCurrTop = this.getHeightOfNLines(currElm, config.doneLines) + config.lineSpacing;
      const targetScrollerTop = targetCurrTop - currElm.offsetTop;
      const dy = config.scrollSpeed * dt;
      // if (Math.abs(this.scrollerPos - targetScrollerTop) < dy) {
      if (this.scrollerPos - targetScrollerTop < dy) {
        this.scrollerPos = targetScrollerTop;
      } else {
        this.scrollerPos += dy * Math.sign(targetScrollerTop - this.scrollerPos);
      }

    }

    // despawn words
    const firstDoneSpan = this.doneWordSpans.first?.nativeElement;
    if (firstDoneSpan && this.shouldDespawnWord(firstDoneSpan)) {
      for (let i = 1; i < this.doneWordSpans.length; i++) {
        const doneElm = this.doneWordSpans.get(i)!.nativeElement;
        if (!(this.shouldDespawnWord(doneElm))) {
          this.playerState.doneWords.splice(0, i);
          this.scrollerPos += doneElm.offsetTop;
          break;
        }
      }
    }

    this.updatePreviewWords();
  }

  private shouldDespawnWord(span: HTMLSpanElement) {
    return this.scrollerPos + span.offsetTop + span.offsetHeight + config.lineSpacing < 0;
  }

  private getHeightOfNLines(currElm: HTMLSpanElement, numLines: number): number {
    return currElm.offsetHeight * numLines + config.lineSpacing * (numLines - 1);
  }

  private async prepareRace() {
    const state = this.stateService.getRaceData();
    if (!state) {
      this.router.navigate(['']);
    } else {
      this.playerState = {
        words: state.words,
        pos: 0,
        previewPos: 0,
        currentWord: new WordState(),
        doneWords: [],
        previewWords: [],

        stats: {
          chars: state.words.map(word => word.length).reduce((a, b) => a + b),
        },
      };
  
      this.updatePreviewWords();
      this.playerState.currentWord.setTarget(this.playerState.words[this.playerState.pos]); 
    }
  }

  private updatePreviewWords() {
    const s = this.playerState;

    while (s.previewWords.length < config.previewLength) {
      if (s.previewPos + 1 < s.words.length) {
        s.previewPos++;
        s.previewWords.push(s.words[s.previewPos]);
      } else {
        break;
      }
    }
  }
}
