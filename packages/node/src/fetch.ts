import { Plugin, fetchRequestToEvent, fetchResponseToEvent } from '@envyjs/core';

import { generateId } from './id';

export const Fetch: Plugin = (_options, exporter) => {
  const { fetch: originalFetch } = global;
  global.fetch = async (...args) => {
    const id = generateId();
    const startTs = performance.now();

    // export the initial request data
    const reqEvent = fetchRequestToEvent(id, ...args);
    exporter.send(reqEvent);

    // execute the actual request
    const response = await originalFetch(...args);
    const responseClone = response.clone();
    const resEvent = await fetchResponseToEvent(reqEvent, responseClone);

    resEvent.http!.duration = performance.now() - startTs;

    // export the final request data which now includes response
    exporter.send(resEvent);

    return response;
  };
};
