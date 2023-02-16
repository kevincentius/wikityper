import { Injectable } from '@angular/core';
import { RaceStartData } from 'src/app/model/race-start-data';
import { SearchState } from 'src/app/model/search-state';
import { TextPreviewState } from 'src/app/model/text-preview-state';
import { SessionStats } from 'src/app/views/race/race/player-state';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  public raceStartData!: RaceStartData;
  public sessionStats!: SessionStats;
  public searchState!: SearchState;
  public textPreviewState!: TextPreviewState;

  constructor() { }

  prepareRaceData(raceStartData: RaceStartData) {
    this.raceStartData = raceStartData;
  }

  getRaceData() {
    return this.raceStartData;
  }
}
