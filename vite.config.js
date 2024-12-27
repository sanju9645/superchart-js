import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'demo',
  server: {
    open: true
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'package/src/js/Plotter.js'),
      name: 'Plotter',
      fileName: (format) => `graph.${format}.js`,
      formats: ['es', 'cjs', 'umd']
    },
    rollupOptions: {
      external: ['chart.js'],
      output: {
        globals: {
          'chart.js': 'Chart',
        }
      }
    }
  }
});
