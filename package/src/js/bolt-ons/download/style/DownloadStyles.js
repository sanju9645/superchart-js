const styleRules = `
  .pdf-download-wrapper {
    position: relative;
    z-index: 10;
    display: flex;    /* Add display flex */
    align-items: center;
    width: 40px;      /* Set explicit width */
    height: 40px;     /* Set explicit height */
  }
`;

const addStyleSheet = () => {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(styleRules));
  document.head.appendChild(style);
}

const DownloadStyles = () => {
  addStyleSheet();

  const observer = new MutationObserver(() => {
    addStyleSheet();
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

export { DownloadStyles };
