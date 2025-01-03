import { SelectboxJS } from 'selectbox-js';

class Typify {
  constructor(enhancedChart) {
    this.chartObjects = {};
    this.enhancedChart = enhancedChart;
    this.chartTypesSkelton = [
      { id: 'line', text: 'Line', type: 'line', icon: 'bx bx-line-chart' },
      { id: 'area', text: 'Area', type: 'area', icon: 'bx bxs-chart' },
      { id: 'bar', text: 'Bar', type: 'bar', icon: 'bx bxs-bar-chart-alt-2' },
      { id: 'pie', text: 'Pie', type: 'pie', icon: 'bx bxs-pie-chart-alt-2' },
      { id: 'bubble', text: 'Bubble', type: 'bubble', icon: 'bx bx-scatter-chart bx-rotate-90' },
      { id: 'doughnut', text: 'Doughnut', type: 'doughnut', icon: 'bx bxs-doughnut-chart' },
      { id: 'scatter', text: 'Scatter', type: 'scatter', icon: 'bx bx-scatter-chart' },
    ];
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

  #handleChartTypeChange(chartReference, datasetLabel, chartType) {
    return () => {
      const myChart = this.enhancedChart.charts[chartReference];

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

  #createChartTypeDropdown (chartTitle, datasetInput) {
    const chartReference = this.enhancedChart.fmtChartCanvasName(chartTitle);
    const dataSetReference = this.enhancedChart.fmtChartCanvasName(datasetInput.label);
    const dropdownContainer = document.createElement('div');
    dropdownContainer.id = `chart-type-${chartReference}-${dataSetReference}`;
    dropdownContainer.name = 'chart-type';
    dropdownContainer.className = 'chart-type';
    dropdownContainer.setAttribute('data-dataset-reference', datasetInput.label);
    const div = this.#createChartTypeDropdownWrapper(datasetInput, dropdownContainer);
    const key = `${chartReference}${dataSetReference}`;

    this.chartObjects[key] = this.chartTypesSkelton.map(chartType => ({
      ...chartType,
      onClick: this.#handleChartTypeChange(chartReference, datasetInput.label, chartType.type)
    }));

    return div;
  }

  configureChartTypeWrapper (chartParams) {
    const chartReference = this.enhancedChart.fmtChartCanvasName(chartParams?.chartTitle);

    chartParams.legends.forEach((datasetInput) => {
      const dataSetReference = this.enhancedChart.fmtChartCanvasName(datasetInput.label);

      const options = {
        iconPackCDN: 'https://unpkg.com/boxicons@2.1.1/css/boxicons.min.css',
        customFontLibraryURL : 'https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600&display=swap',
        fontFamily: "'Poppins', sans-serif",
        dropdownMinWidth: '150px',
        dropdownMaxWidth: '400px',
        dropdownOptionBackground: '#fff',
        dropdownOptionHoverBackground: '#F2F2F2',
        selectedOptionBgColor: '#F2F2F2',
        dropdownFontSize: '15px',
        customCSSStyles: `
          .selectbox-js-select-menu .selectbox-js-select-btn { height: 45px !important; }
          .selectbox-js-select-menu-options .selectbox-js-select-menu-option { height: 45px !important; }
        `,

      };
      const identifier = `chart-type-${chartReference}-${dataSetReference}`;
      const key = `${chartReference}${dataSetReference}`;
      if (this.chartObjects[key]) {
        const defaultChartType = this.chartObjects[key].find(chart => chart.type === datasetInput.type);

        const selectbox = new SelectboxJS();
        selectbox.render(identifier, defaultChartType, this.chartObjects[key], options);
      }
    });
  }


  createChartTypeWrapper (chartParams) {
    const canvasId     = this.enhancedChart.fmtChartCanvasName(chartParams?.chartTitle);
    const chartWrapper = document.getElementById(`chart-wrapper-${canvasId}`);

    if (chartWrapper) {
      if (chartParams?.toggleChartTypeSwitch) {
        const chartTypeWrapper = document.createElement('div');
        chartTypeWrapper.className = 'chart-type-wrapper';

        const chatTypeDropdwonContainer = document.createElement('div');
        chatTypeDropdwonContainer.className = 'chat-type-dropdwon-container';

        chartParams.legends.forEach((datasetInput) => {
          const chatTypeDropdwonWrapper = this.#createChartTypeDropdown(chartParams?.chartTitle, datasetInput);
          chatTypeDropdwonContainer.appendChild(chatTypeDropdwonWrapper);
        });
        chartTypeWrapper.appendChild(chatTypeDropdwonContainer);


        const toolBoxContainer = document.createElement('div');
        toolBoxContainer.className = 'tool-box-container-div';
        toolBoxContainer.id = `tool-box-container-div-${canvasId}`;

        const toolBoxIcon = document.createElement('i');
        toolBoxIcon.className = 'fa-solid fa-screwdriver-wrench';
        toolBoxContainer.appendChild(toolBoxIcon);
        chartTypeWrapper.appendChild(toolBoxContainer);

        chartWrapper.appendChild(chartTypeWrapper);
      }
    }
    return chartWrapper;
  }
}

export { Typify };
