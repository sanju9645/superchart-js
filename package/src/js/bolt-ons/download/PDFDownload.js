import { createPDFDownloadToolContainer } from './components/PDFDownloadToolContainer.js';
import { DownloadStyles } from './style/DownloadStyles.js';

export class PDFDownload {
  constructor() {
    DownloadStyles();
  }

  createPDFDownloadToolContainer(canvasId) {
    return createPDFDownloadToolContainer(canvasId);
  }

  async showAnalyticsModal(chartParams, canvasId) {
    AnalyticsModal.show(canvasId, async (contentDiv) => {
      try {
        const analytics = await DataAnalyzer.analyzeChartData(chartParams);
        contentDiv.innerHTML = analytics;
      } catch (error) {
        contentDiv.innerHTML = '<div class="analytics-error">Error loading analysis. Please try again.</div>';
        console.error('Analytics error:', error);
      }
    }, chartParams);
  }
}