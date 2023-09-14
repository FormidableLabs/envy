import http from 'http';
import https from 'https';
import { performance } from 'perf_hooks';
import { types as utilTypes } from 'util';

import { EventType, HttpRequest } from '@envy/core';
import { wrap } from 'shimmer';

// eslint thinks this is node20:builtin, but this is a node module
// eslint-disable-next-line import/order
import { createBrotliDecompress, unzip } from 'zlib';

import log from './log';
import { Middleware } from './middleware';
import { nanoid } from './nanoid';

// ESM handling of wrapping
const _wrap: typeof wrap = (moduleExports, name, wrapper) => {
  if (!utilTypes.isProxy(moduleExports)) {
    return wrap(moduleExports, name, wrapper);
  } else {
    const wrapped = wrap(Object.assign({}, moduleExports), name, wrapper);

    return Object.defineProperty(moduleExports, name, {
      value: wrapped,
    });
  }
};

export const Http: Middleware = ({ client }) => {
  function override(module: any) {
    _wrap(module, 'request', (original: any) => {
      return function (this: any, ...args: http.ClientRequestArgs[]) {
        const id = nanoid();
        const startTs = performance.now();

        const request = original.apply(this, args) as http.ClientRequest;
        const write = request.write;
        const end = request.end;

        const requestHeaders: HttpRequest['requestHeaders'] = {};
        const headers = request.getHeaders();
        for (const key in headers) {
          requestHeaders[key] = headers[key] as any;
        }

        const options = args[0];
        const httpRequest: HttpRequest = {
          id,
          timestamp: startTs,
          requestHeaders,
          host: request.host,
          path: request.path,
          method: request.method as HttpRequest['method'],
          url: `${request.protocol}//${requestHeaders.host}${request.path}`,
          type: EventType.HttpRequest,
          port: options.port as number,
          requestBody: undefined,
        };

        const payload: any = [];
        request.write = function (...args: any) {
          const chunk = args[0];
          if (Buffer.isBuffer(chunk)) {
            payload.push(chunk);
          }
          return write.apply(this, args);
        };

        request.end = function (...args: any) {
          httpRequest.requestBody = payload.length > 0 ? payload.join() : undefined;

          client.send(httpRequest);
          return end.apply(this, args);
        };

        request.addListener('response', response => {
          const payload: any = [];

          const onRequestData = (chunk: any) => {
            if (Buffer.isBuffer(chunk)) {
              payload.push(chunk);
            }
          };

          const onRequestEnd = () => {
            const endTs = performance.now();

            const httpResponse: HttpRequest = {
              ...httpRequest,

              duration: endTs - startTs,
              httpVersion: response.httpVersion,
              responseBody: undefined,
              responseHeaders: response.headers,
              statusCode: Number(response.statusCode),
              statusMessage: String(response.statusMessage),
            };

            parsePayload(httpResponse, payload, body => {
              httpResponse.responseBody = body;
              client.send(httpResponse);
            });
          };

          response.on('data', onRequestData).on('end', onRequestEnd);
        });

        return request;
      };
    });
  }

  override(http);
  override(https);
};

function parsePayload(httpResponse: HttpRequest, payload: any, callback: (body: string) => void) {
  if (httpResponse.responseHeaders?.['content-encoding'] === 'gzip') {
    unzip(Buffer.concat(payload), (error, result) => {
      if (error) log.error('could not unzip response,', { error });
      if (!error) callback(result.toString());
    });
  } else if (httpResponse.responseHeaders?.['content-encoding'] === 'br') {
    const decompress = createBrotliDecompress();
    decompress.write(Buffer.concat(payload));
    decompress.on('data', result => {
      callback(result.toString());
    });
  } else {
    callback(Buffer.concat(payload).toString());
  }
}
