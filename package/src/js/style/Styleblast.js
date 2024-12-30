
const styleRules = `
  .chart-parent-div {
    min-width: 100% !important;
    width: 100%;
    margin-top: 10px;
  }

  .chart-wrapper {
    display: flex;
    align-items: column;
    flex-direction: column;
    width: 100%;
    max-width: 100% !important;
    margin: 1% !important;
  }

  .chart-type-wrapper {
    order: -1;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    gap: 2%;
  }

  .chart-type-dropdown {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    margin-right: 1% !important;
    font-family: sans-serif;
    font-size: small;
  }

  .chart-type-label {
    margin-right: 1% !important;
    font-weight: bold;
    cursor: pointer;
    width: max-content;
  }

  .chart-type-dropdown select {
    padding: 5px;
  }

  .chart-canvas {
    border-radius: 1rem;
    margin: 1%;
    max-width: 100%;
    height: auto;
  }

  .chart-type-dropdown {
    margin-right: 1% !important;
  }

  .chart-type {
    border: none !important;
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
    top: 1%;
    right: 1%;
    max-width: 100%;
    justify-content: space-between;
    overflow: hidden;
  }

  .plotterjs-bolt-ons-sorting-container {
    position: relative;
    display: flex;
    padding-top: 10px;
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
