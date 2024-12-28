class Typify {
  constructor(enhancedChart) {
    this.enhancedChart = enhancedChart;
    // this.types = ['Line', 'Area', 'Bar', 'Radar', 'Pie', 'Doughnut'];
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

    // const chartLabel = document.createElement('label');
    // chartLabel.innerHTML = 'Type ';
    // selectWrapper.appendChild(chartLabel);
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

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svg.setAttribute("viewBox", "0 0 512 512");
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

      const iconElement = document.createElement('i');
      switch (type.toLowerCase()) {
        case 'line':
          path.setAttribute("d", "M32 32c17.7 0 32 14.3 32 32l0 336c0 8.8 7.2 16 16 16l400 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L80 480c-44.2 0-80-35.8-80-80L0 64C0 46.3 14.3 32 32 32zM160 224c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32zm128-64l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160c0-17.7 14.3-32 32-32s32 14.3 32 32zm64 32c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-96c0-17.7 14.3-32 32-32zM480 96l0 224c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-224c0-17.7 14.3-32 32-32s32 14.3 32 32z");

          break;
        case 'area':
          path.setAttribute("d", "M32 32c17.7 0 32 14.3 32 32l0 336c0 8.8 7.2 16 16 16l400 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L80 480c-44.2 0-80-35.8-80-80L0 64C0 46.3 14.3 32 32 32zM160 224c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32zm128-64l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160c0-17.7 14.3-32 32-32s32 14.3 32 32zm64 32c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-96c0-17.7 14.3-32 32-32zM480 96l0 224c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-224c0-17.7 14.3-32 32-32s32 14.3 32 32z");

          break;
        case 'bar':
          path.setAttribute("d", "M32 32c17.7 0 32 14.3 32 32l0 336c0 8.8 7.2 16 16 16l400 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L80 480c-44.2 0-80-35.8-80-80L0 64C0 46.3 14.3 32 32 32zM160 224c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32zm128-64l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160c0-17.7 14.3-32 32-32s32 14.3 32 32zm64 32c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-96c0-17.7 14.3-32 32-32zM480 96l0 224c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-224c0-17.7 14.3-32 32-32s32 14.3 32 32z");

          break;
        case 'pie':
          path.setAttribute("d", "M32 32c17.7 0 32 14.3 32 32l0 336c0 8.8 7.2 16 16 16l400 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L80 480c-44.2 0-80-35.8-80-80L0 64C0 46.3 14.3 32 32 32zM160 224c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32zm128-64l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160c0-17.7 14.3-32 32-32s32 14.3 32 32zm64 32c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-96c0-17.7 14.3-32 32-32zM480 96l0 224c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-224c0-17.7 14.3-32 32-32s32 14.3 32 32z");

          break;
        case 'doughnut':
          path.setAttribute("d", "M32 32c17.7 0 32 14.3 32 32l0 336c0 8.8 7.2 16 16 16l400 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L80 480c-44.2 0-80-35.8-80-80L0 64C0 46.3 14.3 32 32 32zM160 224c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32zm128-64l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160c0-17.7 14.3-32 32-32s32 14.3 32 32zm64 32c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-96c0-17.7 14.3-32 32-32zM480 96l0 224c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-224c0-17.7 14.3-32 32-32s32 14.3 32 32z");

          break;
      }
      svg.appendChild(path);

      option.appendChild(svg);


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
