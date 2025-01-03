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
    this.isToolbarVisible = false;
    this.undoStack = [];
    this.redoStack = [];
  }

  createDrawingTools(parentDiv, chartCanvasId) {
    // First check if the parent div and canvas exist
    if (!parentDiv || !chartCanvasId) {
        console.error('Parent div or canvas ID not provided');
        return;
    }

    const chartCanvas = document.getElementById(chartCanvasId);
    if (!chartCanvas) {
        console.error('Chart canvas not found:', chartCanvasId);
        return;
    }

    // Create toggle button if it doesn't exist
    let toggleButton = document.getElementById(`tool-box-container-div-${chartCanvasId}`);
    
    if (!toggleButton) {
      toggleButton = this.createToolBoxContainer(chartCanvasId);
    }

    const toolbar = document.createElement('div');
    toolbar.className = 'drawing-toolbar';

    // Find the existing toggle button
    if (!toggleButton) {
        console.error('Drawing toggle button not found');
        return;
    }

    toolbar.innerHTML = `
      <button class="drawing-tool tool-box-icon" data-tool="pen" title="Free Draw">
        <i class="fa-solid fa-pen-nib"></i>
      </button>
      <button class="drawing-tool tool-box-icon" data-tool="line" title="Straight Line">
        <i class="fa-solid fa-minus"></i>
      </button>
      <button class="drawing-tool tool-box-icon" data-tool="rectangle" title="Rectangle">
        <i class="fa-regular fa-square"></i>
      </button>
      <button class="drawing-tool tool-box-icon" data-tool="circle" title="Circle">
        <i class="fa-regular fa-circle"></i>
      </button>
      <button class="drawing-tool tool-box-icon" data-tool="text" title="Add Text">
        <i class="fa-solid fa-font"></i>
      </button>
      <button class="drawing-tool tool-box-icon" data-tool="eraser" title="Eraser">
        <i class="fa-solid fa-eraser"></i>
      </button>
      <button class="drawing-tool tool-box-icon" data-tool="move" title="Move">
        <i class="fa-solid fa-up-down-left-right"></i>
      </button>
      <input type="color" class="color-picker tool-box-icon" value="#000000" title="Color">
      <input type="range" class="width-slider" min="1" max="72" value="2" title="Size">
      
      <button class="undo-canvas tool-box-icon" title="Undo">
        <i class="fa-solid fa-arrow-rotate-left"></i>
      </button>
      <button class="clear-canvas tool-box-icon" title="Clear Drawing">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `;

    // Get canvas wrapper (created by fabric.js)
    const rect = chartCanvas.getBoundingClientRect();

    const drawingCanvas = document.createElement('canvas');
    drawingCanvas.id = `drawing-${chartCanvasId}`;
    drawingCanvas.style.position = 'absolute';
    drawingCanvas.style.top = '0';
    drawingCanvas.style.left = '0';
    parentDiv.appendChild(drawingCanvas);

    try {
        this.fabricCanvas = new Canvas(drawingCanvas.id, {
            width: rect.width,
            height: rect.height,
            isDrawingMode: false,
            selection: true
        });
    } catch (error) {
        console.error('Failed to initialize fabric canvas:', error);
        return;
    }

    // Only proceed with setup if fabric canvas was created successfully
    if (!this.fabricCanvas || !this.fabricCanvas.wrapperEl) {
        console.error('Fabric canvas not properly initialized');
        return;
    }

    // Immediately set the z-index of the fabric canvas wrapper
    this.fabricCanvas.wrapperEl.style.zIndex = '-1';
    this.fabricCanvas.wrapperEl.style.position = 'absolute';

    // Add toolbar and toggle button to the canvas wrapper
    const canvasWrapper = this.fabricCanvas.wrapperEl;
    canvasWrapper.style.position = 'relative';
    canvasWrapper.appendChild(toolbar);
    // canvasWrapper.appendChild(toggleButton);

    // Update toggle functionality
    toggleButton.addEventListener('click', () => {
      this.isToolbarVisible = !this.isToolbarVisible;
      toolbar.style.display = this.isToolbarVisible ? 'flex' : 'none';
      toolbar.style.justifyContent = 'center';
      toolbar.style.alignItems = 'center';
      toolbar.style.gap = '4px';

      toggleButton.style.backgroundColor = this.isToolbarVisible ? '#e6e6e6' : 'white';
      
      // Update z-index of the fabric canvas wrapper
      this.fabricCanvas.wrapperEl.style.zIndex = this.isToolbarVisible ? '100' : '-1';
      
      if (!this.isToolbarVisible) {
        this.fabricCanvas.discardActiveObject();
        this.fabricCanvas.requestRenderAll();
      }
    });

    this.fabricCanvas.freeDrawingBrush = new PencilBrush(this.fabricCanvas);
    this.fabricCanvas.freeDrawingBrush.width = this.currentWidth;
    this.fabricCanvas.freeDrawingBrush.color = this.currentColor;

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

  saveState(chartId) {
    const canvas = document.getElementById(chartId);
    if (canvas) {
      // Save the current state before pushing to undoStack
      const imageData = canvas.toDataURL();
      this.undoStack.push(imageData);
      // Clear redo stack when new action is performed
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

  setTool(tool) {
    // Add safety check at the start of setTool
    if (!this.fabricCanvas || !this.fabricCanvas.wrapperEl) {
        console.error('Canvas not properly initialized');
        return;
    }

    const canvasWrapper = this.fabricCanvas.wrapperEl;
    this.currentMode = tool;

    // Reset all objects' selection state
    this.fabricCanvas.getObjects().forEach(obj => {
      obj.selectable = false;
      obj.evented = true;
    });

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
          this.isDrawingLine = true;
          const pointer = this.fabricCanvas.getPointer(options.e);
          this.startPoint = pointer;
          
          this.line = new Line([pointer.x, pointer.y, pointer.x, pointer.y], {
            stroke: this.currentColor,
            strokeWidth: this.currentWidth,
            selectable: false
          });
          
          this.fabricCanvas.add(this.line);
        });
        
        this.fabricCanvas.on('mouse:move', (options) => {
          if (!this.isDrawingLine) return;
          
          const pointer = this.fabricCanvas.getPointer(options.e);
          this.line.set({
            x2: pointer.x,
            y2: pointer.y
          });
          this.fabricCanvas.renderAll();
        });
        
        this.fabricCanvas.on('mouse:up', () => {
          if (!this.isDrawingLine) return;
          this.isDrawingLine = false;
          this.line.setCoords();
          
          // Reset to move tool after drawing
          const moveButton = document.querySelector('[data-tool="move"]');
          if (moveButton) {
            moveButton.click();
          }
        });
        break;

      case 'rectangle':
        canvasWrapper.style.pointerEvents = 'auto';
        this.fabricCanvas.isDrawingMode = false;
        this.fabricCanvas.selection = false;
        canvasWrapper.style.cursor = 'crosshair';
        
        this.fabricCanvas.on('mouse:down', (options) => {
          this.isDrawingShape = true;
          const pointer = this.fabricCanvas.getPointer(options.e);
          this.startPoint = pointer;
          
          this.shape = new Rect({
            left: pointer.x,
            top: pointer.y,
            width: 0,
            height: 0,
            stroke: this.currentColor,
            strokeWidth: this.currentWidth,
            fill: 'transparent',
            selectable: false
          });
          
          this.fabricCanvas.add(this.shape);
        });
        
        this.fabricCanvas.on('mouse:move', (options) => {
          if (!this.isDrawingShape) return;
          
          const pointer = this.fabricCanvas.getPointer(options.e);
          this.shape.set({
            width: Math.abs(pointer.x - this.startPoint.x),
            height: Math.abs(pointer.y - this.startPoint.y),
            left: Math.min(this.startPoint.x, pointer.x),
            top: Math.min(this.startPoint.y, pointer.y)
          });
          this.fabricCanvas.renderAll();
        });
        
        this.fabricCanvas.on('mouse:up', () => {
          if (!this.isDrawingShape) return;
          this.isDrawingShape = false;
          this.shape.setCoords();
          
          // Reset to move tool after drawing
          const moveButton = document.querySelector('[data-tool="move"]');
          if (moveButton) {
            moveButton.click();
          }
        });
        break;

      case 'circle':
        canvasWrapper.style.pointerEvents = 'auto';
        this.fabricCanvas.isDrawingMode = false;
        this.fabricCanvas.selection = false;
        canvasWrapper.style.cursor = 'crosshair';
        
        this.fabricCanvas.on('mouse:down', (options) => {
          this.isDrawingShape = true;
          const pointer = this.fabricCanvas.getPointer(options.e);
          this.startPoint = pointer;
          
          this.shape = new Circle({
            left: pointer.x,
            top: pointer.y,
            radius: 0,
            stroke: this.currentColor,
            strokeWidth: this.currentWidth,
            fill: 'transparent',
            selectable: false
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
          
          this.shape.set({
            radius: radius,
            left: this.startPoint.x - radius,
            top: this.startPoint.y - radius
          });
          this.fabricCanvas.renderAll();
        });
        
        this.fabricCanvas.on('mouse:up', () => {
          if (!this.isDrawingShape) return;
          this.isDrawingShape = false;
          this.shape.setCoords();
          
          // Reset to move tool after drawing
          const moveButton = document.querySelector('[data-tool="move"]');
          if (moveButton) {
            moveButton.click();
          }
        });
        break;

      case 'eraser':
        canvasWrapper.style.pointerEvents = 'auto';
        this.fabricCanvas.isDrawingMode = false;
        this.fabricCanvas.selection = false;
        canvasWrapper.style.cursor = 'crosshair';
        
        this.fabricCanvas.on('mouse:down', (options) => {
          this.eraseObjects(options);
        });

        this.fabricCanvas.on('mouse:move', (options) => {
          if (options.e.buttons === 1) { // Check if mouse button is pressed
            this.eraseObjects(options);
          }
        });
        break;

      case 'move':
        canvasWrapper.style.pointerEvents = 'auto';
        this.fabricCanvas.isDrawingMode = false;
        this.fabricCanvas.selection = true;
        canvasWrapper.style.cursor = 'move';
        
        // Make all objects selectable
        this.fabricCanvas.getObjects().forEach(obj => {
          obj.selectable = true;
          obj.evented = true;
        });
        break;

      default:
        // For all other tools, make objects non-selectable
        this.fabricCanvas.getObjects().forEach(obj => {
          obj.selectable = false;
          obj.evented = true;
        });
    }

    this.fabricCanvas.renderAll();
  }

  eraseObjects(options) {
    const pointer = this.fabricCanvas.getPointer(options.e);
    const objects = this.fabricCanvas.getObjects();
    const tolerance = this.currentWidth; // Use current width as tolerance

    objects.forEach(obj => {
      if (obj instanceof Line) {
        // For lines, check distance from point to line
        const p1 = { x: obj.x1, y: obj.y1 };
        const p2 = { x: obj.x2, y: obj.y2 };
        if (this.distanceFromPointToLine(pointer, p1, p2) < tolerance) {
          this.objectList.push(obj);
          this.fabricCanvas.remove(obj);
        }
      } 
      else if (obj instanceof Rect || obj instanceof Circle) {
        // For rectangles and circles, check if point is near the stroke
        const objectCenter = obj.getCenterPoint();
        const objectCoords = obj.getCoords(); // Get all corner points

        // Check if point is near any edge
        for (let i = 0; i < objectCoords.length; i++) {
          const point1 = objectCoords[i];
          const point2 = objectCoords[(i + 1) % objectCoords.length];
          if (this.distanceFromPointToLine(pointer, point1, point2) < tolerance) {
            this.objectList.push(obj);
            this.fabricCanvas.remove(obj);
            break;
          }
        }
      }
      // For all other objects (including pen strokes)
      else if (obj.containsPoint(pointer)) {
        this.objectList.push(obj);
        this.fabricCanvas.remove(obj);
      }
    });

    this.fabricCanvas.renderAll();
    this.updateUndoButton();
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

  createToolBoxContainer(canvasId) {
    const toolBoxContainer = document.createElement('div');
    toolBoxContainer.className = 'tool-box-container-div';
    toolBoxContainer.id = `tool-box-container-div-${canvasId}`;

    const toolBoxIcon = document.createElement('i');
    toolBoxIcon.className = 'fa-solid fa-screwdriver-wrench';
    toolBoxContainer.appendChild(toolBoxIcon);

    return toolBoxContainer;
  }
}