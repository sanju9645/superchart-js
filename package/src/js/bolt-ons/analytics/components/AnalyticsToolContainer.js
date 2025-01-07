export function createAnalyticsToolContainer(canvasId) {
  const toolBoxContainer = document.createElement('div');
  toolBoxContainer.className = 'analytics-tool-container-div tool-icon-container-div';
  toolBoxContainer.id = `analytics-tool-container-div-${canvasId}`;

  const toolBoxIcon = document.createElement('i');
  toolBoxIcon.className = 'fa-solid fa-magnifying-glass-chart';
  toolBoxContainer.appendChild(toolBoxIcon);

  return toolBoxContainer;
}