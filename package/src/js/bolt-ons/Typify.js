class Typify {
  constructor(enhancedChart) {
    this.enhancedChart = enhancedChart;
    this.types = ['Line', 'Area', 'Bar', 'Pie', 'Doughnut'];

  }

  #createChartTypeLabel (labelText) {
    const label = document.createElement('label');
    label.className = 'chart-type-label';
    const fullLabel = labelText;
    const truncatedLabel = fullLabel.length > 50 ? fullLabel.substring(0, 50) + '...' : fullLabel;
    label.innerHTML = truncatedLabel;

    label.addEventListener('mouseover', function() {
      label.innerHTML = fullLabel;
    });

    label.addEventListener('mouseout', function() {
      label.innerHTML = truncatedLabel;
    });
    label.style.cursor = 'pointer';
    label.style.fontWeight = 'bold';

    return label;
  }

  #handleChartTypeChange (chartReference, datasetLabel) {
    return () => {
      const chartType = document.getElementById(`chart-type-${chartReference}-${this.enhancedChart.fmtChartCanvasName(datasetLabel)}`).value;
      const myChart   = this.enhancedChart.charts[chartReference];

      if (myChart) {
        const datasetToUpdate = myChart.data.datasets.find(dataset => {
          return dataset.label == datasetLabel;
        });

        if (datasetToUpdate) {
          if (chartType.toLowerCase() === 'area') {
            datasetToUpdate.type = 'line';
            datasetToUpdate.fill = {
              target: true,
            };
          } else if (chartType.toLowerCase() === 'line') {
            datasetToUpdate.type = 'line';
            datasetToUpdate.fill = {
              target: false,
            };
          } else {
            datasetToUpdate.type = chartType.toLowerCase();
          }
          myChart.update();
        }
      }
    };
  }

  #createChartTypeDropdownWrapper (datasetInput, select) {
    const div = document.createElement('div');
    div.className = 'chart-type-dropdown';
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.alignItems = 'flex-start'; 

    const selectWrapper = document.createElement('div');
    selectWrapper.className = 'chart-type-dropdown';
    selectWrapper.style.display = 'flex'; 
    selectWrapper.style.alignItems = 'center';
    selectWrapper.style.gap = '2%'; 
    selectWrapper.style.marginTop = '2%'; 

    const chartLabel = document.createElement('label');
    chartLabel.innerHTML = 'Type ';
    selectWrapper.appendChild(chartLabel);
    selectWrapper.appendChild(select);

    const label = this.#createChartTypeLabel(datasetInput.label);
    div.appendChild(label);
    div.appendChild(selectWrapper);

    return div;
  }

  #createChartTypeDropdown (chartTitle, datasetInput) {
    const chartReference = this.enhancedChart.fmtChartCanvasName(chartTitle);
    const dataSetReference = this.enhancedChart.fmtChartCanvasName(datasetInput.label);
    const select = document.createElement('select');

    select.id = `chart-type-${chartReference}-${dataSetReference}`;
    select.name = 'chart-type';
    select.className = 'chart-type';
    select.setAttribute('data-dataset-reference', datasetInput.label);
    select.onchange = this.#handleChartTypeChange(chartReference, datasetInput.label);

    this.types.forEach((type) => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = type;

      if (type.toLowerCase() === (datasetInput?.type?.toLowerCase() || 'line')) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    const div = this.#createChartTypeDropdownWrapper(datasetInput, select);

    return div;
  }

  createChartTypeWrapper (chartParams) {
    const canvasId     = this.enhancedChart.fmtChartCanvasName(chartParams?.chartTitle);
    const chartWrapper = document.getElementById(`chart-wrapper-${canvasId}`);

    if (chartWrapper) {
      if (chartParams?.toggleChartTypeSwitch) {
        const chartTypeWrapper = document.createElement('div');
        chartTypeWrapper.className = 'chart-type-wrapper';
        chartTypeWrapper.style.marginTop = "2%";

        chartParams.legends.forEach((datasetInput) => {
          const chatTypeDropdwon = this.#createChartTypeDropdown(chartParams?.chartTitle, datasetInput);
          chartTypeWrapper.appendChild(chatTypeDropdwon);
        });
        chartWrapper.appendChild(chartTypeWrapper);
      }
    }
    return chartWrapper;
  }
}

export { Typify };
