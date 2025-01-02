
const styleRules = `
.chart-parent-div {
  position: relative !important;
}

.drawing-toolbar {
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  padding: 5px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  z-index: 1000;
  width: fit-content;
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

.drawing-toolbar {
  background-color: white;
  padding: 5px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  margin: 5px;
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
