const styleRules = `
  .chart-parent-div {
    position: relative !important;
  }

  .drawing-toolbar {
    position: absolute;
    top: -14.5%;
    right: 10px;
    left: 50px;
    background: white;
    background-color: white;
    padding: 5px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    width: fit-content;
    margin: 5px;
    z-index: 101;
    display: none;
  }

  .canvas-container {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    pointer-events: auto !important;
  }

  .drawing-tool.active {
    background-color: #e0e0e0;
  }

  .tool-box-icon {
    border: none !important;
    height: 30px;
    width: 30px;
    box-shadow: none;
    background-color: #fff;
    border-radius: 4px;
  }

  .tool-box-container-div.active {
    border-radius: 10px;
  }

  .drawing-toolbar {
    display: none;
    position: absolute;
    left: 0px !important;
    top: 0;
    background: #fff;
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    flex-direction: column;
    gap: 10px;
  }

  .toolbar-section {
    display: flex;
    gap: 5px;
    padding: 5px;
    border-bottom: 1px solid #eee;
  }

  .toolbar-section:last-child {
    border-bottom: none;
  }

  .drawing-tool, .action-button {
    width: 35px;
    height: 35px;
    border: none;
    background: transparent;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .drawing-tool:hover, .action-button:hover {
    background: #f0f0f0;
  }

  .drawing-tool.active {
    background: #e3f2fd;
    color: #1976d2;
  }

  .color-picker-container, .width-picker-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  #colorPicker {
    width: 30px;
    height: 30px;
    padding: 0;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  #widthPicker {
    width: 100px;
    cursor: pointer;
  }

  .color-picker-label, .width-picker-label {
    margin-left: 5px;
    color: #666;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .drawing-toolbar {
      left: 45px;
      padding: 5px;
    }

    .drawing-tool,
    .action-button {
      width: 30px;
      height: 30px;
    }

    #widthPicker {
      width: 80px;
    }
  }

  .toolbox-wrapper {
    position: relative;
    z-index: 10;
    display: flex;    /* Add display flex */
    align-items: center;
    width: 40px;      /* Set explicit width */
    height: 40px;     /* Set explicit height */
  }

  .drawing-toolbar {
    position: absolute;
    top: -14.5%;
    right: 10px;
    left: 50px;
    background: white;
    padding: 5px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    width: fit-content;
    margin: 5px;
    z-index: 101;
    display: none;
    position: relative;  /* Add this to establish positioning context */
  }
`;

const addStyleSheet = () => {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(styleRules));
  document.head.appendChild(style);
}

const DoodleChartStyles = () => {
  addStyleSheet();

  const observer = new MutationObserver(() => {
    addStyleSheet();
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

export { DoodleChartStyles };
