export class InsightGenerator {
  static generateInsight(mean, stdDev, growthRate, volatility) {
    let insight = `The data shows an average of ${mean.toFixed(2)} with `;
    insight += stdDev < mean * 0.1 ? "low variability" : 
               stdDev < mean * 0.25 ? "moderate variability" : "high variability";
    insight += `. Growth rate is ${growthRate}% with ${
      volatility < 10 ? "low" : 
      volatility < 25 ? "moderate" : "high"
    } volatility.`;

    return insight;
  }

  static generateTrendInsight(values, dates) {
    const recentTrend = values.slice(-3);
    const isIncreasing = recentTrend[2] > recentTrend[0];
    const magnitude = Math.abs(((recentTrend[2] - recentTrend[0]) / recentTrend[0]) * 100);
    
    return `Recent trend (last 3 periods) shows a ${
      isIncreasing ? "positive" : "negative"
    } movement of ${magnitude.toFixed(1)}%`;
  }
}