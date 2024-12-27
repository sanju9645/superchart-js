import { Chart } from 'chart.js';

export class Plotter {
  constructor(data, options) {
    this.data = data;
    this.options = options;
  }

  render(canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: this.data,
      options: this.options,
    });
  }
}
