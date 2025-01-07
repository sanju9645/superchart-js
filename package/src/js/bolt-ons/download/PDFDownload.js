import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { createPDFDownloadToolContainer } from './components/PDFDownloadToolContainer.js';
import { DownloadStyles } from './style/DownloadStyles.js';
import { DataAnalyzer } from '../analytics/services/DataAnalyzer.js';
import { styleRules } from '../analytics/style/AnalyticsStyles';

export class PDFDownload {
  constructor() {
    DownloadStyles();
  }

  createPDFDownloadToolContainer(canvasId) {
    return createPDFDownloadToolContainer(canvasId);
  }

  async downloadAsPDF(chartParams, chartCanvasId) {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      let yOffset = 0;
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm

      // Handle chart download if enabled
      if (chartParams.enableChartDownload) {
        const chartWrapper = document.getElementById(`chart-parent-div-${chartCanvasId}`);
        const canvas = await html2canvas(chartWrapper, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: chartWrapper.style.backgroundColor || '#ffffff'
        });

        // Calculate chart dimensions
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add chart to PDF
        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          0,
          yOffset,
          imgWidth,
          imgHeight
        );

        yOffset += imgHeight + 10; // Add some padding after the chart
      }

      // Handle analytics download if enabled
      if (chartParams?.enableAnalyticsDownload) {
        // Add new page if chart was added
        if (chartParams.enableChartDownload) {
          pdf.addPage();
          yOffset = 0;
        }

        // Get analytics HTML data
        const analyticsData = await DataAnalyzer.analyzeChartData(chartParams);
        
        // Create a temporary div to hold the analytics HTML
        const analyticsContainer = document.createElement('div');
        analyticsContainer.innerHTML =  analyticsData;
        analyticsContainer.style.width = '800px'; // Set a fixed width for better rendering
        analyticsContainer.style.padding = '80px'; // Set a fixed width for better rendering

        // document.head.appendChild(styleSheet);
        document.body.appendChild(analyticsContainer);

        // Convert analytics HTML to canvas
        const analyticsCanvas = await html2canvas(analyticsContainer, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });

        // Remove the temporary container
        document.body.removeChild(analyticsContainer);

        // Calculate analytics dimensions
        const analyticsWidth = pageWidth;
        const analyticsHeight = (analyticsCanvas.height * analyticsWidth) / analyticsCanvas.width;

        // Add analytics to PDF
        pdf.addImage(
          analyticsCanvas.toDataURL('image/png'),
          'PNG',
          0,
          yOffset,
          analyticsWidth,
          analyticsHeight
        );
      }

      // Save the PDF
      const filename = chartParams.chartTitle || 'chart-analysis';
      pdf.save(`${filename}.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  }
}