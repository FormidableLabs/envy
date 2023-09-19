import { DEFAULT_WEB_SOCKET_PORT, Exporter, Meta, Middleware, Plugin, Sanity } from '@envy/core';

import { WebSocketClient } from './client';
import { Http } from './http';
import log from './log';
import { Options } from './options';

export interface TracingOptions extends Options {
  plugins?: Plugin[];
  port?: number;
}

export async function enableTracing(options: TracingOptions): Promise<void> {
  if (typeof window === 'undefined') {
    log.error('Attempted to use @envy/web in a non-browser environment');
    return Promise.resolve();
  }

  return new Promise(resolve => {
    if (options.debug) log.info('Starting in debug mode');

    const port = options.port ?? DEFAULT_WEB_SOCKET_PORT;
    const serviceName = options.serviceName;

    // custom websocket client
    const ws = WebSocketClient({ port, serviceName });

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
    [Http, ...(options.plugins || [])].forEach(fn => fn(options, exporter));

    resolve();
  });
}
