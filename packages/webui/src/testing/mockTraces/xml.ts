import { Event, HttpRequestState } from '@envyjs/core';

import { elapseTime, requestData } from './util';

// XML response
const xmlEvent: Event = {
  id: '8',
  parentId: undefined,
  serviceName: 'gql',
  timestamp: elapseTime(3.14),
  http: {
    ...requestData('GET', 'hits.webstats.com', 433, '/?apikey=c82e66bd-4d5b-4bb7-b439-896936c94eb2'),
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
      'content-type': 'application/xml; charset=utf-8',
      'content-length': '55',
      'date': 'Thu, 17 Mar 2022 19:51:01 GMT',
      'vary': 'Origin',
      'connection': 'close',
    },
    responseBody: '<hits><today>10</today><yesterday>15</yesterday></hits>',
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

export default [xmlEvent];
