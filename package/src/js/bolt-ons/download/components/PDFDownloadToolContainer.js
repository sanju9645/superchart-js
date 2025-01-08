export function createPDFDownloadToolContainer(canvasId) {
  const toolBoxContainer = document.createElement('div');
  toolBoxContainer.className = 'pdf-download-tool-container-div tool-icon-container-div';
  toolBoxContainer.id = `pdf-download-tool-container-div-${canvasId}`;

  const toolBoxIcon = document.createElement('i');
  toolBoxIcon.className = 'fa-solid fa-file-export';
  toolBoxContainer.appendChild(toolBoxIcon);

  return toolBoxContainer;
}