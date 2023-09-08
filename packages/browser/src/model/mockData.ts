import { ConnectionData } from '@/types';

let now = Date.now();

function elapseTime(seconds: number): number {
  now += seconds * 1000;
  return now;
}

export default [
  // REST request (auth)
  {
    req: {
      connectionID: 'rq:10001:100',
      time: elapseTime(0),
      method: 'POST',
      isRequest: true,
      host: 'auth.restserver.com',
      port: '443',
      path: '/auth?client=mock_client',
      headers: {
        'Authorization': ['Basic dXNlcm5hbWU6cGFzc3dvcmQ='],
        'Content-Type': ['application/x-www-form-urlencoded'],
        'Accept': ['*/*'],
        'Content-Length': ['0'],
        'User-Agent': ['node-fetch/1.0 (+https://github.com/bitinn/node-fetch)'],
        'Accept-Encoding': ['gzip,deflate'],
        'Connection': ['close'],
      },
      body: '',
    },
    res: {
      connectionID: 'rq:10001:100',
      time: elapseTime(0.2),
      httpVersion: '1.1',
      statusCode: 200,
      headers: {
        'content-type': 'application/json',
        'transfer-encoding': 'chunked',
        'connection': 'close',
        'cache-control': 'no-store',
        'content-encoding': 'gzip',
        'strict-transport-security': 'max-age=31536000; includeSubDomains',
        'vary': 'Accept-Encoding, User-Agent',
        'pragma': 'no-cache',
      },
      statusMessage: 'OK',
      body: {
        access_token:
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.vqb33-7FqzFWPNlr0ElW1v2RjJRZBel3CdDHBWD7y_o',
      },
    },
  },
  // GQL query (people)
  {
    req: {
      connectionID: 'rq:10002:100',
      time: elapseTime(0.1),
      method: 'POST',
      isRequest: true,
      host: 'localhost:3000',
      port: '3000',
      path: '/api/graphql',
      headers: {
        'authorization':
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.vqb33-7FqzFWPNlr0ElW1v2RjJRZBel3CdDHBWD7y_o',
        'content-type': ['application/json'],
        'Accept': ['*/*'],
        'User-Agent': ['node-fetch/1.0 (+https://github.com/bitinn/node-fetch)'],
        'Accept-Encoding': ['gzip,deflate'],
      },
      body: {
        query: 'query People {\n  people {\n    id\nfirstName\nlastName\n  }\n}\n',
        operationName: 'People',
        variables: {},
      },
    },
    res: {
      connectionID: 'rq:10002:100',
      time: elapseTime(0.16),
      statusCode: 200,
      headers: {
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
      httpVersion: '1.1',
      statusMessage: 'OK',
      body: {
        data: {
          people: [
            { id: '1', firstName: 'Peter', lastName: 'Piper' },
            { id: '2', firstName: 'Tom', lastName: 'Thumb' },
            { id: '3', firstName: 'Mary', lastName: 'Hadalittlelamb' },
          ],
        },
      },
    },
  },
  // REST request (data)
  {
    req: {
      connectionID: 'rq:10003:100',
      time: elapseTime(1.2),
      method: 'GET',
      isRequest: true,
      host: 'data.restserver.com',
      port: '443',
      path: '/features',
      headers: {
        'accept': 'application/json',
        'User-Agent': ['node-fetch/1.0 (+https://github.com/bitinn/node-fetch)'],
        'accept-encoding': 'br, gzip, deflate',
      },
    },
    res: {
      connectionID: 'rq:10003:100',
      time: elapseTime(0.78),
      statusCode: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'content-length': '351',
        'date': 'Thu, 17 Mar 2022 19:51:00 GMT',
        'vary': 'Origin',
        'connection': 'close',
      },
      httpVersion: '1.1',
      statusMessage: 'OK',
      body: {
        awesomeFeature: true,
        crappyFeature: false,
      },
    },
  },
  // REST request (404)
  {
    req: {
      connectionID: 'rq:10004:100',
      time: elapseTime(3.1),
      method: 'GET',
      isRequest: true,
      host: 'data.restserver.com',
      port: '443',
      path: '/countries?start=0&count=20',
      headers: {
        'accept': 'application/json',
        'User-Agent': ['node-fetch/1.0 (+https://github.com/bitinn/node-fetch)'],
        'accept-encoding': 'br, gzip, deflate',
      },
    },
    res: {
      connectionID: 'rq:10004:100',
      time: elapseTime(0.015),
      statusCode: 404,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'content-length': '2',
        'date': 'Thu, 17 Mar 2022 19:51:01 GMT',
        'vary': 'Origin',
        'connection': 'close',
      },
      httpVersion: '1.1',
      statusMessage: 'Not found',
      body: {},
    },
  },
  // REST request (POST)
  {
    req: {
      connectionID: 'rq:10005:100',
      time: elapseTime(16.3),
      method: 'POST',
      isRequest: true,
      host: 'data.restserver.com',
      port: '3000',
      path: '/people',
      headers: {
        'authorization':
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.vqb33-7FqzFWPNlr0ElW1v2RjJRZBel3CdDHBWD7y_o',
        'content-type': ['application/json'],
        'Accept': ['*/*'],
        'User-Agent': ['node-fetch/1.0 (+https://github.com/bitinn/node-fetch)'],
        'Accept-Encoding': ['gzip,deflate'],
      },
      body: {
        firstName: 'Paddington',
        lastName: 'Bear',
      },
    },
    res: {
      connectionID: 'rq:10005:100',
      time: elapseTime(1.3),
      statusCode: 200,
      headers: {
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
      httpVersion: '1.1',
      statusMessage: 'OK',
      body: {
        id: '4',
      },
    },
  },
  // GQL mutation
  {
    req: {
      connectionID: 'rq:10006:100',
      time: elapseTime(0.1),
      method: 'POST',
      isRequest: true,
      host: 'localhost:3000',
      port: '3000',
      path: '/api/graphql',
      headers: {
        'authorization':
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.vqb33-7FqzFWPNlr0ElW1v2RjJRZBel3CdDHBWD7y_o',
        'content-type': ['application/json'],
        'Accept': ['*/*'],
        'User-Agent': ['node-fetch/1.0 (+https://github.com/bitinn/node-fetch)'],
        'Accept-Encoding': ['gzip,deflate'],
      },
      body: {
        query: 'mutation RegisterPerson($id: String) {\n  registerPerson(id: $id) {\n    success\n}\n}',
        operationName: 'RegisterPerson',
        variables: {
          id: '4',
        },
      },
    },
    res: {
      connectionID: 'rq:10006:100',
      time: elapseTime(0.629),
      statusCode: 200,
      headers: {
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
      httpVersion: '1.1',
      statusMessage: 'OK',
      body: {
        data: {
          success: true,
        },
      },
    },
  },
  // REST request (500)
  {
    req: {
      connectionID: 'rq:10007:100',
      time: elapseTime(3.14),
      method: 'GET',
      isRequest: true,
      host: 'data.restserver.com',
      port: '443',
      path: '/movies?start=0&count=20',
      headers: {
        'accept': 'application/json',
        'User-Agent': ['node-fetch/1.0 (+https://github.com/bitinn/node-fetch)'],
        'accept-encoding': 'br, gzip, deflate',
      },
    },
    res: {
      connectionID: 'rq:10007:100',
      time: elapseTime(5),
      statusCode: 500,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'content-length': '2',
        'date': 'Thu, 17 Mar 2022 19:51:01 GMT',
        'vary': 'Origin',
        'connection': 'close',
      },
      httpVersion: '1.1',
      statusMessage: 'Internal Server Error',
      body: {},
    },
  },
  // In flight request (no response)
  {
    req: {
      connectionID: 'rq:10008:100',
      time: elapseTime(0.4),
      method: 'GET',
      isRequest: true,
      host: 'data.restserver.com',
      port: '443',
      path: '/features',
      headers: {
        'accept': 'application/json',
        'User-Agent': ['node-fetch/1.0 (+https://github.com/bitinn/node-fetch)'],
        'accept-encoding': 'br, gzip, deflate',
      },
    },
  },
] as ConnectionData[];
