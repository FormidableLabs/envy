import { GraphqlRequest, safeParseJson } from '..';

import { Middleware } from '.';

export const Graphql: Middleware = event => {
  if (event.http) {
    const httpRequest = event.http;

    if (httpRequest.method === 'GET') {
      const url = new URL(httpRequest.url);

      event.graphql = mapGraphqlData({
        operationName: url.searchParams.get('operationName'),
        query: url.searchParams.get('query'),
        variables: safeParseJson(url.searchParams.get('variables')).value,
      });
    }

    if (
      httpRequest.method === 'POST' &&
      httpRequest.requestBody &&
      httpRequest.requestHeaders['content-type'] === 'application/json'
    ) {
      const json = safeParseJson(httpRequest.requestBody);
      if (json.value) {
        event.graphql = mapGraphqlData(json.value);
      }
    }
  }
  return event;
};

function mapGraphqlData({
  operationName,
  query,
  variables,
}: {
  operationName?: string | null;
  query?: string | null;
  variables?: Record<any, any>;
}): GraphqlRequest | undefined {
  const matcher = /^(mutation|query)/g;
  const match = query && matcher.exec(query.trim());
  if (match) {
    return {
      operationType: match[1] as GraphqlRequest['operationType'],
      operationName: operationName || undefined,
      query,
      variables: variables || undefined,
    };
  }
}
