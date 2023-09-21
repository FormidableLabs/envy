#! /usr/bin/env node

const http = require('http');
const path = require('path');

const chalk = require('chalk');
const handler = require('serve-handler');
const argv = require('yargs-parser')(process.argv.slice(2));

const port = argv.viewerPort || 9998;

const root = path.resolve(__dirname, '..', 'dist');

const server = http.createServer((request, response) => {
  return handler(request, response, {
    public: root,
  });
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(chalk.cyan(`🚀 Envy web viewer started on http://localhost:${port}`));
});
