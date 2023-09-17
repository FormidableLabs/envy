import { EventType, HttpRequest } from '@envy/core';

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

export function fetchRequestToEvent(
  timestamp: number,
  id: string,
  input: RequestInfo | URL,
  init?: RequestInit,
): HttpRequest {
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
    type: EventType.HttpRequest,
    method: (init?.method ?? 'GET') as HttpRequest['method'],
    host: url.host,
    port: parseInt(url.port, 10),
    path: url.pathname,
    url: url.toString(),
    requestHeaders: formatHeaders(init?.headers),
    requestBody: init?.body?.toString() ?? undefined,
  };
}

export async function fetchResponseToEvent(
  timestamp: number,
  req: HttpRequest,
  response: Response,
): Promise<HttpRequest> {
  return {
    ...req,
    httpVersion: response.type,
    statusCode: response.status,
    statusMessage: response.statusText,
    responseHeaders: formatHeaders(response.headers),
    responseBody: await response.text(),
    duration: timestamp - req.timestamp,
  };
}
