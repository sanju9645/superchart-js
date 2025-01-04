import { Line } from 'fabric';

export class LineShape {
  constructor(doodleChart) {
    this.doodleChart = doodleChart;
    this.canvas = doodleChart.fabricCanvas;
    this.isDrawingLine = false;
    this.line = null;
    this.startPoint = null;
  }

  activate() {
    const canvasWrapper = this.canvas.wrapperEl;
    canvasWrapper.style.pointerEvents = 'auto';
    this.canvas.isDrawingMode = false;
    this.canvas.selection = false;
    canvasWrapper.style.cursor = 'crosshair';
    
    this.canvas.on('mouse:down', this.onMouseDown.bind(this));
    this.canvas.on('mouse:move', this.onMouseMove.bind(this));
    this.canvas.on('mouse:up', this.onMouseUp.bind(this));
  }

  onMouseDown(options) {
    this.isDrawingLine = true;
    const pointer = this.canvas.getPointer(options.e);
    this.startPoint = pointer;
    
    this.line = new Line([pointer.x, pointer.y, pointer.x, pointer.y], {
      stroke: this.doodleChart.currentColor,
      strokeWidth: this.doodleChart.currentWidth,
      selectable: false
    });
    
    this.canvas.add(this.line);
  }

  onMouseMove(options) {
    if (!this.isDrawingLine) return;
    
    const pointer = this.canvas.getPointer(options.e);
    this.line.set({
      x2: pointer.x,
      y2: pointer.y
    });
    this.canvas.renderAll();
  }

  onMouseUp() {
    if (!this.isDrawingLine) return;
    this.isDrawingLine = false;
    this.line.setCoords();
    
    const moveButton = document.querySelector('[data-tool="move"]');
    if (moveButton) {
      moveButton.click();
    }
  }
}