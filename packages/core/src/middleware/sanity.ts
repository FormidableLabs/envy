import { safeParseJson } from '../json';

import { Middleware } from '.';

const HOST = '.sanity.io';

export const Sanity: Middleware = event => {
  if (event.http) {
    const httpRequest = event.http;

    if (httpRequest.host.endsWith(HOST)) {
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
            const json = safeParseJson(httpRequest.requestBody);
            query = json.value?.query;
          }

          break;
        }
      }
      const queryType = query ? /_type\s*==\s*['"](.*?)['"]/m.exec(query)?.[1] ?? null : null;

      event.sanity = {
        query: query || undefined,
        queryType: queryType || undefined,
      };
    }
  }
  return event;
};
