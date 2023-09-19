#! /usr/bin/env node

const argv = require('yargs-parser')(process.argv.slice(2));
const devMode = argv.dev ?? false;

require('./startCollector.cjs');

global.collectorStarted = () => {
  require(devMode ? './startViewerDev.cjs' : './startViewer.cjs');
};
