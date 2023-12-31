import {
  Plugin,
  getEventFromAbortedFetchRequest,
  getEventFromFetchRequest,
  getEventFromFetchResponse,
} from '@envyjs/core';

import { generateId } from './id';
import { calculateTiming } from './performance';

export const Fetch: Plugin = (_options, exporter) => {
  const { fetch: originalFetch } = window;
  window.fetch = async (...args) => {
    const id = generateId();
    const startTs = performance.now();
    let response: Response | undefined = undefined;

    // export the initial request data
    const reqEvent = getEventFromFetchRequest(id, ...args);
    exporter.send(reqEvent);

    performance.mark(reqEvent.id, { detail: { type: 'start' } });

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

    performance.mark(reqEvent.id, { detail: { type: 'end' } });

    // the peformance API does not have a request identifier that
    // allows us to associate it with a specific request, so we
    // use performance marks to capture the window of the request
    const marks = performance.getEntriesByName(reqEvent.id);
    const startMark = marks.find(x => (x as PerformanceMark).detail.type === 'start');
    const endMark = marks.find(x => (x as PerformanceMark).detail.type === 'end');

    // find the timings that occured between the two marks
    let time: PerformanceResourceTiming | undefined;
    if (startMark && endMark) {
      time = performance
        .getEntriesByName(reqEvent.http!.url)
        .find(x => x.startTime >= startMark!.startTime && x.startTime <= endMark!.startTime) as
        | PerformanceResourceTiming
        | undefined;
    }

    // calculate the timing, or use a fallback if not available
    const { duration, timings } = calculateTiming(time);
    if (duration) {
      resEvent.http!.duration = duration;
      resEvent.http!.timings = timings;
    } else {
      const fallbackDuration = performance.now() - startTs;
      resEvent.http!.timingsBlockedByCors = true;
      resEvent.http!.duration = fallbackDuration;
    }

    // export the final request data which now includes response
    exporter.send(resEvent);

    return response;
  };
};
