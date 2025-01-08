export class MoveTool {
  constructor(doodleChart) {
    this.doodleChart = doodleChart;
    this.canvas = doodleChart.fabricCanvas;
  }

  activate() {
    const canvasWrapper = this.canvas.wrapperEl;
    canvasWrapper.style.pointerEvents = 'auto';
    this.canvas.isDrawingMode = false;
    this.canvas.selection = true;
    canvasWrapper.style.cursor = 'move';
    
    this.canvas.getObjects().forEach(obj => {
      obj.selectable = true;
      obj.evented = true;
    });
  }
}