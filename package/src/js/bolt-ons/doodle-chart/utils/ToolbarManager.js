export class ToolbarManager {
  initialize(doodleChart, chartCanvasId) {
    this.doodleChart = doodleChart;
    this.createToolbar(chartCanvasId);
    this.setupEventListeners();
  }

  createToolbar(chartCanvasId) {
    let toggleButton = document.getElementById(`tool-box-container-div-${chartCanvasId}`);
    
    if (!toggleButton) {
      toggleButton = this.createToolBoxContainer(chartCanvasId);
    }

    this.toolbar = document.createElement('div');
    this.toolbar.className = 'drawing-toolbar';
    this.toolbar.innerHTML = this.getToolbarHTML();
    
    const canvasWrapper = this.doodleChart.fabricCanvas.wrapperEl;
    canvasWrapper.style.position = 'relative';
    canvasWrapper.appendChild(this.toolbar);

    this.setupToggleButton(toggleButton);
  }

  getToolbarHTML() {
    return `
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

      <button class="close-canvas tool-box-icon" title="Close Drawing" id="close-tool-box-canvas">
        <i class="fa-solid fa-xmark"  style="color: red;"></i>
      </button>
    `;
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

  setupToggleButton(toggleButton) {
    toggleButton.addEventListener('click', () => {
      this.doodleChart.isToolbarVisible = !this.doodleChart.isToolbarVisible;
      this.toolbar.style.display = this.doodleChart.isToolbarVisible ? 'flex' : 'none';
      this.toolbar.style.justifyContent = 'center';
      this.toolbar.style.alignItems = 'center';
      this.toolbar.style.gap = '4px';

      toggleButton.style.backgroundColor = this.doodleChart.isToolbarVisible ? '#e6e6e6' : 'white';
      this.doodleChart.fabricCanvas.wrapperEl.style.zIndex = this.doodleChart.isToolbarVisible ? '100' : '-1';
      
      if (!this.doodleChart.isToolbarVisible) {
        this.doodleChart.fabricCanvas.discardActiveObject();
        this.doodleChart.fabricCanvas.requestRenderAll();
      }
    });
  }

  setupEventListeners() {
    this.setupToolButtons();
    this.setupColorPicker();
    this.setupWidthSlider();
    this.setupUndoButton();
    this.setupClearButton();
    this.setupCloseButton();
    this.setupKeyboardShortcuts();
  }

  setupCloseButton() {
    const closeButton = this.toolbar.querySelector('.close-canvas');
    closeButton.addEventListener('click', () => {
      this.toolbar.style.display = 'none';
      this.doodleChart.isToolbarVisible = false;
        
      // Reset toggle button state
      const toggleButton = document.getElementById(`tool-box-container-div-${this.doodleChart.chartCanvasId}`);
      if (toggleButton) {
          toggleButton.style.backgroundColor = 'white';
      }
        
      // Reset z-index
      this.doodleChart.fabricCanvas.wrapperEl.style.zIndex = '-1';
      
      // Discard active object if any
      this.doodleChart.fabricCanvas.discardActiveObject();
      this.doodleChart.fabricCanvas.requestRenderAll();
    });
  }

  setupToolButtons() {
    this.toolbar.querySelectorAll('.drawing-tool').forEach(button => {
      button.addEventListener('click', (e) => {
        const tool = e.currentTarget.dataset.tool;
        if (tool !== 'text') {
          this.doodleChart.isTextMode = false;
        }
        this.doodleChart.setTool(tool);
        
        this.toolbar.querySelectorAll('.drawing-tool').forEach(btn => 
          btn.classList.remove('active'));
        e.currentTarget.classList.add('active');

        // Update slider range based on tool
        const widthSlider = this.toolbar.querySelector('.width-slider');
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
  }

  setupColorPicker() {
    this.toolbar.querySelector('.color-picker').addEventListener('change', (e) => {
      this.doodleChart.currentColor = e.target.value;
      if (this.doodleChart.currentMode === 'pen') {
        this.doodleChart.fabricCanvas.freeDrawingBrush.color = this.doodleChart.currentColor;
      }
    });
  }

  setupWidthSlider() {
    this.toolbar.querySelector('.width-slider').addEventListener('input', (e) => {
      this.doodleChart.currentWidth = parseInt(e.target.value);
      if (this.doodleChart.currentMode === 'pen') {
        this.doodleChart.fabricCanvas.freeDrawingBrush.width = this.doodleChart.currentWidth;
      }
      
      // Update active text object if exists
      const activeObject = this.doodleChart.fabricCanvas.getActiveObject();
      if (activeObject && activeObject.type === 'i-text') {
        activeObject.set('fontSize', this.doodleChart.currentWidth);
        this.doodleChart.fabricCanvas.renderAll();
      }
    });
  }

  setupUndoButton() {
    this.toolbar.querySelector('.undo-canvas').addEventListener('click', () => {
      this.doodleChart.historyManager.undo();
    });
  }

  setupClearButton() {
    this.toolbar.querySelector('.clear-canvas').addEventListener('click', () => {
      this.doodleChart.fabricCanvas.clear();
      this.doodleChart.historyManager.objectList = [];
      this.doodleChart.historyManager.updateUndoButton();
    });
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        this.doodleChart.historyManager.undo();
      }
    });
  }
}