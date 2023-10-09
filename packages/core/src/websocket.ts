import WebSocket from 'isomorphic-ws';

import { DEFAULT_WEB_SOCKET_PORT } from './consts';
import { Event } from './event';
import { Log } from './log';
import { Options } from './options';
import { Retry } from './time';

export interface WebSocketClientOptions extends Options {
  clientName: string;
  log: Log;
  port?: number;
}

const initialTraces: Record<string, Event> = {};

export function WebSocketClient(options: WebSocketClientOptions) {
  const { clientName, debug, log, port, serviceName } = options;

  const retry = new Retry();

  let ws: WebSocket;

  const identifier = `${clientName}/${serviceName}`;
  const socket = `ws://127.0.0.1:${port ?? DEFAULT_WEB_SOCKET_PORT}/${identifier}`;

  function connect() {
    ws = new WebSocket(socket);

    ws.onopen = function open() {
      log.info(`${serviceName} connected`);
      retry.reset();

      for (const data of Object.values(initialTraces)) {
        ws.send(
          JSON.stringify({
            type: 'trace',
            data,
          }),
        );
      }
    };

    ws.onclose = function close() {
      // only log this on the first disconnect
      if (retry.attempts === 0) {
        log.error(`${serviceName} disconnected`);
      }

      reconnect();
    };

    ws.onerror = function error(error) {
      // only log this on the first error
      if (retry.attempts === 0) {
        if (error.message.includes('ECONNREFUSED')) {
          if (debug) {
            log.error('websocket server not found', socket);
          }
        } else {
          log.error('websocket', error);
        }
      }
      reconnect();
    };
  }

  function reconnect() {
    if (ws && ws.readyState === ws.CLOSED) {
      if (retry.shouldRetry) {
        log.error(`max connection attempts reached, please restart`);
        return;
      }

      setTimeout(connect, retry.getNextDelay());
      if (debug) {
        log.warn(`${serviceName} reconnecting in... ${(retry.delay / 1000).toFixed(2)}s`);
      }
    }
  }

  // get this party started
  connect();

  return {
    send: (data: Event) => {
      if (debug) {
        log.debug('sending', data);
      }

      try {
        if (ws.readyState === ws.OPEN) {
          ws.send(
            JSON.stringify({
              type: 'trace',
              data,
            }),
            error => {
              if (debug) {
                if (ws.readyState === ws.CLOSED || ws.readyState === ws.CLOSING) {
                  log.debug('event not sent, websocket closed');
                } else if (ws.readyState === ws.CONNECTING) {
                  log.debug('event not sent, websocket still connecting');
                } else {
                  if (error) log.debug('websocket send', { error });
                }
              }
            },
          );
        } else {
          initialTraces[data.id] = data;
        }
      } catch (error) {
        if (debug) {
          log.debug('websocket error');
        }
      }
    },
  };
}
