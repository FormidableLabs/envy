import { Event } from './event';
import { HttpRequest } from './http';

// TODO: the types in this file are from lib/dom
// we need to replace them with a platform agnostic version

function formatFetchHeaders(headers: HeadersInit | Headers | undefined): HttpRequest['requestHeaders'] {
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

export function fetchRequestToEvent(id: string, input: RequestInfo | URL, init?: RequestInit): Event {
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
    timestamp: Date.now(),
    http: {
      method: (init?.method ?? 'GET') as HttpRequest['method'],
      host: url.host,
      port: parseInt(url.port, 10),
      path: url.pathname,
      url: url.toString(),
      requestHeaders: formatFetchHeaders(init?.headers),
      requestBody: init?.body?.toString() ?? undefined,
    },
  };
}

export async function fetchResponseToEvent(req: Event, response: Response): Promise<Event> {
  return {
    ...req,

    http: {
      ...req.http!,
      httpVersion: response.type,
      statusCode: response.status,
      statusMessage: response.statusText,
      responseHeaders: formatFetchHeaders(response.headers),
      responseBody: await response.text(),
    },
  };
}
