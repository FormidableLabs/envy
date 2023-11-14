import { Event, HttpRequestState } from '@envyjs/core';

import { elapseTime, requestData } from './util';

// REST request (auth)
const authRequest: Event = {
  id: '1',
  parentId: undefined,
  serviceName: 'gql',
  timestamp: elapseTime(0),
  http: {
    ...requestData('GET', 'auth.restserver.com', 443, '/auth?client=mock_client'),
    state: HttpRequestState.Received,
    requestHeaders: {
      'Authorization': ['Basic dXNlcm5hbWU6cGFzc3dvcmQ='],
      'Content-Type': ['application/x-www-form-urlencoded'],
      'Accept': ['*/*'],
      'Content-Length': ['0'],
      'User-Agent': ['node-fetch/1.0 (+https://github.com/bitinn/node-fetch)'],
      'Accept-Encoding': ['gzip,deflate'],
      'Connection': ['close'],
    },
    requestBody: undefined,
    // ---------
    httpVersion: '1.1',
    statusCode: 200,
    statusMessage: 'OK',
    responseHeaders: {
      'content-type': 'application/json',
      'transfer-encoding': 'chunked',
      'connection': 'close',
      'cache-control': 'no-store',
      'content-encoding': 'gzip',
      'strict-transport-security': 'max-age=31536000; includeSubDomains',
      'vary': 'Accept-Encoding, User-Agent',
      'pragma': 'no-cache',
    },
    responseBody: JSON.stringify({
      access_token:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.vqb33-7FqzFWPNlr0ElW1v2RjJRZBel3CdDHBWD7y_o',
    }),
    duration: 200,
    timings: {
      blocked: 10,
      dns: 20,
      connect: 100,
      ssl: 70,
      send: 30,
      wait: 30,
      receive: 10,
    },
  },
};

// REST request (data)
const dataEvent: Event = {
  id: '3',
  parentId: undefined,
  serviceName: 'gql',
  timestamp: elapseTime(1.2),
  http: {
    ...requestData('GET', 'data.restserver.com', 443, '/features'),
    state: HttpRequestState.Received,
    requestHeaders: {
      'accept': 'application/json',
      'User-Agent': ['node-fetch/1.0 (+https://github.com/bitinn/node-fetch)'],
      'accept-encoding': 'br, gzip, deflate',
    },
    requestBody: undefined,
    // ---------
    httpVersion: '1.1',
    statusCode: 200,
    statusMessage: 'OK',
    responseHeaders: {
      'content-type': 'application/json; charset=utf-8',
      'content-length': '351',
      'date': 'Thu, 17 Mar 2022 19:51:00 GMT',
      'vary': 'Origin',
      'connection': 'close',
    },
    responseBody: JSON.stringify({
      awesomeFeature: true,
      crappyFeature: false,
    }),
    duration: 15,
    timings: {
      blocked: 1,
      dns: 1,
      connect: 5,
      ssl: 2,
      send: 3,
      wait: 2,
      receive: 3,
    },
  },
};

// REST request (404)
const notFoundEvent: Event = {
  id: '4',
  parentId: undefined,
  serviceName: 'gql',
  timestamp: elapseTime(3.1),
  http: {
    ...requestData('GET', 'data.restserver.com', 443, '/countries?start=0&count=20'),
    state: HttpRequestState.Received,
    requestHeaders: {
      'accept': 'application/json',
      'User-Agent': ['node-fetch/1.0 (+https://github.com/bitinn/node-fetch)'],
      'accept-encoding': 'br, gzip, deflate',
    },
    requestBody: undefined,
    // ---------
    httpVersion: '1.1',
    statusCode: 404,
    statusMessage: 'Not found',
    responseHeaders: {
      'content-type': 'application/json; charset=utf-8',
      'content-length': '2',
      'date': 'Thu, 17 Mar 2022 19:51:01 GMT',
      'vary': 'Origin',
      'connection': 'close',
    },
    responseBody: undefined,
    duration: 10,
    timings: {
      blocked: 1,
      dns: 1,
      connect: 3,
      ssl: 1,
      send: 2,
      wait: 2,
      receive: 1,
    },
  },
};

