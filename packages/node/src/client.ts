import { DEFAULT_WEB_SOCKET_PORT, Options } from '@envyjs/core';
import WebSocket from 'ws';

import log from './log';

export interface WebSocketClientOptions extends Options {
  port?: number;
}

const DEFAULT_RETRY_DELAY = 3 * 1000;
const DEFAULT_RETRY_MAX_ATTEMPTS = 25;

export function WebSocketClient(options: WebSocketClientOptions) {
  let ws: WebSocket;
  let retryDelay = DEFAULT_RETRY_DELAY;
  let retryAttempts = 0;

  const identifier = `node/${options.serviceName}`;
  const socket = `ws://127.0.0.1:${options.port ?? DEFAULT_WEB_SOCKET_PORT}/${identifier}`;

  function connect() {
    ws = new WebSocket(socket);

    ws.on('open', () => {
      log.info('client connected');
      retryDelay = DEFAULT_RETRY_DELAY;
    });

    ws.on('close', () => {
      log.error('client disconnected');

      reconnect();
    });

    ws.on('error', error => {
      if (error.message.includes('ECONNREFUSED')) {
        log.error('websocket server not found', socket);
      } else {
        log.error('websocket', error);
      }
      reconnect();
    });
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
    send: (data: Record<string, any>) => {
      if (options.debug) {
        if (data.url !== socket.replace('ws', 'http')) {
          log.debug('sending', data);
        }
      }

      try {
        ws.send(
          JSON.stringify({
            type: 'trace',
            data,
          }),
          error => {
            if (options.debug) {
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
      } catch (error) {
        if (options.debug) {
          log.debug('websocket error');
        }
      }
    },
  };
}
