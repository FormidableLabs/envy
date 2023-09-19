#! /usr/bin/env node

const path = require('path');

const chalk = require('chalk');
const servor = require('servor');
const argv = require('yargs-parser')(process.argv.slice(2));

const port = argv.viewerPort || 9998;

const root = path.resolve(__dirname, '../dist');
servor({
  root,
  fallback: 'index.html',
  port: port,
}).then(() => {
  // eslint-disable-next-line no-console
  console.log(chalk.cyan(`🚀 Envy web viewer started on http://localhost:${port}`));
});
