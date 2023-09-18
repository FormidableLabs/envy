const { DEFAULT_WEB_SOCKET_PORT } = require('@envy/core');
const chalk = require('chalk');
const { WebSocketServer, WebSocket } = require('ws');

// TODO: allow configuration
const port = DEFAULT_WEB_SOCKET_PORT;
let viewer = null;

const wss = new WebSocketServer({
  port,
  host: '127.0.0.1',
});

wss.on('listening', () => {
  // eslint-disable-next-line no-console
  log(chalk.magenta(`🚀 Envy WS Server started on ws://localhost:${port}`));
  log(chalk.cyan(`🚀 Envy browser client started on http://localhost:9998`));
});

wss.on('connection', (ws, request) => {
  const identifier = request.url.startsWith('/') ? request.url.substring(1) : request.url;
  const idxFirstSlash = identifier.indexOf('/');
  const [namespace, serviceName] =
    idxFirstSlash === -1 ? [identifier, ''] : [identifier.slice(0, idxFirstSlash), identifier.slice(idxFirstSlash + 1)];

  if (namespace === 'viewer') {
    viewer = ws;
  }

  const serviceNameDetail = !!serviceName ? `: ${chalk.yellow(serviceName)}` : '';
  log(chalk.green(`✅ Envy ${chalk.cyan(namespace)} connected${serviceNameDetail}`));

  ws.on('message', data => {
    if (!viewer || viewer.readyState !== WebSocket.OPEN) {
      handleError('No viewers connected');
      return;
    }

    try {
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
