import { DEFAULT_WEB_SOCKET_PORT, Exporter, Meta, Middleware, Plugin, Sanity } from '@envyjs/core';

import { WebSocketClient } from './client';
import { Fetch } from './fetch';
import log from './log';
import { Options } from './options';

export interface TracingOptions extends Options {
  plugins?: Plugin[];
  port?: number;
}

export async function enableTracing(options: TracingOptions): Promise<void> {
  if (typeof window === 'undefined') {
    log.error('Attempted to use @envyjs/web in a non-browser environment');
    return Promise.resolve();
  }

  return new Promise(resolve => {
    if (options.debug) log.info('Starting in debug mode');

    const port = options.port ?? DEFAULT_WEB_SOCKET_PORT;

    // custom websocket client
    const ws = WebSocketClient({ ...options, port });

    // middleware transforms event data
    const middleware: Middleware[] = [Meta, Sanity];

    // apply the middleware and send with the websocket
    const exporter: Exporter = {
      send(message) {
        const result = middleware.reduce((prev, t) => t(prev, options), message);
        ws.send(result);
      },
    };

    // initialize all plugins
    [Fetch, ...(options.plugins || [])].forEach(fn => fn(options, exporter));

    resolve();
  });
}
