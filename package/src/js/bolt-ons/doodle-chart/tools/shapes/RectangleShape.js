import { Rect } from 'fabric';

export class RectangleShape {
  constructor(doodleChart) {
    this.doodleChart = doodleChart;
    this.canvas = doodleChart.fabricCanvas;
    this.isDrawingShape = false;
    this.shape = null;
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
    this.isDrawingShape = true;
    const pointer = this.canvas.getPointer(options.e);
    this.startPoint = pointer;
    
    this.shape = new Rect({
      left: pointer.x,
      top: pointer.y,
      width: 0,
      height: 0,
      stroke: this.doodleChart.currentColor,
      strokeWidth: this.doodleChart.currentWidth,
      fill: 'transparent',
      selectable: false
    });
    
    this.canvas.add(this.shape);
  }

  onMouseMove(options) {
    if (!this.isDrawingShape) return;
    
    const pointer = this.canvas.getPointer(options.e);
    this.shape.set({
      width: Math.abs(pointer.x - this.startPoint.x),
      height: Math.abs(pointer.y - this.startPoint.y),
      left: Math.min(this.startPoint.x, pointer.x),
      top: Math.min(this.startPoint.y, pointer.y)
    });
    this.canvas.renderAll();
  }

  onMouseUp() {
    if (!this.isDrawingShape) return;
    this.isDrawingShape = false;
    this.shape.setCoords();
    
    const moveButton = document.querySelector('[data-tool="move"]');
    if (moveButton) {
      moveButton.click();
    }
  }
}