import { Event, HttpRequest, Plugin } from '@envy/core';

import { generateId } from './id';

export const Http: Plugin = (_options, exporter) => {
  const { fetch: originalFetch } = window;
  window.fetch = async (...args) => {
    const tsReq = Date.now();
    const id = generateId();

    const reqEvent = fetchRequestToEvent(tsReq, id, ...args);
    exporter.send(reqEvent);

    const response = await originalFetch(...args);
    const tsRes = Date.now();
    const responseClone = response.clone();
    const resEvent = await fetchResponseToEvent(tsRes, reqEvent, responseClone);

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

function fetchRequestToEvent(timestamp: number, id: string, input: RequestInfo | URL, init?: RequestInit): Event {
  let url: URL;
  if (typeof input === 'string') {
    url = new URL(input);
  } else if (input instanceof Request) {
    url = new URL(input.url);
  } else {
    url = input;
  }

  return {
    id,
    parentId: undefined,
    timestamp,
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

async function fetchResponseToEvent(timestamp: number, req: Event, response: Response): Promise<Event> {
  return {
    ...req,

    http: {
      ...req.http!,
      httpVersion: response.type,
      statusCode: response.status,
      statusMessage: response.statusText,
      responseHeaders: formatHeaders(response.headers),
      responseBody: await response.text(),
      duration: timestamp - req.timestamp,
    },
  };
}
