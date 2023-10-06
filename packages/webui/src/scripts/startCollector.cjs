#! /usr/bin/env node

const { DEFAULT_WEB_SOCKET_PORT } = require('@envyjs/core');
const chalk = require('chalk');
const { WebSocketServer, WebSocket } = require('ws');
const argv = require('yargs-parser')(process.argv.slice(2));

const port = argv.port || DEFAULT_WEB_SOCKET_PORT;
const VIEWER_NAME = 'viewer';

let viewer = null;

const wss = new WebSocketServer({
  port,
  host: '127.0.0.1',
});

// map of seen service names and their connection status (true or false)
const knownServices = new Map();

function notifyViewerOfConnections() {
  if (!viewer) return;

  const data = [...knownServices.entries()];
  viewer.send(
    JSON.stringify({
      type: 'connections',
      data,
    }),
  );
}

function registerConnetion(serviceName, client) {
  knownServices.set(serviceName, client);
  notifyViewerOfConnections();
}

const interval = setInterval(() => {
  wss.clients.forEach(client => {
    if (client.serviceName === VIEWER_NAME) return;
    if (client.isAlive) {
      // assume not connected until we get a response to the ping
      client.isAlive = false;
      client.ping();
    } else {
      // if the client is not alive since the last check, mark it as disconnected
      client.terminate();
    }
  });

  const connectedClients = [...wss.clients].map(x => x.serviceName).filter(x => x !== VIEWER_NAME);
  for (const [serviceName] of knownServices) {
    knownServices.set(serviceName, connectedClients.includes(serviceName));
  }

  notifyViewerOfConnections();
}, 5_000);

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

  if (namespace === VIEWER_NAME) {
    ws.serviceName = VIEWER_NAME;
    viewer = ws;

    log(chalk.green(`✅ Envy ${chalk.cyan(namespace)} connected${serviceNameDetail}`));
  } else {
    ws.isAlive = true;
    ws.serviceName = serviceName;
    registerConnetion(serviceName, true);

    log(chalk.green(`✅ Envy ${chalk.cyan(`${namespace} sender`)} connected${serviceNameDetail}`));
  }

  ws.on('pong', () => {
    ws.isAlive = true;
  });

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

wss.on('close', () => {
  clearInterval(interval);
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
