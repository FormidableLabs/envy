#! /usr/bin/env node

const argv = require('yargs-parser')(process.argv.slice(2));
const devMode = argv.dev ?? false;

// arguments prefixed with --no- are treated as negations
const collector = argv.collector ?? true;
const ui = argv.ui ?? true;

if (collector === true) {
  require('./startCollector.cjs');
}

if (ui === true) {
  require(devMode ? './startViewerDev.cjs' : './startViewer.cjs');
}
