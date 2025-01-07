import * as d3 from 'd3';

import { InsightGenerator } from '../utils/InsightGenerator.js';
import { PatternRecognition } from './PatternRecognition.js';
import { PredictiveAnalysis } from './PredictiveAnalysis.js';

export class DataAnalyzer {
  static async analyzeChartData(chartData) {
    const analytics = [];
    
    for (const [index, series] of chartData.legends.entries()) {
      const values = series.data;
      const dates = chartData.xAxisValues;
      
      const stats = this.#calculateBasicStats(values);
      const trend = this.#analyzeTrend(values);
      const predictions = await PredictiveAnalysis.predictFutureValues(values);
      const patterns = PatternRecognition.recognizePatterns(values);
      
      analytics.push(this.#generateAnalyticsHTML(index+1, series, stats, trend, dates, predictions, patterns, values));
    }

    return analytics.join('');
  }

  static #calculateBasicStats(values) {
    const sortedValues = [...values].sort(d3.ascending);
    return {
      mean: d3.mean(values),
      median: d3.median(values),
      max: d3.max(values),
      min: d3.min(values),
      stdDev: d3.deviation(values),
      q1: d3.quantile(sortedValues, 0.25),
      q3: d3.quantile(sortedValues, 0.75),
      iqr: d3.quantile(sortedValues, 0.75) - d3.quantile(sortedValues, 0.25)
    };
  }

  static #analyzeTrend(values) {
    const growthRate = ((values[values.length - 1] - values[0]) / values[0] * 100).toFixed(2);
    const recentValues = values.slice(-3);
    const recentTrend = ((recentValues[2] - recentValues[0]) / recentValues[0] * 100).toFixed(2);
    
    return {
      overall: values[values.length - 1] - values[0],
      growthRate: growthRate,
      recentTrend: recentTrend,
      direction: values[values.length - 1] > values[0] ? 'Upward' : 'Downward'
    };
  }

  static #generateAnalyticsHTML(index, series, stats, trend, dates, predictions, patterns, values) {
    const lastDate = new Date(dates[dates.length - 1]);
    const futureDates = Array.from({length: 3}, (_, i) => {
      const date = new Date(lastDate);
      date.setMonth(date.getMonth() + i + 1);
      return date.toISOString().slice(0, 10);
    });

    return `
      <h3>${index}. ${series.label} Comprehensive Analysis:</h3>
      <div class="analysis-section">
        <h5>Basic Statistics</h5>
        <ul>
          <li>Mean: ${stats.mean.toFixed(2)}</li>
          <li>Median: ${stats.median.toFixed(2)}</li>
          <li>Standard Deviation: ${stats.stdDev.toFixed(2)}</li>
          <li>Highest Value: ${stats.max} (${dates[values.indexOf(stats.max)]})</li>
          <li>Lowest Value: ${stats.min} (${dates[values.indexOf(stats.min)]})</li>
          <li>Q1 (25th percentile): ${stats.q1.toFixed(2)}</li>
          <li>Q3 (75th percentile): ${stats.q3.toFixed(2)}</li>
          <li>Interquartile Range: ${stats.iqr.toFixed(2)}</li>
        </ul>
      </div>

      <div class="analysis-section">
        <h5>Trend Analysis</h5>
        <ul>
          <li>Overall Trend: ${trend.direction}</li>
          <li>Growth Rate: ${trend.growthRate}%</li>
          <li>Recent Trend: ${trend.recentTrend}%</li>
        </ul>
      </div>

      <div class="analysis-section">
        <h5>Predictive Analysis</h5>
        <ul>
          ${predictions.map((pred, i) => `
            <li>Predicted value for ${futureDates[i]}: ${pred}</li>
          `).join('')}
        </ul>
      </div>

      <div class="analysis-section">
        <h5>Pattern Recognition</h5>
        <ul>
          ${patterns.map(pattern => `
            <li>${pattern}</li>
          `).join('')}
        </ul>
      </div>

      <div class="analysis-section">
        <h5>Summary Insights</h5>
        <ul>
          <li>${InsightGenerator.generateInsight(stats.mean, stats.stdDev, trend.growthRate)}</li>
          <li>${InsightGenerator.generateTrendInsight(values, dates)}</li>
        </ul>
      </div>

      <br>
    `;
  }
}