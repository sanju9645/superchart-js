# superchart-js
Supercharge your charts with ChartJS Enhanced!

## 🌟 npm package
Checkout the npm package of **SuperChartJS**:  
👉 [Open](https://www.npmjs.com/package/superchart-js)


<p align="center">
  <img src="https://img.shields.io/npm/v/superchart-js" alt="npm version">
  <img src="https://img.shields.io/npm/dm/superchart-js" alt="downloads">
  <img src="https://img.shields.io/github/license/yourusername/superchart-js" alt="license">
</p>


This package is an enhanced version of the [Chart.js](https://github.com/chartjs/Chart.js) library. 
The original Chart.js is distributed under the MIT License, and this package builds on the original Chart.js by adding additional functionality through plugins and extra scripts. 
No changes have been made to the original Chart.js source code.


## Acknowledgments

Original library: [Chart.js](https://github.com/chartjs/Chart.js)

superchart-js is a robust extension of the popular ChartJS library, designed to offer advanced charting capabilities with greater flexibility and customization options. 
This library builds upon the foundation of ChartJS, adding new features such as dynamic data sorting, enhanced styling, and additional chart types, enabling developers to create more interactive and visually appealing data visualizations. 


## 📦 Installation

Choose your preferred installation method:

```bash
# Using npm
npm install superchart-js

# Using yarn
yarn add superchart-js

# Using pnpm
pnpm add superchart-js
```


## 🚀 Quick Start

### 📥 Import Options

1. **CDN (JSDelivr)**
```javascript
import { Plotter } from 'https://cdn.jsdelivr.net/npm/superchart-js/dist/superchart-js.es.js';
```

2. **ES Module**
```javascript
import { Plotter } from 'superchart-js';
```

3. **CommonJS**
```javascript
const { Plotter } = require('superchart-js');
```

4. **Specific Path**
```javascript
import { Plotter } from './node_modules/superchart-js/dist/superchart-js.es.js';
```


### 🏗️ Basic Setup

1. **Add HTML Structure**
```html
<!-- Single Chart -->
  <div id="chart-wrapper" class="chart-wrapper"> </div>
```

2. **Initialize SuperChartJS**
```javascript
import { Plotter } from 'superchart-js';
```

## 💡 Usage Examples
```javascript
const chartData = {
  chartTitle: "Monthly Sales Revenue",
  xAxisValues: [
    "2024-01-01",
    "2024-02-01",
    "2024-03-01",
    "2024-04-01",
    "2024-05-01",
    "2024-06-01",
    "2024-07-01",
    "2024-08-01",
    "2024-09-01",
    "2024-10-01",
    "2024-11-01",
    "2024-12-01"
  ],
  axisLabels: {
    xAxisLabel: "Month",
    yAxisLabel: "Revenue (USD)"
  },
  legends: [
    {
      label: "Product A Sales",
      data: [500, 700, 800, 1200, 1500, 1400, 600, 550, 900, 1000, 1100],
      type: "area",
    },
  ],
  toggleChartTypeSwitch: true,
  legendSorting: true,
  drawToolBox: false,
  enableChartDownload: true,
  showAnalytics: true,
  analyticsModel: {
    theme: 'black'
  },
};

const graph = new Plotter();
graph.plotChart(chartData);
```

## 📊 Chart Configuration

### 🏷️ chartTitle (mandatory)
The title of the chart.

### 📅 xAxisValues (mandatory)
An array of values to be displayed on the x-axis.

### 🏷️ axisLabels (optional)
Names for the axis labels.

- 🏷️ **xAxisLabel**: Name for the x-axis.
- 🏷️ **yAxisLabel**: Name for the y-axis.


### 📜 legends (mandatory)
An array of legends. Each legend should have the following properties:

- 🏷️ **label** (mandatory): The legend name.
- 📊 **data** (mandatory): An array of values.
- 🔄 **type** (optional): Possible types are 'Line', 'Area', 'Bar', 'Radar', 'Pie', and 'Doughnut'. Default is 'Line'.

- 🎨 **borderColor** (optional): Custom border color.
- 🎨 **fillColor** (optional): Custom fill color.
- 🎨 **aboveColor** (optional): Custom above color.


## 🔌 Plugins

### 🔄 legendSorting
Used to turn on/off the sorting plugin.

- Default value is true. If the chart contains only one legend, the sorting option will be visible on the chart.
- Set it to false to turn it off.

### 🔄 toggleChartTypeSwitch
Used to enable the legend type-changing feature.

- Default value is false. Set it to true to enable it.

### 🔄 xAxisBeginAtZero
  Type: bool
  Sets the beginning value of the x-axis to zero. 
  This property only works if the x-axis contains numerical values. 
  Default Value: true

### 🔄 yAxisBeginAtZero
  Type: bool 
  Sets the beginning value of the y-axis to zero. 
  Default Value: true

### 🔄 enableChartDownload
  Type: bool 
  By enabling this plugin, you can download the chart as a PDF
  Default Value: false

### 🔄 showAnalytics
  Type: bool 
  By enabling this plugin, you can see the analytics of the chart
  Default Value: false    

### 🔄 analyticsModel
  Type: object 
  By configuring this plugin, you can customize the analytics of the chart
  Default Value: analyticsModel: { theme: 'light' }
  So far we can customize the theme of the analytics, we will add more features in the future.


## Example
```html
<body>
  <div id="chart-wrapper" class="chart-wrapper">

  </div>
  <div id="chart-wrapper" class="chart-wrapper">

  </div>
  <div id="chart-wrapper" class="chart-wrapper">

  </div>
</body>

<script type="module">
  // import { Plotter } from '../package/src/js/Plotter.js';
  import { Plotter } from '../dist/superchart-js.es.js';
  // import { Plotter } from '../node_modules/superchart-js/dist/superchart-js.es.js';
  // import { Plotter } from 'superchart-js';

  document.addEventListener('DOMContentLoaded', async () => {
    const chartData = {
      chartTitle: "Monthly Sales Revenue",
      xAxisValues: [
        "2024-01-01",
        "2024-02-01",
        "2024-03-01",
        "2024-04-01",
        "2024-05-01",
        "2024-06-01",
        "2024-07-01",
        "2024-08-01",
        "2024-09-01",
        "2024-10-01",
        "2024-11-01",
        "2024-12-01"
      ],
      axisLabels: {
        xAxisLabel: "Month",
        yAxisLabel: "Revenue (USD)"
      },
      legends: [
        {
          label: "Product A Sales",
          data: [500, 700, 800, 1200, 1500, 1400, 600, 550, 900, 1000, 1100],
          type: "area",
        },
      ],
      toggleChartTypeSwitch: true,
      legendSorting: true,
      drawToolBox: false,
      enableChartDownload: true,
      showAnalytics: true,
      analyticsModel: {
        theme: 'black'
      },
    };

    const graph = new Plotter();
    graph.plotChart(chartData);
  });
</script>
```

## 🌟 Demo

Check out the live demo of **SuperChartJS**:  
👉 [Open](https://sanju9645.github.io/superchart-js)

Or you can clone the repository and run the `docs/index.html` file to see the demo.
```bash
git clone https://github.com/sanju9645/superchart-js.git
cd superchart-js
npm i
open docs/index.html
```
Make the changes on the index.html

```bash
npm run dev
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have any questions or need help, please [open an issue](https://github.com/sanju9645/superchart-js/issues).
