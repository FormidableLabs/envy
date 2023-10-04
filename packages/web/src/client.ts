import { DEFAULT_WEB_SOCKET_PORT, Event, Options } from '@envyjs/core';

import log from './log';

export interface WebSocketClientOptions extends Options {
  port?: number;
}

const DEFAULT_RETRY_DELAY = 3 * 1000;
const DEFAULT_RETRY_MAX_ATTEMPTS = 25;
const initialTraces: Record<string, Event> = {};

export function WebSocketClient(options: WebSocketClientOptions) {
  let ws: WebSocket;
  let retryDelay = DEFAULT_RETRY_DELAY;
  let retryAttempts = 0;
  let pinger: NodeJS.Timeout | undefined = undefined;

  const identifier = `web/${options.serviceName}`;
  const socket = `ws://127.0.0.1:${options.port ?? DEFAULT_WEB_SOCKET_PORT}/${identifier}`;

  function ping(ws: WebSocket) {
    ws.send(
      JSON.stringify({
        type: 'ping',
        data: identifier,
      }),
    );
  }

  function connect() {
    ws = new WebSocket(socket);

    ws.onopen = () => {
      log.info('client connected');
      retryDelay = DEFAULT_RETRY_DELAY;

      // ping immediately and every 5 seconds to assert connection
      ping(ws);
      pinger = setInterval(() => ping(ws), 5_000);

      for (const data of Object.values(initialTraces)) {
        ws.send(
          JSON.stringify({
            type: 'trace',
            data,
          }),
        );
      }
    };

    ws.onclose = () => {
      log.error('client disconnected');

      // stop pinging; allow connection to expire
      if (pinger) {
        clearInterval(pinger);
      }

      reconnect();
    };

    ws.onerror = error => {
      log.error('websocket', error);
      reconnect();
    };
  }

  function reconnect() {
    if (ws && ws.readyState === ws.CLOSED) {
      if (retryAttempts === DEFAULT_RETRY_MAX_ATTEMPTS) {
        log.error('max connection attempts reached, please restart');
        return;
      }

      log.warn(`client reconnecting in... ${(retryDelay / 1000).toFixed(2)}s`);
      setTimeout(connect, retryDelay);

      // slow exponential backoff with random jitter
      retryDelay += Math.random() * 1000 + Math.pow(1.25, retryAttempts++) * 1000;
    }
  }

  // get this party started
  connect();

  return {
    send: (data: Event) => {
      if (options.debug) {
        log.debug('sending', data);
      }

      try {
        if (ws.readyState === ws.OPEN) {
          ws.send(
            JSON.stringify({
              type: 'trace',
              data,
            }),
          );
        } else {
          initialTraces[data.id] = data;
        }
      } catch (error) {
        if (options.debug) {
          log.debug('websocket error');
        }
      }
    },
  };
}
