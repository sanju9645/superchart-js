import { Circle } from 'fabric';

export class CircleShape {
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
    
    this.shape = new Circle({
      left: pointer.x,
      top: pointer.y,
      radius: 0,
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
    const radius = Math.sqrt(
      Math.pow(pointer.x - this.startPoint.x, 2) +
      Math.pow(pointer.y - this.startPoint.y, 2)
    ) / 2;
    
    this.shape.set({
      radius: radius,
      left: this.startPoint.x - radius,
      top: this.startPoint.y - radius
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