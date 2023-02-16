import { Component, HostListener, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  constructor(
    public stateService: StateService,
    private router: Router,
  ) {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        
      }
    })
  }

  @HostListener('document:keydown.enter', ['$event'])
  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.onContinueClick();
  }

  ngOnInit(): void {
  }

  getWpm() {
    const s = this.stateService.sessionStats;
    return s.chars / 5 / ((s.endMs! -s.startMs!) / 60000);
  }

  onContinueClick() {
    this.router.navigate(['']);
  }
}
