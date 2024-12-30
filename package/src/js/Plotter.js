import '@fortawesome/fontawesome-free/css/all.css';

import Chart from 'chart.js/auto';
import { Typify } from './bolt-ons/Typify.js';
import { Colors } from './pigments/Colors.js';
import { Tidyup } from './bolt-ons/Tidyup.js';
import { Styleblast } from './style/Styleblast.js';

class Plotter {
  constructor() {
    this.charts = {};
    this.enhancedChartType = new Typify(this);
    Styleblast(); 
  }

  #customBackgroundPlugin(backgroundColor) {
    return {
      id: 'customCanvasBackgroundColor',
      beforeDraw: (chart) => {
        const ctx = chart.canvas.getContext('2d');
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = backgroundColor || '#fff';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
      }
    }
  }

  #createFormattedDatasets(datasetInputs, staticColors) {
    const datasets = [];

    datasetInputs.forEach(function(datasetInput) {
      const randomColorIndex = Math.floor(Math.random() * staticColors.length);
      const chartType = datasetInput?.type?.toLowerCase() || 'line';
      const dataset = {
        type: chartType == 'area' ? 'line' : chartType,
        label: datasetInput.label,
        data: datasetInput.data,
        backgroundColor: datasetInput?.fillColor || staticColors[randomColorIndex].fillColor,
        borderColor: datasetInput?.borderColor || staticColors[randomColorIndex].borderColor,
        borderWidth: 1,
        fill: {
          target: chartType == 'area',
          above: datasetInput?.above_color || staticColors[randomColorIndex].above_color
        }
      }
      datasets.push(dataset);
    });

    return datasets;
  }

  fmtChartCanvasName(title) {
    if (title) {
      const chartCanvasName = title
        .split(' ')
        .map((word, index) => {
          if (index === 0) {
            return word.toLowerCase();
          } else {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          }
        })
        .join('') + 'Canvas';

      return chartCanvasName;
    }
  }

  #createChartDivAndCanvas(chartParams) {
    const canvasId = this.fmtChartCanvasName(chartParams?.chartTitle);
    let canvas = document.getElementById(canvasId);
    const chartParentDiv = document.createElement('div');
    const chartWrapper = document.getElementById('chart-wrapper');

    if (!chartWrapper) {
      alert(`No div with the class 'chart-wrapper' found to display the graph. Please add a <div id='chart-wrapper' class='chart-wrapper'></div> element to the main HTML page where you want to display your chart: ${chartParams?.chartTitle}`);
      return;
    }

    chartParentDiv.id = `chart-parent-div-${canvasId}`;
    chartParentDiv.className = 'chart-parent-div';
    chartParentDiv.setAttribute('data-chart-reference', canvasId);
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = canvasId;
      canvas.className = 'chart-canvas';
      canvas.setAttribute('data-chart-reference', canvasId);
      chartParentDiv.appendChild(canvas);
    }
    chartWrapper.id = `chart-wrapper-${canvasId}`;
    chartWrapper.setAttribute('data-chart-reference', canvasId);
    chartWrapper.appendChild(chartParentDiv);
    this.enhancedChartType.createChartTypeWrapper(chartParams);

    return canvasId;
  }

  #validateChartParams(params) {
    if (!params.chartTitle || typeof params.chartTitle !== 'string') {
      alert('Error: chartTitle is missing or not a valid string.');
      return false;
    }

    if (!Array.isArray(params.xAxisValues)) {
      alert('Error: xAxisValues is not an array.');
      return false;
    }

    if (!Array.isArray(params.legends)) {
      alert('Error: legends is not an array.');
      return false;
    }

    for (const dataset of params.legends) {
      if (!dataset.label || typeof dataset.label !== 'string') {
        alert('Error: label is missing or not a valid string in legends.');
        return false;
      }

      if (!Array.isArray(dataset.data)) {
        alert('Error: data is not an array in legends.');
        return false;
      }
    }

    return true;
  }

  #fmtChartParams(chartParams) {
    const originalTitle = chartParams.chartTitle;
    let canvasId = this.fmtChartCanvasName(originalTitle);
    
    if (Object.hasOwn(this.charts, canvasId)) {
      if (!chartParams.hasOwnProperty('duplicateChartTitleCount')) {
        chartParams.duplicateChartTitleCount = 1;
      }
  
      // Increment until a unique title is found
      do {
        chartParams.duplicateChartTitleCount++;
        chartParams.chartTitle = `${originalTitle}${chartParams.duplicateChartTitleCount}`;
        canvasId = this.fmtChartCanvasName(chartParams.chartTitle);
      } while (Object.hasOwn(this.charts, canvasId));
    }
  
    return chartParams;
  }

  plotChart(chartParams) {
    if (!this.#validateChartParams(chartParams)) {
      return;
    }
    chartParams = this.#fmtChartParams(chartParams);
    
    const bgColors = Colors.bgColors;
    const staticColors = Colors.colors;
    const datasets = this.#createFormattedDatasets(chartParams?.legends, staticColors);
    const bgColorRandomIndex = Math.floor(Math.random() * bgColors.length);
    const backgroundColor = chartParams?.chartBgColor || bgColors[bgColorRandomIndex];
    const labels = chartParams?.xAxisValues || false;
    const axisLablels = chartParams?.axisLabels;

    const config = {
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: chartParams?.chartTitle || '',
            font: {
              size: 22
            }
          }
        },
        scales: {
          x: {
            beginAtZero: chartParams?.xAxisBeginAtZero,
            title: {
              display: true,
              text: axisLablels?.xAxisLabel || ''
            }
          },
          y: {
            beginAtZero: chartParams?.yAxisBeginAtZero,
            title: {
              display: true,
              text: axisLablels?.yAxisLabel || ''
            }
          }
        }
      },
      plugins: [this.#customBackgroundPlugin(backgroundColor)]
    };

    if (chartParams?.legendSorting !== false) {
      // Apply chart sorting functionality only if there is one dataset in the chart
      if (datasets.length === 1) {
        const sortingPlugin = new Tidyup();
        config.plugins.push(sortingPlugin);
      }
    }

    const chartCanvasId = this.#createChartDivAndCanvas(chartParams);
    this.charts[chartCanvasId] = new Chart(document.getElementById(chartCanvasId), config);

    const chartWrapperDiv = document.getElementById(`chart-wrapper-${chartCanvasId}`);
    
    if (chartWrapperDiv) {
      chartWrapperDiv.style.backgroundColor = backgroundColor;
    }
  }
}

export { Plotter };