// REST request (POST)
const postEvent: Event = {
  id: '5',
  parentId: undefined,
  serviceName: 'gql',
  timestamp: elapseTime(16.3),
  http: {
    ...requestData('POST', 'data.restserver.com', 443, '/people'),
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
      firstName: 'Paddington',
      lastName: 'Bear',
    }),
    // ---------
    httpVersion: '1.1',
    statusCode: 200,
    statusMessage: 'OK',
    responseHeaders: {
      'cache-control': 'private, no-store',
      'surrogate-key': 'all',
      'access-control-allow-origin': '*',
      'access-control-allow-credentials': 'true',
      'content-type': 'application/json',
      'content-length': '11',
      'vary': 'Accept-Encoding',
      'date': 'Thu, 17 Mar 2022 19:51:02 GMT',
      'connection': 'keep-alive',
      'keep-alive': 'timeout=5',
    },
    responseBody: JSON.stringify({
      id: '4',
    }),
    duration: 1300,
    timings: {
      blocked: 40,
      dns: 60,
      connect: 1000,
      ssl: 800,
      send: 50,
      wait: 120,
      receive: 30,
    },
  },
};

// OPTIONS request
const optionsEvent: Event = {
  id: '59',
  parentId: undefined,
  serviceName: 'web',
  timestamp: elapseTime(16.3),
  http: {
    ...requestData('OPTIONS', 'data.restserver.com', 443, ''),
    state: HttpRequestState.Received,
    requestHeaders: {
      'content-type': ['application/json'],
      'Accept': ['*/*'],
      'User-Agent': ['node-fetch/1.0 (+https://github.com/bitinn/node-fetch)'],
      'Accept-Encoding': ['gzip,deflate'],
    },
    // ---------
    httpVersion: '1.1',
    statusCode: 200,
    statusMessage: 'OK',
    responseHeaders: {
      'cache-control': 'private, no-store',
      'surrogate-key': 'all',
      'access-control-allow-origin': '*',
      'access-control-allow-credentials': 'true',
      'content-type': 'application/json',
      'content-length': '11',
      'vary': 'Accept-Encoding',
      'date': 'Thu, 17 Mar 2022 19:51:02 GMT',
      'connection': 'keep-alive',
      'keep-alive': 'timeout=5',
    },
    duration: 1300,
    timings: {
      blocked: 40,
      dns: 60,
      connect: 1000,
      ssl: 800,
      send: 50,
      wait: 120,
      receive: 30,
    },
  },
};

// REST request (500)
const errorEvent: Event = {
  id: '7',
  parentId: undefined,
  serviceName: 'gql',
  timestamp: elapseTime(3.14),
  http: {
    ...requestData('GET', 'data.restserver.com', 433, '/movies?start=0&count=20'),
    state: HttpRequestState.Received,
    requestHeaders: {
      'accept': 'application/json',
      'User-Agent': ['node-fetch/1.0 (+https://github.com/bitinn/node-fetch)'],
      'accept-encoding': 'br, gzip, deflate',
    },
    requestBody: undefined,
    // ---------
    httpVersion: '1.1',
    statusCode: 500,
    statusMessage: 'Internal Server Error',
    responseHeaders: {
      'content-type': 'application/json; charset=utf-8',
      'content-length': '0',
      'date': 'Thu, 17 Mar 2022 19:51:01 GMT',
      'vary': 'Origin',
      'connection': 'close',
    },
    responseBody: undefined,
    duration: 5000,
    timings: {
      blocked: 40,
      dns: 60,
      connect: 1000,
      ssl: 800,
      send: 500,
      wait: 3390,
      receive: 10,
    },
  },
};

// Aborted request (no response)
const abortedEvent: Event = {
  id: '99',
  parentId: undefined,
  serviceName: 'gql',
  timestamp: elapseTime(0.4),
  http: {
    ...requestData('GET', 'data.restserver.com', 433, '/features'),
    state: HttpRequestState.Aborted,
    requestHeaders: {
      'accept': 'application/json',
      'User-Agent': ['node-fetch/1.0 (+https://github.com/bitinn/node-fetch)'],
      'accept-encoding': 'br, gzip, deflate',
    },
    requestBody: undefined,
    // ---------
    httpVersion: '1.1',
    statusCode: undefined,
    statusMessage: undefined,
    responseHeaders: undefined,
    responseBody: undefined,
    duration: 200,
  },
};

// In flight request (no response)
const inFlightEvent: Event = {
  id: '9',
  parentId: undefined,
  serviceName: 'gql',
  timestamp: elapseTime(0.4),
  http: {
    ...requestData('GET', 'data.restserver.com', 433, '/features'),
    requestHeaders: {
      'accept': 'application/json',
      'User-Agent': ['node-fetch/1.0 (+https://github.com/bitinn/node-fetch)'],
      'accept-encoding': 'br, gzip, deflate',
    },
    requestBody: undefined,
    // ---------
    httpVersion: '1.1',
    statusCode: undefined,
    statusMessage: undefined,
    responseHeaders: undefined,
    responseBody: undefined,
    duration: undefined,
  },
};

export default [
  authRequest,
  dataEvent,
  postEvent,
  optionsEvent,
  notFoundEvent,
  errorEvent,
  abortedEvent,
  inFlightEvent,
];
