
const styleRules = `
  .chart-parent-div {
    min-width: 90% !important;
  }
  .chart-wrapper {
    display: flex;
    align-items: flex-start;
    max-width: 95% !important;
  }
  .chart-type-label {
    margin-right: 1% !important;
  }
  .chart-canvas {
    border-radius: 0.4rem !important;
    margin: 1%;
  }
  .chart-type-dropdown {
    margin-bottom: 15% !important;
    font-family: sans-serif;
    font-size: small;
  }
  .chart-sorting-buttons {
    top: 10px;
    right: 0px;
    background-color: #545454;
    border: none;
    color: #e6e6e6;
    padding: 5px 10px;
    border-radius: 5px;
    font-weight: 600;
    opacity: .4;
    cursor: pointer;
    height : 40px;
    width : 40px;
  }
  .chart-sorting-buttons:hover {
    opacity: 1;
  }
  .chart-sorting-buttons-wrapper {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    position: absolute;
    gap: 0.5rem;
    margin: 45px 15px;
    right: 0;
  }
  .chart-type {
    padding: 5px 5px;
    border: solid 1px gray;
    border-radius: 5px;
    cursor: pointer;
  }
`;

function addStyleSheet() {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(styleRules));
  document.head.appendChild(style);
}

function Styleblast() {
  addStyleSheet();

  const observer = new MutationObserver(() => {
    addStyleSheet();
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

export { Styleblast };
