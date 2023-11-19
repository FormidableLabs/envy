import { Event, HttpRequestState } from '@envyjs/core';

import { elapseTime, requestData } from './util';

// Sanity request (data)
const sanityEvent: Event = {
  id: 'TBC',
  parentId: undefined,
  serviceName: 'gql',
  timestamp: elapseTime(0.9),
  http: {
    ...requestData(
      'GET',
      '5bsv02jj.apicdn.sanity.io',
      443,
      '/v2021-10-21/data/query/production?query=*%5B_type%20%3D%3D%20%27product%27%5D%7B_id%2C%20name%2C%20description%2C%20%22categories%22%3A%20categories%5B%5D-%3E%7B_id%7D%2C%20%22variants%22%3A%20variants%5B%5D-%3E%7B_id%2C%20name%2C%20price%7D%7D',
    ),
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
  sanity: {
    query: `*[_type == 'product']{_id, name, description, "categories": categories[]->{_id}, "variants": variants[]->{_id, name, price}}`,
    queryType: 'product',
  },
};

export default [sanityEvent];
