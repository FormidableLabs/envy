import { Event } from './event';
import { HeadersInit, RequestInfo, RequestInit, Response } from './fetchTypes';
import { HttpRequest, HttpRequestState } from './http';
import { tryParseURL } from './url';

/**
 * Returns an {@link Event} from fetch request arguments
 */
export function getEventFromFetchRequest(id: string, input: RequestInfo | URL, init?: RequestInit): Event {
  const url = getUrlFromFetchRequest(input);

  return {
    id,
    parentId: undefined,
    timestamp: Date.now(),
    http: {
      state: HttpRequestState.Sent,
      method: (init?.method ?? 'GET') as HttpRequest['method'],
      host: url.host,
      port: parseInt(url.port, 10),
      path: url.pathname,
      url: url.toString(),
      requestHeaders: parseFetchHeaders(init?.headers),
      requestBody: init?.body?.toString() ?? undefined,
    },
  };
}

/**
 * Returns an {@link Event} from a fetch response
 */
export async function getEventFromFetchResponse(req: Event, response: Response): Promise<Event> {
  return {
    ...req,

    http: {
      ...req.http!,
      state: HttpRequestState.Received,
      httpVersion: response.type,
      statusCode: response.status,
      statusMessage: response.statusText,
      responseHeaders: parseFetchHeaders(response.headers),
      responseBody: await response.text(),
    },
  };
}

/**
 * Returns a {@link URL} from fetch request arguments.
 * Fallback to localhost if the fetch arguments could not be parsed.
 */
export function getUrlFromFetchRequest(input: RequestInfo | URL): URL {
  if (input instanceof URL) {
    return input;
  }

  const url = (input as any).url ? (input as any).url : input;

  // parse absolute and relative urls
  const parsedUrl = tryParseURL(url) || tryParseURL(url, globalThis?.location?.origin);
  if (parsedUrl) {
    return parsedUrl;
  }

  // this library is for instrumentation, so we use a fallback
  // to prevent throwing errors in consumer applications
  return new URL('http://localhost/');
}

export function parseFetchHeaders(headers?: HeadersInit): HttpRequest['requestHeaders'] {
  if (headers) {
    if (Array.isArray(headers)) {
      return headers.reduce<HttpRequest['requestHeaders']>((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    } else if (typeof headers.entries === 'function') {
      return Object.fromEntries(headers.entries());
    } else {
      return headers as Record<string, string>;
    }
  }

  return {};
}
