export class History {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
  }

  pushState(state) {
    this.undoStack.push(state);
    this.redoStack = []; // Clear redo stack when new action is performed
  }

  undo() {
    if (this.undoStack.length > 0) {
      const currentState = this.undoStack.pop();
      this.redoStack.push(currentState);
      return this.undoStack[this.undoStack.length - 1];
    }
    return null;
  }

  redo() {
    if (this.redoStack.length > 0) {
      const state = this.redoStack.pop();
      this.undoStack.push(state);
      return state;
    }
    return null;
  }

  canUndo() {
    return this.undoStack.length > 1; // Keep at least one state
  }

  canRedo() {
    return this.redoStack.length > 0;
  }
}