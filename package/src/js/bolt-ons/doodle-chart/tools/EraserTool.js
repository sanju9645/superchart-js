import { Line, Rect, Circle } from 'fabric';

export class EraserTool {
  constructor(doodleChart) {
    this.doodleChart = doodleChart;
    this.canvas = doodleChart.fabricCanvas;
  }

  activate() {
    const canvasWrapper = this.canvas.wrapperEl;
    canvasWrapper.style.pointerEvents = 'auto';
    this.canvas.isDrawingMode = false;
    this.canvas.selection = false;
    canvasWrapper.style.cursor = 'crosshair';
    
    this.canvas.on('mouse:down', (options) => {
      this.eraseObjects(options);
    });

    this.canvas.on('mouse:move', (options) => {
      if (options.e.buttons === 1) {
        this.eraseObjects(options);
      }
    });
  }

  eraseObjects(options) {
    const pointer = this.canvas.getPointer(options.e);
    const objects = this.canvas.getObjects();
    const tolerance = this.doodleChart.currentWidth;

    objects.forEach(obj => {
      if (obj instanceof Line) {
        this.eraseLineObject(obj, pointer, tolerance);
      } 
      else if (obj instanceof Rect || obj instanceof Circle) {
        this.eraseShapeObject(obj, pointer, tolerance);
      }
      else if (obj.containsPoint(pointer)) {
        this.doodleChart.historyManager.objectList.push(obj);
        this.canvas.remove(obj);
      }
    });

    this.canvas.renderAll();
    this.doodleChart.historyManager.updateUndoButton();
  }

  eraseLineObject(obj, pointer, tolerance) {
    const p1 = { x: obj.x1, y: obj.y1 };
    const p2 = { x: obj.x2, y: obj.y2 };
    if (this.distanceFromPointToLine(pointer, p1, p2) < tolerance) {
      this.doodleChart.historyManager.objectList.push(obj);
      this.canvas.remove(obj);
    }
  }

  eraseShapeObject(obj, pointer, tolerance) {
    const objectCoords = obj.getCoords();
    for (let i = 0; i < objectCoords.length; i++) {
      const point1 = objectCoords[i];
      const point2 = objectCoords[(i + 1) % objectCoords.length];
      if (this.distanceFromPointToLine(pointer, point1, point2) < tolerance) {
        this.doodleChart.historyManager.objectList.push(obj);
        this.canvas.remove(obj);
        break;
      }
    }
  }

  distanceFromPointToLine(point, lineStart, lineEnd) {
    const numerator = Math.abs(
      (lineEnd.y - lineStart.y) * point.x -
      (lineEnd.x - lineStart.x) * point.y +
      lineEnd.x * lineStart.y -
      lineEnd.y * lineStart.x
    );
    
    const denominator = Math.sqrt(
      Math.pow(lineEnd.y - lineStart.y, 2) +
      Math.pow(lineEnd.x - lineStart.x, 2)
    );
    
    return numerator / denominator;
  }
}