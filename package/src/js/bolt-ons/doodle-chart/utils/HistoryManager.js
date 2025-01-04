export class HistoryManager {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
    this.objectList = [];
  }

  initialize(fabricCanvas) {
    this.fabricCanvas = fabricCanvas;
    this.setupHistoryListeners();
  }

  setupHistoryListeners() {
    this.fabricCanvas.on('object:added', (e) => {
      if (e.target) {
        this.objectList.push(e.target);
        this.updateUndoButton();
      }
    });

    this.fabricCanvas.on('object:removed', () => {
      this.saveState();
    });
  }

  saveState(chartId) {
    const canvas = document.getElementById(chartId);
    if (canvas) {
      const imageData = canvas.toDataURL();
      this.undoStack.push(imageData);
      this.redoStack = [];
    }
  }

  undo() {
    if (this.objectList.length > 0) {
      const lastObject = this.objectList.pop();
      this.fabricCanvas.remove(lastObject);
      this.fabricCanvas.renderAll();
      this.updateUndoButton();
    }
  }

  updateUndoButton() {
    const undoButton = document.querySelector('.undo-canvas');
    if (undoButton) {
      undoButton.disabled = this.objectList.length === 0;
    }
  }

  saveCanvasState() {
    const objects = this.fabricCanvas.getObjects();
    if (objects.length > 0) {
      this.undoStack.push([...objects]);
      this.redoStack = [];
    }
  }

  loadCanvasState(objects) {
    this.fabricCanvas.clear();
    if (objects && objects.length > 0) {
      objects.forEach(obj => {
        this.fabricCanvas.add(obj);
      });
    }
    this.fabricCanvas.renderAll();
  }
}