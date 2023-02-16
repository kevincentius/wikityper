
export class WordState {
  target = '';
  correctlyTyped = '';
  wronglyTyped = '';
  remainingLetters = '';

  setTarget(target: string, typed=false) {
    this.target = target;
    this.correctlyTyped = typed ? target : '';
    this.wronglyTyped = '';
    this.remainingLetters = target;
  }

  typeLetter(key: string) {
    if (this.wronglyTyped.length == 0
        && this.remainingLetters.length > 0
        && this.remainingLetters[0] == key) {
      // typed correct letter
      this.correctlyTyped += key;
      this.remainingLetters = this.remainingLetters.substring(1);
    } else {
      // typed wrong letter
      this.wronglyTyped += key;
      this.remainingLetters = this.remainingLetters.substring(1);
    }
  }

  typeBackspace() {
    if (this.wronglyTyped.length > 0) {
      // erase wrongly typed letter
      this.wronglyTyped = this.wronglyTyped.substring(0, this.wronglyTyped.length - 1);
      this.restoreOneRemainingLetter();
      return true;
    } else if (this.correctlyTyped.length > 0) {
      // erase correctly typed letter
      this.correctlyTyped = this.correctlyTyped.substring(0, this.correctlyTyped.length - 1);
      this.restoreOneRemainingLetter();
      return true;
    } else {
      // nothing to erase in this word
      return false;
    }
  }

  private restoreOneRemainingLetter() {
    const rpos = this.correctlyTyped.length + this.wronglyTyped.length;
    if (rpos < this.target.length) {
      this.remainingLetters = this.target.charAt(rpos) + this.remainingLetters;
    }
  }

  isFinished() {
    return this.correctlyTyped == this.target && this.wronglyTyped.length == 0;
  }
}
