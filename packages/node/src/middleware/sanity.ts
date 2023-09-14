import { EventType, HttpRequest, SanityRequest } from '@envy/core';

import { Middleware } from '.';

const HOST = '.sanity.io';

export const Sanity: Middleware = event => {
  if (event.type === EventType.HttpRequest) {
    const httpRequest = event as HttpRequest;

    if (httpRequest.host.endsWith(HOST)) {
      event.type = EventType.SanityRequest;

      const sanityRequest = event as SanityRequest;

      let query: string | null = null;
      switch (httpRequest.method) {
        case 'GET': {
          const [, qs] = (httpRequest.path ?? '').split('?');
          if (qs) {
            query = decodeURIComponent(qs).replace('query=', '');
          }
          break;
        }
        case 'POST': {
          if (httpRequest.requestBody && httpRequest.requestHeaders['content-type'] === 'application/json') {
            const json = JSON.parse(httpRequest.requestBody);
            query = json?.query;
          }

          break;
        }
      }
      const queryType = query ? /_type\s*==\s*['"](.*?)['"]/m.exec(query)?.[1] ?? null : null;

      sanityRequest.query = query || undefined;
      sanityRequest.queryType = queryType || undefined;
    }
  }
  return event;
};
