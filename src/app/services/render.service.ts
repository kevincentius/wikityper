import { Injectable } from '@angular/core';
import { config } from 'src/app/services/config';

@Injectable({
  providedIn: 'root'
})
export class RenderService {
  private canvas = document.createElement("canvas");
  private context = this.canvas.getContext("2d")!;

  constructor() { }

  getTextWidth(text: string) {
    this.context.font = `${config.fontSize}px Verdana`;
    const metrics = this.context.measureText(text);
    return metrics.width;
  }
}
