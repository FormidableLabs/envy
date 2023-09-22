import http from 'http';
import https from 'https';
import process from 'process';

import { Event, HttpRequest, Plugin } from '@envyjs/core';

// eslint thinks zlib is node20:builtin, but this is a node module
// eslint-disable-next-line import/order
import { createBrotliDecompress, unzip } from 'zlib';

import { generateId } from './id';
import log from './log';
import { Timestamps, calculateTiming, getDuration } from './utils/time';
import { wrap } from './utils/wrap';

export const Http: Plugin = (_options, exporter) => {
  function override(module: any) {
    wrap(module, 'request', (original: any) => {
      return function (this: any, ...args: http.ClientRequestArgs[]) {
        const id = generateId();
        const startTs = Date.now();

        const _timestamps: Timestamps = {
          start: process.hrtime(),
        };

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

        // collect timing data
        let removeSocketListeners: () => void;
        request.on('socket', socket => {
          _timestamps.socket = process.hrtime();

          const onLookup = () => {
            _timestamps.lookup = process.hrtime();
          };

          const onConnect = () => {
            _timestamps.connect = process.hrtime();
          };

          const onSecureConnect = () => {
            _timestamps.secureConnect = process.hrtime();
          };

          socket.once('lookup', onLookup);
          socket.once('connect', onConnect);
          socket.once('secureConnect', onSecureConnect);

          removeSocketListeners = () => {
            socket.removeListener('lookup', onLookup);
            socket.removeListener('connect', onConnect);
            socket.removeListener('secureConnect', onSecureConnect);
          };
        });
        request.on('finish', () => {
          _timestamps.sent = process.hrtime();
          if (removeSocketListeners) removeSocketListeners();
        });

        // captures the request payload and waits until
        // the caller is done writing to the stream
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

        // captures the response
        request.addListener('response', response => {
          _timestamps.firstByte = process.hrtime();

          // Now we know whether `lookup` or `connect` happened. It's possible they
          // were skipped if the hostname was already resolved (or we were given an
          // IP directly), or if a connection was already open (e.g. due to
          // `keep-alive`).
          if (!_timestamps.lookup) {
            _timestamps.lookup = _timestamps.socket;
          }
          if (!_timestamps.connect) {
            _timestamps.connect = _timestamps.lookup;
          }

          const payload: any = [];

          const onRequestData = (chunk: any) => {
            if (Buffer.isBuffer(chunk)) {
              payload.push(chunk);
            }
          };

          const onRequestEnd = () => {
            const httpResponse: Event = {
              ...httpRequest,

              http: {
                ...httpRequest.http!,
                httpVersion: response.httpVersion,
                responseBody: undefined,
                responseHeaders: response.headers,
                statusCode: Number(response.statusCode),
                statusMessage: String(response.statusMessage),
              },
            };

            parsePayload(httpResponse.http!, payload, body => {
              _timestamps.received = process.hrtime();

              httpResponse.http!.responseBody = body;
              httpResponse.http!.timings = calculateTiming(_timestamps);
              httpResponse.http!.duration = getDuration(_timestamps.start, _timestamps.received);

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
