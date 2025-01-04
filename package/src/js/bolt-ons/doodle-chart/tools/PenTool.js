import { PencilBrush } from 'fabric';

export class PenTool {
  constructor(doodleChart) {
    this.doodleChart = doodleChart;
    this.canvas = doodleChart.fabricCanvas;
  }

  activate() {
    const canvasWrapper = this.canvas.wrapperEl;
    canvasWrapper.style.pointerEvents = 'auto';
    this.canvas.isDrawingMode = true;
    this.canvas.selection = false;
    
    this.canvas.freeDrawingBrush = new PencilBrush(this.canvas);
    this.canvas.freeDrawingBrush.color = this.doodleChart.currentColor;
    this.canvas.freeDrawingBrush.width = this.doodleChart.currentWidth;
    canvasWrapper.style.cursor = 'crosshair';
  }
}