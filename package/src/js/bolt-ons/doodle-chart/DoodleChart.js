import { Canvas } from 'fabric';
import { HistoryManager } from './utils/HistoryManager.js';
import { ToolbarManager } from './utils/ToolbarManager.js';
import { PenTool } from './tools/PenTool.js';
import { TextTool } from './tools/TextTool.js';
import { MoveTool } from './tools/MoveTool.js';
import { EraserTool } from './tools/EraserTool.js';
import { LineShape } from './tools/shapes/LineShape.js';
import { RectangleShape } from './tools/shapes/RectangleShape.js';
import { CircleShape } from './tools/shapes/CircleShape.js';
import { DoodleChartStyles } from './style/DoodleChartStyles.js';

export class DoodleChart {
  constructor() {
    this.currentColor = '#000000';
    this.currentWidth = 2;
    this.fabricCanvas = null;
    this.currentMode = 'pen';
    this.isToolbarVisible = false;
    this.historyManager = new HistoryManager();
    this.toolbarManager = new ToolbarManager();
    DoodleChartStyles();
  }

  createDrawingTools(parentDiv, chartCanvasId) {
    /*
    chartParentDiv is the container element where the chart canvas lives, so the drawing tools need to be associated with this specific container to ensure they affect the correct chart (especially if there are multiple charts on the page)
    chartCanvasId is needed to uniquely identify which canvas the drawing tools should interact with. This is particularly important because:
    It allows the drawing tools to find and modify the specific canvas element
    It helps maintain separation between different charts' drawing functionalities when multiple charts exist on the page
    It can be used to namespace event listeners and drawing states for each specific chart
    */

    if (!parentDiv || !chartCanvasId) {
      console.error('Parent div or canvas ID not provided');
      return;
    }

    const chartCanvas = document.getElementById(chartCanvasId);
    if (!chartCanvas) {
      console.error('Chart canvas not found:', chartCanvasId);
      return;
    }

    const rect = chartCanvas.getBoundingClientRect();
    const drawingCanvas = this.createCanvas(chartCanvasId, parentDiv);
    
    this.initializeFabricCanvas(drawingCanvas, rect);
    this.toolbarManager.initialize(this, chartCanvasId);
    this.historyManager.initialize(this.fabricCanvas);
  }

  createCanvas(chartCanvasId, parentDiv) {
    const drawingCanvas = document.createElement('canvas');
    drawingCanvas.id = `drawing-${chartCanvasId}`;
    drawingCanvas.style.position = 'absolute';
    drawingCanvas.style.top = '0';
    drawingCanvas.style.left = '0';
    parentDiv.appendChild(drawingCanvas);
    return drawingCanvas;
  }

  initializeFabricCanvas(drawingCanvas, rect) {
    try {
      this.fabricCanvas = new Canvas(drawingCanvas.id, {
        width: rect.width,
        height: rect.height,
        isDrawingMode: false,
        selection: true
      });
      this.fabricCanvas.wrapperEl.style.zIndex = '-1';
      this.fabricCanvas.wrapperEl.style.position = 'absolute';
    } catch (error) {
      console.error('Failed to initialize fabric canvas:', error);
    }
  }

  setTool(tool) {
    if (!this.fabricCanvas || !this.fabricCanvas.wrapperEl) {
      console.error('Canvas not properly initialized');
      return;
    }

    this.currentMode = tool;
    this.resetCanvas();

    switch (tool) {
      case 'pen':
        new PenTool(this).activate();
        break;
      case 'text':
        new TextTool(this).activate();
        break;
      case 'line':
        new LineShape(this).activate();
        break;
      case 'rectangle':
        new RectangleShape(this).activate();
        break;
      case 'circle':
        new CircleShape(this).activate();
        break;
      case 'eraser':
        new EraserTool(this).activate();
        break;
      case 'move':
        new MoveTool(this).activate();
        break;
    }
  }

  resetCanvas() {
    this.fabricCanvas.off('mouse:down');
    this.fabricCanvas.off('mouse:move');
    this.fabricCanvas.off('mouse:up');
    this.fabricCanvas.getObjects().forEach(obj => {
      obj.selectable = false;
      obj.evented = true;
    });
  }

  createToolBoxContainer(canvasId) {
    return this.toolbarManager.createToolBoxContainer(canvasId);
  }

  setupDrawingContext(parentDiv, canvasId) {
    this.createDrawingTools(parentDiv, canvasId);
    this.setTool('pen');
  }
}