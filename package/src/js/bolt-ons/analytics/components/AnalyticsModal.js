export class AnalyticsModal {
  static show(canvasId, loadContentCallback, chartParams) {
    // Close existing modals
    const existingModals = document.querySelectorAll('.analytics-modal-overlay');
    existingModals.forEach(modal => modal.remove());

    const isDarkTheme = chartParams?.analyticsModel?.theme === 'black';

    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    
    const modalContainer = document.createElement('div');
    modalContainer.className = `analytics-modal-overlay ${isDarkTheme ? 'dark-theme' : 'light-theme'}`;
    modalContainer.id = `analytics-modal-${canvasId}`;

    const modalContent = document.createElement('div');
    modalContent.className = 'analytics-modal-content';

    const closeButton = document.createElement('button');
    closeButton.className = 'analytics-modal-close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = () => modalContainer.remove();

    // Add cleanup to the close handlers
    const closeModal = () => {
      modalContainer.remove();
      document.body.style.overflow = ''; // Restore scrolling when modal closes
    };

    closeButton.onclick = closeModal;
    
    modalContainer.addEventListener('click', (e) => {
      if (e.target === modalContainer) {
        closeModal();
      }
    });

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'analytics-content-wrapper';
    
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = '<div class="analytics-loading">Loading analysis...</div>';

    contentWrapper.appendChild(contentDiv);
    modalContent.appendChild(closeButton);
    modalContent.appendChild(contentWrapper);
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);

    modalContainer.addEventListener('click', (e) => {
      if (e.target === modalContainer) {
        modalContainer.remove();
      }
    });

    // Execute callback to load content
    loadContentCallback(contentDiv);
  }
}