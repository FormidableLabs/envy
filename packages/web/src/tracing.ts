import { DEFAULT_WEB_SOCKET_PORT, Event } from '@envy/core';

import { fetchRequestToEvent, fetchResponseToEvent } from './http';
import log from './log';
import { nanoid } from './nanoid';
import { Options } from './options';

export interface TracingOptions extends Options {
  port?: number;
}

const initialTraces: Record<string, Event> = {};

export async function enableTracing(options: TracingOptions): Promise<void> {
  if (typeof window === 'undefined') {
    log.error('Attempted to use @envy/web in a non-browser environment');
    return Promise.resolve();
  }

  return new Promise(resolve => {
    if (options.debug) log.info('Starting in debug mode');

    const port = options.port ?? DEFAULT_WEB_SOCKET_PORT;
    const serviceName = options.serviceName;

    const wsUri = `ws://127.0.0.1:${port}/web/${serviceName}`;
    const ws = new WebSocket(wsUri);

    const { fetch: originalFetch } = window;
    window.fetch = async (...args) => {
      const tsReq = Date.now();
      const id = nanoid();

      const reqEvent = fetchRequestToEvent(tsReq, id, ...args);
      if (ws.readyState === ws.OPEN) {
        ws.send(
          JSON.stringify({
            ...reqEvent,
            serviceName,
          }),
        );
      } else {
        initialTraces[id] = reqEvent;
      }

      const response = await originalFetch(...args);
      const tsRes = Date.now();
      const responseClone = response.clone();
      const resEvent = await fetchResponseToEvent(tsRes, reqEvent, responseClone);

      if (ws.readyState === ws.OPEN) {
        ws.send(
          JSON.stringify({
            ...resEvent,
            serviceName,
          }),
        );
      } else {
        initialTraces[id] = resEvent;
      }

      return response;
    };

    ws.onopen = () => {
      if (options.debug) log.info(`Connected to ${wsUri}`);

      // flush any request traces captured prior to the socket being open
      for (const trace of Object.entries(initialTraces)) {
        ws.send(
          JSON.stringify({
            ...trace,
            serviceName,
          }),
        );
      }

      resolve();
    };
  });
}
