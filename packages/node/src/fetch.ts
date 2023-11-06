import {
  Plugin,
  getEventFromAbortedFetchRequest,
  getEventFromFetchRequest,
  getEventFromFetchResponse,
} from '@envyjs/core';

import { generateId } from './id';

export const Fetch: Plugin = (_options, exporter) => {
  const { fetch: originalFetch } = global;
  global.fetch = async (...args) => {
    const id = generateId();
    const startTs = performance.now();
    let response: Response | undefined = undefined;

    // export the initial request data
    const reqEvent = getEventFromFetchRequest(id, ...args);
    exporter.send(reqEvent);

    // if the args contain a signal, listen for abort events
    const signal = args[1]?.signal;
    if (signal) {
      signal.addEventListener('abort', () => {
        // if the request has already been resolved, we don't need to do anything
        if (response) return;

        // export the aborted request data
        const duration = performance.now() - startTs;
        const abortEvent = getEventFromAbortedFetchRequest(reqEvent, duration);
        exporter.send(abortEvent);
      });
    }

    // execute the actual request
    response = await originalFetch(...args);
    const responseClone = response.clone();
    const resEvent = await getEventFromFetchResponse(reqEvent, responseClone);

    resEvent.http!.duration = performance.now() - startTs;

    // export the final request data which now includes response
    exporter.send(resEvent);

    return response;
  };
};
