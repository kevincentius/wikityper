import { Article } from "src/app/model/article";

export class Pos {
  private section = 0;
  private paragraph = 0;
  private word = 0;

  constructor(
    private article: Article
  ) {}

  getWord() {
    return this.section < this.article.sections.length ?
      this.article
        .sections[this.section]
        .paragraphs[this.paragraph]
        .words[this.word]
      : null;
  }

  nextWord() {
    this.word++;

    if (this.word >= this.article.sections[this.section].paragraphs[this.paragraph].words.length) {
      this.word = 0;
      this.paragraph++;
    }

    if (this.paragraph >= this.article.sections[this.section].paragraphs.length) {
      this.paragraph = 0;
      this.section++;
    }

    if (this.section >= this.article.sections.length) {
      this.section = this.article.sections.length;
      return false;
    }

    return true;
  }

  createCopy() {
    const pos = new Pos(this.article);
    pos.section = this.section;
    pos.paragraph = this.paragraph;
    pos.word = this.word;
    return pos;
  }

  createState() {
    return {
      section: this.section,
      paragraph: this.paragraph,
      word: this.word,
    };
  }

  readState(state: any) {
    this.section = state.section;
    this.paragraph = state.paragraph;
    this.word = state.word;
    return this;
  }

  equals(pos: Pos) {
    return pos
      && this.word == pos.word
      && this.paragraph == pos.paragraph
      && this.section == pos.section
      && this.article == pos.article;
  }
}
