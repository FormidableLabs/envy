import { WebSocketClient } from './client';
import { Http } from './http';
import log from './log';
import { Middleware } from './middleware';
import { Options } from './options';

export interface TracingOptions extends Options {
  middleware?: Middleware[];
  port?: number;
}

export function enableTracing(options: TracingOptions) {
  if (options.debug) {
    log.info('debug mode');
  }

  const client = WebSocketClient(options);

  const middleware = [Http, ...(options.middleware || [])];
  for (const fn of middleware) {
    fn({
      ...options,
      client,
    });
  }
}
