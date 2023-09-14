import { WebSocketClient } from './client';
import { Http } from './http';
import log from './log';
import { Middleware } from './middleware';
import { Sanity } from './middleware/sanity';
import { Options } from './options';
import { Exporter, Plugin } from './plugin';

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
  const middleware: Middleware[] = [Sanity];

  // apply the middleware and send with the websocket
  const exporter: Exporter = {
    send(message) {
      const result = middleware.reduce((prev, t) => t(prev), message);
      wsClient.send(result);
    },
  };

  // initialize all plugins
  [Http, ...(options.plugins || [])].forEach(fn => fn(options, exporter));
}
