import * as d3 from 'd3';

export class PatternRecognition {
  static recognizePatterns(values) {
    const patterns = [];
    
    // Detect trends
    const recentValues = values.slice(-5);
    const consistentIncrease = recentValues.every((v, i) => i === 0 || v > recentValues[i - 1]);
    const consistentDecrease = recentValues.every((v, i) => i === 0 || v < recentValues[i - 1]);
    
    // Detect cycles
    const differences = values.slice(1).map((v, i) => v - values[i]);
    const signChanges = differences.slice(1).map((d, i) => 
      Math.sign(d) !== Math.sign(differences[i])
    ).filter(Boolean).length;
    
    // Add detected patterns
    if (consistentIncrease) {
      patterns.push("Consistent upward trend detected in recent data");
    } else if (consistentDecrease) {
      patterns.push("Consistent downward trend detected in recent data");
    }
    
    if (signChanges > values.length / 3) {
      patterns.push("Cyclical pattern detected");
    }
    
    // Detect outliers using z-score
    const mean = d3.mean(values);
    const stdDev = d3.deviation(values);
    const outliers = values.map((v, i) => ({
      value: v,
      index: i,
      zScore: Math.abs((v - mean) / stdDev)
    })).filter(item => item.zScore > 2);
    
    if (outliers.length > 0) {
      patterns.push(`${outliers.length} significant outlier(s) detected`);
    }

    return patterns;
  }
}