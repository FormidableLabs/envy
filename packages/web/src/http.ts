import { Event, HttpRequest, Plugin } from '@envyjs/core';

import { generateId } from './id';
import { calculateTiming } from './performance';

export const Http: Plugin = (_options, exporter) => {
  const { fetch: originalFetch } = window;
  window.fetch = async (...args) => {
    const startTs = performance.now();

    // export the initial request data
    const reqEvent = fetchRequestToEvent(...args);
    exporter.send(reqEvent);

    performance.mark(reqEvent.id, { detail: { type: 'start' } });

    // execute the actual request
    const response = await originalFetch(...args);
    const responseClone = response.clone();
    const resEvent = await fetchResponseToEvent(reqEvent, responseClone);

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

    // calculate a fallback if we don't have timing data available
    const fallbackDuration = performance.now() - startTs;
    const { duration, timings } = calculateTiming(time);
    resEvent.http!.duration = duration || fallbackDuration;
    resEvent.http!.timings = timings;

    // export the final request data which now includes response
    exporter.send(resEvent);

    return response;
  };
};

function formatHeaders(headers: HeadersInit | Headers | undefined): HttpRequest['requestHeaders'] {
  if (headers) {
    if (Array.isArray(headers)) {
      return headers.reduce<HttpRequest['requestHeaders']>((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    } else if (headers instanceof Headers) {
      return Object.fromEntries(headers.entries());
    } else {
      return headers;
    }
  }

  return {};
}

function fetchRequestToEvent(input: RequestInfo | URL, init?: RequestInit): Event {
  let url: URL;
  if (typeof input === 'string') {
    url = new URL(input);
  } else if (input instanceof Request) {
    url = new URL(input.url);
  } else {
    url = input;
  }

  return {
    id: generateId(),
    parentId: undefined,
    timestamp: Date.now(),
    http: {
      method: (init?.method ?? 'GET') as HttpRequest['method'],
      host: url.host,
      port: parseInt(url.port, 10),
      path: url.pathname,
      url: url.toString(),
      requestHeaders: formatHeaders(init?.headers),
      requestBody: init?.body?.toString() ?? undefined,
    },
  };
}

async function fetchResponseToEvent(req: Event, response: Response): Promise<Event> {
  return {
    ...req,

    http: {
      ...req.http!,
      httpVersion: response.type,
      statusCode: response.status,
      statusMessage: response.statusText,
      responseHeaders: formatHeaders(response.headers),
      responseBody: await response.text(),
    },
  };
}
