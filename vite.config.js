import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, 'docs'),
  server: {
    open: true
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true, // Add this line to clean the dist directory
    lib: {
      entry: path.resolve(__dirname, 'package/src/js/Plotter.js'),
      name: 'SuperChartJS',
      fileName: (format) => `graph.${format}.js`,
      formats: ['es', 'cjs', 'umd']
    },
    rollupOptions: {
      external: [
        'chart.js',
        'd3',
        'tf',
        'html2canvas',
        'jspdf',
        'fabric',
        'selectbox-js'
      ],
      output: {
        globals: {
          'chart.js': 'Chart',
          'd3': 'd3',
          'tf': 'tf',
          'html2canvas': 'html2canvas',
          'jspdf': 'jspdf',
          'fabric': 'fabric',
          'selectbox-js': 'SelectboxJS'
        }
      }
    }
  }
});
