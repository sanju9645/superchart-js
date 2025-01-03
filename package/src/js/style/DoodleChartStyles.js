
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

.tool-box-container-div {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  height: 20px;
  width: 20px;
  margin-left: 10px;
}

.tool-box-icon {
  border: 1px solid #795548;
  height: 30px;
  width: 30px;
  box-shadow: none;
  background-color: #fff;
  border-radius: 4px;
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
