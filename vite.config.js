import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, 'test'),
  server: {
    open: true
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
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
