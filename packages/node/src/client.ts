import WebSocket from 'ws';

export interface WebSocketClientOptions {
  debug?: boolean;
  port?: number;
}

// global ftw
let ws: WebSocket;

export function WebSocketClient(options: WebSocketClientOptions) {
  if (!ws) {
    const socket = `ws://127.0.0.1:${options.port ?? 9999}`;
    // TODO: connection stats in console log
    // TODO: automatic reconnection
    ws = new WebSocket(socket);
    // eslint-disable-next-line no-console
    ws.on('error', error => console.error('@envy/node websocket', { error, socket }));
  }

  return {
    send: (data: Record<string, any>) => {
      if (options.debug) {
        // eslint-disable-next-line no-console
        console.dir(data, { depth: 3 });
      }

      try {
        ws.send(JSON.stringify(data), error => {
          if (options.debug) {
            // eslint-disable-next-line no-console
            if (error) console.error('@envy/node:ws:send', { error });
          }
        });
      } catch (error) {
        if (options.debug) {
          // eslint-disable-next-line no-console
          console.error('@envy/node:ws', 'socket closed. ignoring.');
        }
      }
    },
  };
}
