import { Canvas, PencilBrush, Line, Rect, Circle, IText } from 'fabric';

export class DrawingTools {
  constructor() {
    this.currentColor = '#000000';
    this.currentWidth = 2;
    this.fabricCanvas = null;
    this.isDrawing = false;
    this.currentMode = 'pen';
    this.line = null;
    this.isDrawingLine = false;
    this.shape = null;
    this.isDrawingShape = false;
    this.startPoint = null;
    this.isTextMode = false;
    this.objectList = [];
  }

  createDrawingTools(parentDiv, chartCanvasId) {
    const toolbar = document.createElement('div');
    toolbar.className = 'drawing-toolbar';
    toolbar.innerHTML = `
      <button class="drawing-tool" data-tool="pen" title="Free Draw">
        <i class="fas fa-pen"></i>
      </button>
      <button class="drawing-tool" data-tool="line" title="Straight Line">
        <i class="fas fa-minus"></i>
      </button>
      <button class="drawing-tool" data-tool="rectangle" title="Rectangle">
        <i class="fas fa-square"></i>
      </button>
      <button class="drawing-tool" data-tool="circle" title="Circle">
        <i class="fas fa-circle"></i>
      </button>
      <button class="drawing-tool" data-tool="text" title="Add Text">
        <i class="fas fa-font"></i>
      </button>
      <button class="drawing-tool" data-tool="eraser" title="Eraser">
        <i class="fas fa-eraser"></i>
      </button>
      <button class="drawing-tool" data-tool="move" title="Move">
        <i class="fas fa-arrows-alt"></i>
      </button>
      <input type="color" class="color-picker" value="#000000" title="Color">
      <input type="range" class="width-slider" min="1" max="72" value="2" title="Size">
      <button class="undo-canvas" title="Undo">
        <i class="fas fa-undo"></i>
      </button>
      <button class="clear-canvas" title="Clear Drawing">
        <i class="fas fa-trash"></i>
      </button>
    `;
    parentDiv.appendChild(toolbar);

    const chartCanvas = document.getElementById(chartCanvasId);
    const rect = chartCanvas.getBoundingClientRect();

    const drawingCanvas = document.createElement('canvas');
    drawingCanvas.id = `drawing-${chartCanvasId}`;
    drawingCanvas.style.position = 'absolute';
    drawingCanvas.style.top = '0';
    drawingCanvas.style.left = '0';
    drawingCanvas.style.zIndex = '100';
    parentDiv.appendChild(drawingCanvas);

    this.fabricCanvas = new Canvas(drawingCanvas.id, {
      width: rect.width,
      height: rect.height,
      isDrawingMode: false,
      selection: true
    });

    this.fabricCanvas.freeDrawingBrush = new PencilBrush(this.fabricCanvas);
    this.fabricCanvas.freeDrawingBrush.width = this.currentWidth;
    this.fabricCanvas.freeDrawingBrush.color = this.currentColor;

    const canvasWrapper = this.fabricCanvas.wrapperEl;
    canvasWrapper.style.position = 'absolute';
    canvasWrapper.style.top = '0';
    canvasWrapper.style.left = '0';
    canvasWrapper.style.zIndex = '100';
    canvasWrapper.style.pointerEvents = 'none';

    this.setupEventListeners(toolbar);

    // Initialize first state
    this.saveState();

    // Initialize canvas state tracking
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

  setupEventListeners(toolbar) {
    toolbar.querySelectorAll('.drawing-tool').forEach(button => {
      button.addEventListener('click', (e) => {
        const tool = e.currentTarget.dataset.tool;
        if (tool !== 'text') {
          this.isTextMode = false;
        }
        this.setTool(tool);
        
        toolbar.querySelectorAll('.drawing-tool').forEach(btn => 
          btn.classList.remove('active'));
        e.currentTarget.classList.add('active');

        // Update slider range based on tool
        const widthSlider = toolbar.querySelector('.width-slider');
        if (tool === 'text') {
          widthSlider.min = '10';
          widthSlider.max = '72';
          widthSlider.title = 'Font Size';
        } else {
          widthSlider.min = '1';
          widthSlider.max = '10';
          widthSlider.title = 'Line Width';
        }
      });
    });

    toolbar.querySelector('.color-picker').addEventListener('change', (e) => {
      this.currentColor = e.target.value;
      if (this.currentMode === 'pen') {
        this.fabricCanvas.freeDrawingBrush.color = this.currentColor;
      }
    });

    toolbar.querySelector('.width-slider').addEventListener('input', (e) => {
      this.currentWidth = parseInt(e.target.value);
      if (this.currentMode === 'pen') {
        this.fabricCanvas.freeDrawingBrush.width = this.currentWidth;
      }
      
      // Update active text object if exists
      const activeObject = this.fabricCanvas.getActiveObject();
      if (activeObject && activeObject instanceof IText) {
        activeObject.set('fontSize', this.currentWidth);
        this.fabricCanvas.renderAll();
      }
    });

    // Undo button
    toolbar.querySelector('.undo-canvas').addEventListener('click', () => {
      this.undo();
    });

    // Clear canvas
    toolbar.querySelector('.clear-canvas').addEventListener('click', () => {
      this.fabricCanvas.clear();
      this.objectList = [];
      this.updateUndoButton();
    });

    // Add keyboard shortcut for undo
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        this.undo();
      }
    });
  }

  saveState() {
    const objects = this.fabricCanvas.getObjects();
    if (objects.length > 0) {
      this.canvasState.push([...objects]);
      this.updateUndoButton();
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

  setTool(tool) {
    const canvasWrapper = this.fabricCanvas.wrapperEl;
    this.currentMode = tool;

    this.fabricCanvas.off('mouse:down');
    this.fabricCanvas.off('mouse:move');
    this.fabricCanvas.off('mouse:up');
    
    switch (tool) {
      case 'pen':
        canvasWrapper.style.pointerEvents = 'auto';
        this.fabricCanvas.isDrawingMode = true;
        this.fabricCanvas.selection = false;
        this.fabricCanvas.freeDrawingBrush.color = this.currentColor;
        this.fabricCanvas.freeDrawingBrush.width = this.currentWidth;
        canvasWrapper.style.cursor = 'crosshair';
        break;

      case 'text':
        this.isTextMode = true;
        canvasWrapper.style.pointerEvents = 'auto';
        this.fabricCanvas.isDrawingMode = false;
        this.fabricCanvas.selection = true;
        canvasWrapper.style.cursor = 'text';

        this.fabricCanvas.on('mouse:down', (options) => {
          if (this.isTextMode) {
            const pointer = this.fabricCanvas.getPointer(options.e);
            const text = new IText('Click to edit text', {
              left: pointer.x,
              top: pointer.y,
              fontSize: this.currentWidth,
              fill: this.currentColor,
              fontFamily: 'Arial',
              selectable: true,
              editable: true
            });
            
            this.fabricCanvas.add(text);
            this.fabricCanvas.setActiveObject(text);
            text.enterEditing();
            text.selectAll();
            
            this.isTextMode = false;
            
            // Switch to move tool after adding text
            const moveButton = document.querySelector('[data-tool="move"]');
            if (moveButton) {
              moveButton.click();
            }
          }
        });
        break;

      case 'line':
        canvasWrapper.style.pointerEvents = 'auto';
        this.fabricCanvas.isDrawingMode = false;
        this.fabricCanvas.selection = false;
        canvasWrapper.style.cursor = 'crosshair';
        
        this.fabricCanvas.on('mouse:down', (options) => {
          if (!this.isDrawingLine) {
            const pointer = this.fabricCanvas.getPointer(options.e);
            this.isDrawingLine = true;

            this.line = new Line([pointer.x, pointer.y, pointer.x, pointer.y], {
              stroke: this.currentColor,
              strokeWidth: this.currentWidth,
              selectable: true,
              evented: true,
              perPixelTargetFind: true,
              hasBorders: true,
              hasControls: true,
              cornerStyle: 'circle',
              cornerColor: 'rgba(0,0,255,0.5)',
              cornerSize: 8,
              transparentCorners: false
            });

            this.fabricCanvas.add(this.line);
          } else {
            this.isDrawingLine = false;
            this.line = null;
          }
        });

        this.fabricCanvas.on('mouse:move', (options) => {
          if (!this.isDrawingLine || !this.line) return;
          const pointer = this.fabricCanvas.getPointer(options.e);

          this.line.set({
            x2: pointer.x,
            y2: pointer.y
          });
          
          this.fabricCanvas.renderAll();
        });
        break;

      case 'rectangle':
        canvasWrapper.style.pointerEvents = 'auto';
        this.fabricCanvas.isDrawingMode = false;
        this.fabricCanvas.selection = false;
        canvasWrapper.style.cursor = 'crosshair';
        
        this.fabricCanvas.on('mouse:down', (options) => {
          const pointer = this.fabricCanvas.getPointer(options.e);
          this.startPoint = pointer;
          this.isDrawingShape = true;

          this.shape = new Rect({
            left: pointer.x,
            top: pointer.y,
            width: 0,
            height: 0,
            stroke: this.currentColor,
            strokeWidth: this.currentWidth,
            fill: 'transparent',
            selectable: true,
            evented: true
          });

          this.fabricCanvas.add(this.shape);
        });

        this.fabricCanvas.on('mouse:move', (options) => {
          if (!this.isDrawingShape) return;
          const pointer = this.fabricCanvas.getPointer(options.e);

          const width = pointer.x - this.startPoint.x;
          const height = pointer.y - this.startPoint.y;

          this.shape.set({
            width: Math.abs(width),
            height: Math.abs(height),
            left: width > 0 ? this.startPoint.x : pointer.x,
            top: height > 0 ? this.startPoint.y : pointer.y
          });
          
          this.fabricCanvas.renderAll();
        });

        this.fabricCanvas.on('mouse:up', () => {
          this.isDrawingShape = false;
          this.shape = null;
          this.startPoint = null;
        });
        break;

      case 'circle':
        canvasWrapper.style.pointerEvents = 'auto';
        this.fabricCanvas.isDrawingMode = false;
        this.fabricCanvas.selection = false;
        canvasWrapper.style.cursor = 'crosshair';
        
        this.fabricCanvas.on('mouse:down', (options) => {
          const pointer = this.fabricCanvas.getPointer(options.e);
          this.startPoint = pointer;
          this.isDrawingShape = true;

          this.shape = new Circle({
            left: pointer.x,
            top: pointer.y,
            radius: 0,
            stroke: this.currentColor,
            strokeWidth: this.currentWidth,
            fill: 'transparent',
            selectable: true,
            evented: true
          });

          this.fabricCanvas.add(this.shape);
        });

        this.fabricCanvas.on('mouse:move', (options) => {
          if (!this.isDrawingShape) return;
          const pointer = this.fabricCanvas.getPointer(options.e);

          const radius = Math.sqrt(
            Math.pow(pointer.x - this.startPoint.x, 2) +
            Math.pow(pointer.y - this.startPoint.y, 2)
          ) / 2;

          const centerX = (this.startPoint.x + pointer.x) / 2;
          const centerY = (this.startPoint.y + pointer.y) / 2;

          this.shape.set({
            radius: radius,
            left: centerX - radius,
            top: centerY - radius
          });
          
          this.fabricCanvas.renderAll();
        });

        this.fabricCanvas.on('mouse:up', () => {
          this.isDrawingShape = false;
          this.shape = null;
          this.startPoint = null;
        });
        break;

      case 'eraser':
        canvasWrapper.style.pointerEvents = 'auto';
        this.fabricCanvas.isDrawingMode = false;
        this.fabricCanvas.selection = false;
        canvasWrapper.style.cursor = 'crosshair';
        
        let isErasing = false;
        let removedObjects = [];

        this.fabricCanvas.on('mouse:down', () => {
          isErasing = true;
          removedObjects = [];
        });

        this.fabricCanvas.on('mouse:move', (options) => {
          if (!isErasing) return;
          const pointer = this.fabricCanvas.getPointer(options.e);
          const objects = this.fabricCanvas.getObjects();
          
          objects.forEach(obj => {
            if (obj instanceof Line) {
              const line = obj;
              const p1 = { x: line.x1, y: line.y1 };
              const p2 = { x: line.x2, y: line.y2 };
              const distance = this.distanceFromPointToLine(pointer, p1, p2);
              
              if (distance < this.currentWidth * 2) {
                removedObjects.push(obj);
                this.fabricCanvas.remove(obj);
              }
            } else if (obj.containsPoint(pointer)) {
              removedObjects.push(obj);
              this.fabricCanvas.remove(obj);
            }
          });
          this.fabricCanvas.renderAll();
        });

        this.fabricCanvas.on('mouse:up', () => {
          if (isErasing && removedObjects.length > 0) {
            // Add removed objects to undo stack
            removedObjects.forEach(obj => this.undoStack.push(obj));
            this.updateUndoButton();
          }
          isErasing = false;
        });
        break;

      case 'move':
        canvasWrapper.style.pointerEvents = 'auto';
        this.fabricCanvas.isDrawingMode = false;
        this.fabricCanvas.selection = true;
        canvasWrapper.style.cursor = 'move';
        this.fabricCanvas.getObjects().forEach(obj => {
          obj.selectable = true;
          obj.evented = true;
          if (obj instanceof Line) {
            obj.hasControls = true;
            obj.hasBorders = true;
          }
        });
        break;

      default:
        canvasWrapper.style.pointerEvents = 'none';
        this.fabricCanvas.isDrawingMode = false;
        this.fabricCanvas.selection = false;
        canvasWrapper.style.cursor = 'default';
    }

    this.fabricCanvas.renderAll();
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

  saveCanvasState() {
    const objects = this.fabricCanvas.getObjects();
    if (objects.length > 0) {
      this.undoStack.push([...objects]);
      this.redoStack = [];
      this.updateUndoRedoButtons();
    }
  }

  saveToUndoStack() {
    const objects = this.fabricCanvas.getObjects();
    if (objects.length > 0) {
      this.undoStack.push([...objects]);
    }
  }

  saveToRedoStack() {
    const objects = this.fabricCanvas.getObjects();
    if (objects.length > 0) {
      this.redoStack.push([...objects]);
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