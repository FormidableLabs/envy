#! /usr/bin/env node

const { Parcel } = require('@parcel/core');
const chalk = require('chalk');
const argv = require('yargs-parser')(process.argv.slice(2));
const port = argv.viewerPort || 9998;

let bundler = new Parcel({
  defaultConfig: '@parcel/config-default',
  entries: 'src/index.html',
  serveOptions: {
    port,
  },
  hmrOptions: {
    port: 9997,
  },
});

bundler.watch().then(() => {
  // eslint-disable-next-line no-console
  console.log(chalk.cyan(`🚀 Envy web viewer started (dev mode) on http://localhost:${port}`));
});
