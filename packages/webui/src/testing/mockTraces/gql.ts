import { Event, HttpRequestState } from '@envyjs/core';

import { elapseTime, requestData } from './util';

// GQL query (people)
const gqlQuery: Event = {
  id: '2',
  parentId: undefined,
  serviceName: 'web',
  timestamp: elapseTime(0.1),
  http: {
    ...requestData('POST', 'localhost', 3000, '/api/graphql'),
    state: HttpRequestState.Received,
    requestHeaders: {
      'authorization':
        'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.vqb33-7FqzFWPNlr0ElW1v2RjJRZBel3CdDHBWD7y_o',
      'content-type': ['application/json'],
      'Accept': ['*/*'],
      'User-Agent': ['node-fetch/1.0 (+https://github.com/bitinn/node-fetch)'],
      'Accept-Encoding': ['gzip,deflate'],
    },
    requestBody: JSON.stringify({
      query: 'query People {\n  people {\n    id\nfirstName\nlastName\n  }\n}\n',
      operationName: 'People',
      variables: {},
    }),
    // ---------
    statusCode: 200,
    statusMessage: 'OK',
    responseHeaders: {
      'x-powered-by': 'Express',
      'cache-control': 'private, no-store',
      'surrogate-key': 'all',
      'access-control-allow-origin': '*',
      'access-control-allow-credentials': 'true',
      'content-type': 'application/json',
      'content-length': '28',
      'vary': 'Accept-Encoding',
      'date': 'Thu, 17 Mar 2022 19:51:01 GMT',
      'connection': 'keep-alive',
      'keep-alive': 'timeout=5',
    },
    responseBody: JSON.stringify({
      data: {
        people: [
          { id: '1', firstName: 'Peter', lastName: 'Piper' },
          { id: '2', firstName: 'Tom', lastName: 'Thumb' },
          { id: '3', firstName: 'Mary', lastName: 'Hadalittlelamb' },
        ],
      },
    }),
    duration: 500,
  },
  graphql: {
    operationType: 'Query',
    query: 'query People {\n  people {\n    id\nfirstName\nlastName\n  }\n}\n',
    operationName: 'People',
    variables: {},
  },
};

// GQL mutation
const gqlMutation: Event = {
  id: '6',
  parentId: undefined,
  serviceName: 'web',
  timestamp: elapseTime(0.1),
  http: {
    ...requestData('POST', 'localhost', 3000, '/api/graphql'),
    state: HttpRequestState.Received,
    requestHeaders: {
      'authorization':
        'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.vqb33-7FqzFWPNlr0ElW1v2RjJRZBel3CdDHBWD7y_o',
      'content-type': ['application/json'],
      'Accept': ['*/*'],
      'User-Agent': ['node-fetch/1.0 (+https://github.com/bitinn/node-fetch)'],
      'Accept-Encoding': ['gzip,deflate'],
    },
    requestBody: JSON.stringify({
      query: 'mutation RegisterPerson($id: String) {\n  registerPerson(id: $id) {\n    success\n}\n}',
      parentId: undefined,
      operationName: 'RegisterPerson',
      variables: {
        id: '4',
        parentId: undefined,
      },
    }),
    // ---------
    httpVersion: '1.1',
    statusCode: 200,
    statusMessage: 'OK',
    responseHeaders: {
      'x-powered-by': 'Express',
      'cache-control': 'private, no-store',
      'surrogate-key': 'all',
      'access-control-allow-origin': '*',
      'access-control-allow-credentials': 'true',
      'content-type': 'application/json',
      'content-length': '28',
      'vary': 'Accept-Encoding',
      'date': 'Thu, 17 Mar 2022 19:51:01 GMT',
      'connection': 'keep-alive',
      'keep-alive': 'timeout=5',
    },
    responseBody: JSON.stringify({
      data: {
        success: true,
      },
    }),
    duration: 629,
  },
  graphql: {
    operationType: 'Mutation',
    query: 'mutation RegisterPerson($id: String) {\n  registerPerson(id: $id) {\n    success\n}\n}',
    operationName: 'RegisterPerson',
    variables: {
      id: '4',
      parentId: undefined,
    },
  },
};

export default [gqlQuery, gqlMutation];
