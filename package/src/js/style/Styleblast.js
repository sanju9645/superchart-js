
const styleRules = `
  .chart-parent-div {
    min-width: 100% !important;
    width: 95%;
    margin-top: 10px;
  }

  .chart-wrapper {
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
    padding: 0;
    display: flex;
    align-items: column;
    flex-direction: column;
    width: 95%;
    max-width: 100% !important;
    margin: 1% !important;
      position: relative;
  }

  .chart-type-wrapper {
    order: -1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    gap: 2%;
    margin-top: 2%;
    position: relative;
    padding: 0 10px;
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

  /* Custom Dropdown Styling */
  .superchart-select-menu {
    font-size:15px;
    width: 200px;
    margin: 140px auto;
  }

  .superchart-select-menu .superchart-select-btn {
    display: flex;
    height: 55px;
    background: #fff;
    padding: 20px;
    font-weight: 400;
    border-radius: 8px;
    align-items: center;
    cursor: pointer;
    justify-content: space-between;
    box-shadow: 0 0 5px rgba(0,0,0,0.1);
  }

  .superchart-select-btn i{
      transition: 0.3s;
  }

  .superchart-select-menu.active .superchart-select-btn i{
      transform: rotate(-180deg);
  }
      
  .superchart-select-menu .superchart-select-menu-options{
      position: relative;
      padding: 20px;
      margin-top: 10px;
      border-radius: 8px;
      box-shadow: 0 0 3px rgba(0,0,0,0.1);
      display: none;
  }

  .superchart-select-menu.active .superchart-select-menu-options{
    display: block;
  }

  .superchart-select-menu-options .superchart-select-menu-option{
    display: flex;
    height: 55px;
    cursor: pointer;
    padding: 0 16px;
    border-radius: 8px;
    align-items: center;
  }

  .superchart-select-menu-options .superchart-select-menu-option:hover {
    background: #F2F2F2;
  }

  .superchart-select-menu-option i{
    margin-right: 12px;
  }

  .chart-tools-container {
    display: flex;
    position: relative;
    flex-direction: row;
    gap: 15px;
    align-items: center;
    height: 40px;
    width: auto;
  }

  /* Right side - Dropdown */
  .chart-type-dropdown-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 20px;
    margin-right: 20px;
    flex: 0 1 auto;
  }

  /* Chart type dropdown specific styles */
  .chart-type-dropdown {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: auto;
  }

  .tool-icon-container-div {
    position: relative;
    z-index: 1000;
    cursor: pointer;
    background: #fff;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    flex: 0 0 auto;
    margin-right: 10px;
    margin-left: 20px;  /* Add space to the left */
  }
`;

const addStyleSheet = () => {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(styleRules));
  document.head.appendChild(style);
}

const Styleblast = () => {
  addStyleSheet();

  const observer = new MutationObserver(() => {
    addStyleSheet();
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

export { Styleblast };
