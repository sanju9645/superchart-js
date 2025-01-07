import { AnalyticsStyles } from './style/AnalyticsStyles.js';
import { createAnalyticsToolContainer } from './components/AnalyticsToolContainer.js';
import { AnalyticsModal } from './components/AnalyticsModal.js';
import { DataAnalyzer } from './services/DataAnalyzer.js';

export class Analytics {
  constructor() {
    AnalyticsStyles();
  }

  createAnalyticsToolContainer(canvasId) {
    return createAnalyticsToolContainer(canvasId);
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