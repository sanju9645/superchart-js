
class Tidyup {
  constructor() {
    this.id = 'sorting'; // Unique identifier for the plugin
  }

  afterDraw(chart, args, plugin) {
    let containerId = `plotterjs-bolt-ons-sorting-container-${chart.id}`;
    let container = document.getElementById(containerId);

    if (container === null) {
      // Create the container element and append the canvas to it
      container = document.createElement('div');
      container.classList.add('plotterjs-bolt-ons-sorting-container');
      container.id = containerId;
      container.style.position = 'relative';
      container.style.display = 'flex';
      container.style.paddingTop = plugin.container?.padding?.top ?? '10px';
      chart.canvas.parentNode.insertBefore(container, chart.canvas);
      container.appendChild(chart.canvas);

      const chartSortingButtonsWrapper = document.createElement('div');
      chartSortingButtonsWrapper.classList = 'chart-sorting-buttons-wrapper';

      const buttonAsc = document.createElement('button');
      buttonAsc.classList = plugin.asc?.button?.class ?? 'chart-sorting-buttons';
      buttonAsc.innerHTML = plugin.asc?.button?.label ?? "<span style='font-size:20px;'>&#8593;</span>";
      buttonAsc.style.display = plugin.asc?.button?.display ?? true;
      buttonAsc.style.top = (typeof plugin.asc?.button?.topPosition !== 'undefined') ? `${plugin.asc.button.topPosition}px` : '10px';
      buttonAsc.style.right = (typeof plugin.asc?.button?.rightPosition !== 'undefined') ? `${plugin.asc.button.rightPosition}px` : '85px';
      chartSortingButtonsWrapper.appendChild(buttonAsc);

      const buttonDesc = document.createElement('button');
      buttonDesc.classList = plugin.desc?.button?.class ?? 'chart-sorting-buttons';
      buttonDesc.innerHTML = plugin.desc?.button?.label ?? "<span style='font-size:20px;'>&#8595;</span>";
      buttonDesc.style.display = plugin.desc?.button?.display ?? true;
      buttonDesc.style.top = (typeof plugin.desc?.button?.topPosition !== 'undefined') ? `${plugin.desc.button.topPosition}px` : '10px';
      buttonDesc.style.right = (typeof plugin.desc?.button?.rightPosition !== 'undefined') ? `${plugin.desc.button.rightPosition}px` : '45px';
      chartSortingButtonsWrapper.appendChild(buttonDesc);

      const buttonReset = document.createElement('button');
      buttonReset.classList = plugin.reset?.button?.class ?? 'chart-sorting-buttons';
      buttonReset.innerHTML = plugin.reset?.button?.label ?? "<span style='font-size:25px;'>&#8634;</span>";
      buttonReset.style.display = plugin.reset?.button?.display ?? true;
      buttonReset.style.top = (typeof plugin.reset?.button?.topPosition !== 'undefined') ? `${plugin.reset.button.topPosition}px` : '10px';
      buttonReset.style.right = (typeof plugin.reset?.button?.rightPosition !== 'undefined') ? `${plugin.reset.button.rightPosition}px` : '0px';
      chartSortingButtonsWrapper.appendChild(buttonReset);

      container.appendChild(chartSortingButtonsWrapper);

      // Add click event listeners to the buttons
      buttonAsc.addEventListener('click', () => {
        this.#sortChartData(chart, (a, b) => a.data - b.data);
      });

      buttonDesc.addEventListener('click', () => {
        this.#sortChartData(chart, (a, b) => b.data - a.data);
      });

      buttonReset.addEventListener('click', () => {
        this.#resetChartData(chart);
      });

      // Save a copy of the original data for resetting later
      chart.originalData = {
        datasets: chart.data.datasets.map(dataset => ({
          data: [...dataset.data],
          borderColor: [...dataset.borderColor],
          backgroundColor: [...dataset.backgroundColor]
        })),
        labels: [...chart.data.labels]
      };
    }
  }

  #sortChartData(chart, sortFunc) {
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const chartData = dataset.data;
      const chartLabels = chart.data.labels;

      // Combine the data and labels into an array of objects
      const chartDataArray = chartData.map((dataPoint, index) => ({
        data: dataPoint,
        label: chartLabels[index]
      }));

      // Sort the array of objects using the provided sort function
      chartDataArray.sort(sortFunc);

      // Separate the sorted data and labels back into their respective arrays
      dataset.data = chartDataArray.map(dataObj => dataObj.data);
      chart.data.labels = chartDataArray.map(dataObj => dataObj.label);
    });

    chart.update();
    chart.resize();
  }

  #resetChartData(chart) {
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      dataset.data = [...chart.originalData.datasets[datasetIndex].data];
    });
    chart.data.labels = [...chart.originalData.labels];

    chart.update();
    chart.resize();
  }
}

export { Tidyup };
