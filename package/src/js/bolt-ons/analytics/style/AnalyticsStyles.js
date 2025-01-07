const styleRules = `
  .analytics-wrapper {
    position: relative;
    z-index: 10;
    display: flex;    /* Add display flex */
    align-items: center;
    width: 40px;      /* Set explicit width */
    height: 40px;     /* Set explicit height */
  }

  .analytics-tool-container-div {
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

  .analytics-modal-overlay {
    position: fixed;
    top: 1rem;
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    font-family: 'Poppins', sans-serif;
    padding: 20px;
    border-radius: 8px;
  }

  .analytics-modal-content {
    background: transparent;
    padding: 40px 20px 20px; 
    border-radius: 8px;
    max-width: 800px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
  }

  .analytics-modal-overlay.light-theme {
    background-color: rgba(255, 255, 255, 0.95);
    color: #333;
  }

  .analytics-modal-overlay.dark-theme {
    background-color: rgba(32, 33, 36, 0.95);
    color: #e8eaed;
  }

  .analytics-modal-close {
    position: fixed;
    right: calc(50% - 380px);
    top: 40px;
    right: 40px;
    border: none;
    background: transparent;
    font-size: 24px;
    cursor: pointer;
    padding: 5px;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    z-index: 1001;
    line-height: 1;
  }

  .light-theme .analytics-modal-close {
    color: #333;
  }

  .dark-theme .analytics-modal-close {
    color: #e8eaed;
  }

  .light-theme .analytics-modal-close:hover {
    background: #f0f0f0;
  }

  .dark-theme .analytics-modal-close:hover {
    background: #3c4043;
  }

  .analytics-content-wrapper {
    padding: 20px;
    height: 100%;
    overflow-y: auto;
    margin-top: 20px;
  }

  .analysis-section {
    margin-bottom: 20px;
  }

  .light-theme .analysis-section {
    border-bottom: 1px solid #e0e0e0;
  }

  .dark-theme .analysis-section {
    border-bottom: 1px solid #3c4043;
  }

  .analytics-body {
    margin-top: 20px;
  }

  .analytics-loading {
    text-align: center;
    padding: 2rem;
  }

  .analytics-error {
    color: #ff0000;
    text-align: center;
    padding: 2rem;
  }

  .dark-theme .analytics-error {
    color: #ff6b6b;
  }

  .analysis-section h5 {
    margin: 10px 0;
    font-size: 16px;
  }

  .analysis-section ul {
    list-style-type: none;
    padding-left: 0;
    margin: 10px 0;
  }

  .analysis-section li {
    margin: 8px 0;
    line-height: 1.5;
  }

  .analytics-loading {
    text-align: center;
    padding: 20px;
  }
`;

const addStyleSheet = () => {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(styleRules));
  document.head.appendChild(style);
}

const AnalyticsStyles = () => {
  addStyleSheet();

  const observer = new MutationObserver(() => {
    addStyleSheet();
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

export { AnalyticsStyles };
