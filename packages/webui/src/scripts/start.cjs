#! /usr/bin/env node

const argv = require('yargs-parser')(process.argv.slice(2));
const devMode = argv.dev ?? false;
const noUi = argv.noUi ?? argv.noui ?? false;

require('./startCollector.cjs');

global.collectorStarted = () => {
  if (noUi === false) {
    require(devMode ? './startViewerDev.cjs' : './startViewer.cjs');
  }
};
