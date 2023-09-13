const { DEFAULT_WEB_SOCKET_PORT } = require('@envy/core');
const { WebSocketServer, WebSocket } = require('ws');

// TODO: allow configuration
const port = DEFAULT_WEB_SOCKET_PORT;
let viewer = null;

const wss = new WebSocketServer({
  port,
  host: '127.0.0.1',
});

wss.on('connection', (ws, request) => {
  if (request.headers?.['sec-websocket-protocol'] === 'viewer') {
    viewer = ws;
  }

  ws.on('message', data => {
    if (!viewer || viewer.readyState !== WebSocket.OPEN) return;

    try {
      const json = JSON.parse(data);
      if (!json.traceId) {
        handleError(`Invalid message: ${data}`);
        return;
      }

      viewer.send(data.toString());
    } catch (e) {
      handleError(`Unable to parse message: ${e}`);
    }
  });

  ws.on('error', e => {
    handleError(e);
  });
});

function handleError(e) {
  // TODO: better error handling

  // eslint-disable-next-line no-console
  console.error(e);
}
