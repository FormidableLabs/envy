import http from 'http';
import https from 'https';
import { types as utilTypes } from 'util';

import { Event, HttpRequest } from '@envy/core';
import { wrap } from 'shimmer';

// eslint thinks zlib is node20:builtin, but this is a node module
// eslint-disable-next-line import/order
import { createBrotliDecompress, unzip } from 'zlib';

import { generateId } from './id';
import log from './log';
import { Plugin } from '@envy/core';

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

export const Http: Plugin = (_options, exporter) => {
  function override(module: any) {
    _wrap(module, 'request', (original: any) => {
      return function (this: any, ...args: http.ClientRequestArgs[]) {
        const id = generateId();
        const startTs = Date.now();

        const request = original.apply(this, args) as http.ClientRequest;
        const write = request.write;
        const end = request.end;

        const requestHeaders: HttpRequest['requestHeaders'] = {};
        const headers = request.getHeaders();
        for (const key in headers) {
          requestHeaders[key] = headers[key] as any;
        }

        const options = args[0];
        const httpRequest: Event = {
          id,
          timestamp: startTs,
          http: {
            requestHeaders,
            host: request.host,
            path: request.path,
            method: request.method as HttpRequest['method'],
            url: `${request.protocol}//${requestHeaders.host}${request.path}`,
            port: options.port as number,
            requestBody: undefined,
          },
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
          if (httpRequest.http) {
            httpRequest.http.requestBody = payload.length > 0 ? payload.join() : undefined;
            exporter.send(httpRequest);
          }

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
            const endTs = Date.now();

            const httpResponse: Event = {
              ...httpRequest,

              http: {
                ...httpRequest.http!,
                duration: endTs - startTs,
                httpVersion: response.httpVersion,
                responseBody: undefined,
                responseHeaders: response.headers,
                statusCode: Number(response.statusCode),
                statusMessage: String(response.statusMessage),
              },
            };

            parsePayload(httpResponse.http!, payload, body => {
              httpResponse.http!.responseBody = body;
              exporter.send(httpResponse);
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
