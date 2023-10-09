import { Exporter, Graphql, Meta, Middleware, Options, Plugin, Sanity, WebSocketClient } from '@envyjs/core';

import { Fetch } from './fetch';
import log from './log';

export interface TracingOptions extends Options {
  plugins?: Plugin[];
  port?: number;
}

export function enableTracing(options: TracingOptions): void {
  if (typeof window === 'undefined') {
    log.error('Attempted to use @envyjs/web in a non-browser environment');
  }

  if (options.debug) log.info('Starting in debug mode');

  // custom websocket client
  const ws = WebSocketClient({
    ...options,
    clientName: 'web',
    log,
  });

  // middleware transforms event data
  const middleware: Middleware[] = [Meta, Sanity, Graphql];

  // apply the middleware and send with the websocket
  const exporter: Exporter = {
    send(message) {
      const result = middleware.reduce((prev, t) => t(prev, options), message);
      if (result.http && options.filter && options.filter(result.http) === false) {
        return;
      }
      ws.send(result);
    },
  };

  // initialize all plugins
  [Fetch, ...(options.plugins || [])].forEach(fn => fn(options, exporter));
}
