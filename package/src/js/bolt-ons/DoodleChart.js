import { Canvas, PencilBrush, Line, Rect, Circle } from 'fabric';

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
  }

  createDrawingTools(parentDiv, chartCanvasId) {
    // Updated toolbar with new shape tools
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
      <button class="drawing-tool" data-tool="eraser" title="Eraser">
        <i class="fas fa-eraser"></i>
      </button>
      <button class="drawing-tool" data-tool="move" title="Move">
        <i class="fas fa-arrows-alt"></i>
      </button>
      <input type="color" class="color-picker" value="#000000" title="Color">
      <input type="range" class="width-slider" min="1" max="10" value="2" title="Width">
      <button class="clear-canvas" title="Clear Drawing">
        <i class="fas fa-trash"></i>
      </button>
    `;
    parentDiv.appendChild(toolbar);

    // Get chart dimensions
    const chartCanvas = document.getElementById(chartCanvasId);
    const rect = chartCanvas.getBoundingClientRect();

    // Create and setup the canvas
    const drawingCanvas = document.createElement('canvas');
    drawingCanvas.id = `drawing-${chartCanvasId}`;
    drawingCanvas.style.position = 'absolute';
    drawingCanvas.style.top = '0';
    drawingCanvas.style.left = '0';
    drawingCanvas.style.zIndex = '100';
    parentDiv.appendChild(drawingCanvas);

    // Initialize Fabric canvas
    this.fabricCanvas = new Canvas(drawingCanvas.id, {
      width: rect.width,
      height: rect.height,
      isDrawingMode: false,
      selection: true
    });

    // Initialize brush
    this.fabricCanvas.freeDrawingBrush = new PencilBrush(this.fabricCanvas);
    this.fabricCanvas.freeDrawingBrush.width = this.currentWidth;
    this.fabricCanvas.freeDrawingBrush.color = this.currentColor;

    // Make canvas wrapper interactive
    const canvasWrapper = this.fabricCanvas.wrapperEl;
    canvasWrapper.style.position = 'absolute';
    canvasWrapper.style.top = '0';
    canvasWrapper.style.left = '0';
    canvasWrapper.style.zIndex = '100';
    canvasWrapper.style.pointerEvents = 'none';

    this.setupEventListeners(toolbar);
  }

  setupEventListeners(toolbar) {
    // Tool selection
    toolbar.querySelectorAll('.drawing-tool').forEach(button => {
      button.addEventListener('click', (e) => {
        const tool = e.currentTarget.dataset.tool;
        this.setTool(tool);
        
        // Toggle active class
        toolbar.querySelectorAll('.drawing-tool').forEach(btn => 
          btn.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });

    // Color picker
    toolbar.querySelector('.color-picker').addEventListener('change', (e) => {
      this.currentColor = e.target.value;
      if (this.currentMode === 'pen') {
        this.fabricCanvas.freeDrawingBrush.color = this.currentColor;
      }
    });

    // Width slider
    toolbar.querySelector('.width-slider').addEventListener('input', (e) => {
      this.currentWidth = parseInt(e.target.value);
      if (this.currentMode === 'pen') {
        this.fabricCanvas.freeDrawingBrush.width = this.currentWidth;
      }
    });

    // Clear canvas
    toolbar.querySelector('.clear-canvas').addEventListener('click', () => {
      this.fabricCanvas.clear();
    });
  }

  setTool(tool) {
    const canvasWrapper = this.fabricCanvas.wrapperEl;
    this.currentMode = tool;

    // Remove any existing event listeners
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

        this.fabricCanvas.on('mouse:down', () => {
          isErasing = true;
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
                this.fabricCanvas.remove(obj);
                this.fabricCanvas.renderAll();
              }
            } else if (obj.containsPoint(pointer)) {
              this.fabricCanvas.remove(obj);
              this.fabricCanvas.renderAll();
            }
          });
        });

        this.fabricCanvas.on('mouse:up', () => {
          isErasing = false;
        });
        break;

      case 'move':
        canvasWrapper.style.pointerEvents = 'auto';
        this.fabricCanvas.isDrawingMode = false;
        this.fabricCanvas.selection = true;
        canvasWrapper.style.cursor = 'move';
        // Enable object movement
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
}