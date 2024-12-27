Step 1: Setting Up the Project

1.1 Initialize the Project
1. Open a terminal in the folder where you want to create your project.
2. Run the following commands:

mkdir superchartjs
cd superchartjs
npm init -y


1.2 Install Dependencies
npm install vite chart.js --save
npm install -D rollup-plugin-dts


1.3 Project Structure

superchartjs/
├── demo/          # For testing your library
│   └── index.html     # Example usage
├── package/           # Source code for the library
│   ├── src/
│   │   └── js/
│   │       └── Plotter.js
├── dist/              # Build output (auto-generated)
├── vite.config.js     # Vite configuration
├── package.json       # NPM metadata
└── README.md          # Documentation

1.4 Add .gitignore file