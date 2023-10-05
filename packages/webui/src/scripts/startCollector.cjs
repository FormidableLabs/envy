#! /usr/bin/env node

const { DEFAULT_WEB_SOCKET_PORT } = require('@envyjs/core');
const chalk = require('chalk');
const { WebSocketServer, WebSocket } = require('ws');
const argv = require('yargs-parser')(process.argv.slice(2));

const port = argv.port || DEFAULT_WEB_SOCKET_PORT;
let viewer = null;

const wss = new WebSocketServer({
  port,
  host: '127.0.0.1',
});

wss.on('listening', () => {
  log(chalk.magenta(`🚀 Envy collector started on ws://127.0.0.1:${port}`));
  if (typeof global?.collectorStarted === 'function') {
    global.collectorStarted();
  }
});

wss.on('connection', (ws, request) => {
  const identifier = request.url.startsWith('/') ? request.url.substring(1) : request.url;
  const idxFirstSlash = identifier.indexOf('/');
  const [namespace, serviceName] =
    idxFirstSlash === -1 ? [identifier, ''] : [identifier.slice(0, idxFirstSlash), identifier.slice(idxFirstSlash + 1)];

  const serviceNameDetail = !!serviceName ? `: ${chalk.yellow(serviceName)}` : '';

  if (namespace === 'viewer') {
    log(chalk.green(`✅ Envy ${chalk.cyan(namespace)} connected${serviceNameDetail}`));
    viewer = ws;
  } else {
    log(chalk.green(`✅ Envy ${chalk.cyan(`${namespace} sender`)} connected${serviceNameDetail}`));
  }

  ws.on('message', data => {
    if (!viewer || viewer.readyState !== WebSocket.OPEN) {
      handleError('No viewers connected');
      return;
    }

    try {
      // the collector just relays incoming messages to the viewer; if one is available
      viewer.send(data.toString());
    } catch (e) {
      handleError(`Unable to parse message: ${e}`);
    }
  });

  ws.on('error', e => {
    handleError(e);
  });
});

function log(message) {
  // eslint-disable-next-line no-console
  console.log(message);
}

function handleError(e) {
  // TODO: better error handling

  // eslint-disable-next-line no-console
  console.error(e);
}
