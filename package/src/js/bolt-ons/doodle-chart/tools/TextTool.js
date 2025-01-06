import { IText } from 'fabric';

export class TextTool {
  constructor(doodleChart) {
    this.doodleChart = doodleChart;
    this.canvas = doodleChart.fabricCanvas;
    this.isTextMode = true;
  }

  activate() {
    const canvasWrapper = this.canvas.wrapperEl;
    canvasWrapper.style.pointerEvents = 'auto';
    this.canvas.isDrawingMode = false;
    this.canvas.selection = true;
    canvasWrapper.style.cursor = 'text';

    this.canvas.on('mouse:down', (options) => {
      if (this.isTextMode) {
        this.addText(options);
      }
    });
  }

  addText(options) {
    const pointer = this.canvas.getPointer(options.e);
    const text = new IText('Click to edit text', {
      left: pointer.x,
      top: pointer.y,
      fontSize: this.doodleChart.currentWidth,
      fill: this.doodleChart.currentColor,
      fontFamily: 'Arial',
      selectable: true,
      editable: true
    });
    
    this.canvas.add(text);
    this.canvas.setActiveObject(text);
    text.enterEditing();
    text.selectAll();
    
    this.isTextMode = false;
    
    const moveButton = document.querySelector('[data-tool="move"]');
    if (moveButton) {
      moveButton.click();
    }
  }
}