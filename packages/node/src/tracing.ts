import { Exporter, Graphql, Meta, Middleware, Options, Plugin, Sanity } from '@envyjs/core';

import { WebSocketClient } from './client';
import { Fetch } from './fetch';
import { Http } from './http';
import log from './log';

export interface TracingOptions extends Options {
  plugins?: Plugin[];
  port?: number;
}

export function enableTracing(options: TracingOptions) {
  if (options.debug) {
    log.info('debug mode');
  }

  // custom websocket client
  const wsClient = WebSocketClient(options);

  // middleware transforms event data
  const middleware: Middleware[] = [Meta, Sanity, Graphql];

  // apply the middleware and send with the websocket
  const exporter: Exporter = {
    send(message) {
      const result = middleware.reduce((prev, t) => t(prev, options), message);
      if (result) {
        if (result.http && options.filter && options.filter(result.http) === false) {
          return;
        }
        wsClient.send(result);
      }
    },
  };

  // initialize all plugins
  [Http, Fetch, ...(options.plugins || [])].forEach(fn => fn(options, exporter));
}
