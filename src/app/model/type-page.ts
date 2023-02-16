import { Pos } from "src/app/views/race/race/pos";

export interface TypePage {
  readonly startPos: Pos,
  readonly endPos: Pos | null,
  readonly clippedText: string,
}
