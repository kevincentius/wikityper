
import { WordState } from "src/app/views/race/race/word-state";

export interface SessionStats {
  startMs?: number;
  endMs?: number;
  chars: number;
}

export interface PlayerState {
  words: string[];

  pos: number;
  previewPos: number;
  doneWords: string[];
  previewWords: string[];

  currentWord: WordState;

  stats: SessionStats;
}
