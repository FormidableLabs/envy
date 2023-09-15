import { DEFAULT_WEB_SOCKET_PORT } from '@envy/core';

import { fetchRequestToEvent, fetchResponseToEvent } from './http';
import log from './log';
import { Options } from './options';

export interface TracingOptions extends Options {
  port?: number;
}

export function enableTracing(options: TracingOptions) {
  if (typeof window === 'undefined') {
    log.error('Attempted to use @envy/web in a non-browser environment');
    return;
  }

  if (options.debug) log.info('Starting in debug mode');

  const wsUri = `ws://127.0.0.1:${options.port ?? DEFAULT_WEB_SOCKET_PORT}/web/${options.serviceName}`;
  const ws = new WebSocket(wsUri);
  ws.onopen = () => {
    if (options.debug) log.info(`Connected to ${wsUri}`);

    const { fetch: originalFetch } = window;

    window.fetch = async (...args) => {
      // TODO: better unique id
      const tsReq = Date.now();
      const id = `${tsReq}`;

      const reqEvent = fetchRequestToEvent(tsReq, id, ...args);
      ws.send(JSON.stringify(reqEvent));

      const response = await originalFetch(...args);
      const tsRes = Date.now();
      const responseClone = response.clone();
      const resEvent = await fetchResponseToEvent(tsRes, reqEvent, responseClone);
      ws.send(JSON.stringify(resEvent));

      return response;
    };
  };
}
