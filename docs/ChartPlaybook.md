## Step 1: Setting Up the Project

1.1 Initialize the Project
1. Open a terminal in the folder where you want to create your project.
2. Run the following commands:
```
mkdir superchart-js
cd superchart-js
npm init -y
```

1.2 Install Dependencies
```
npm install vite chart.js --save
npm install -D rollup-plugin-dts
```

1.3 Project Structure
```
superchart-js/
├── docs/              # For testing your library
│   └── index.html     # Example usage
├── package/           # Source code for the library
│   ├── src/
│   │   └── js/
│   │       └── Plotter.js
├── dist/              # Build output (auto-generated)
├── vite.config.js     # Vite configuration
├── package.json       # NPM metadata
└── README.md          # Documentation
```

1.4 Add .gitignore file
```
node_modules
dist
test
```

## Step 2: Configure Vite
```
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
      fileName: (format) => `superchart-js.${format}.js`,
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
```
## Step 3: Add Source Code
Create the file package/src/js/Graph.js and add the example code

## Step 4: Add Example for Testing
4.1 Create test/index.html
This file will serve as a playground to test your library:

## Step 5: Build the Package
5.1 Add Scripts to package.json

```
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "serve": "vite preview",
  "prepare": "npm run build"
}
```

5.2 Build the Package
Run the following command:
```
npm run build
```

## Step 6: Test Locally
6.1 Run Dev Server
To test the example code, use Vite's development server:
```
npm run dev
```

## Step 7: Prepare for Publishing
7.1 Update package.json
Ensure package.json has the following fields:
```
{
  "main": "dist/superchart-js.cjs.js",
  "module": "dist/superchart-js.es.js",
  "files": [
    "dist",
    "README.md"
  ],
  "peerDependencies": {
    "chart.js": "^4.4.3"
  },
}
```

files: Specifies which files to include in the package.
peerDependencies: Defines chart.js as a peer dependency.


## Step 8: Publish the Package
8.1 Log In to NPM:
```
npm login

npm whoami
```

8.2 Bump Version
Bump the version before publishing:
```
npm version patch
```


8.3 Publish
```
npm publish --access public
```

## Step 9: Verify the Published Package
Install the package in a new project and test:
```
npm install superchart-js
```

## Complete Workflow
Code in package/src/js.
Build with npm run build.
Test with npm run dev.
