import * as http from 'http';
import * as stream from 'stream';

import { Span } from '@opentelemetry/api';
import { HttpInstrumentation as OpenTelHttpInstrumentation } from '@opentelemetry/instrumentation-http';

export const HttpInstrumentation = () => {
  function setMessageBody(name: 'request' | 'response', stream: stream.Readable | stream.Writable, span: Span) {
    const body: any = [];
    stream
      .on('data', chunk => {
        body.push(chunk);
      })
      .on('end', () => {
        span.setAttribute(`http.${name}.body`, Buffer.concat(body).toString());
      });
  }

  return new OpenTelHttpInstrumentation({
    requestHook: (span, request) => {
      if (request instanceof http.ClientRequest) {
        const headers = request.getHeaders();
        for (const name in headers) {
          span.setAttribute(`http.request.header.${name.toLowerCase()}`, headers[name]!);
        }

        setMessageBody('request', request, span);
      }
    },
    responseHook: (span, response) => {
      if (response instanceof http.IncomingMessage) {
        const headers = response.headers;
        for (const name in headers) {
          span.setAttribute(`http.response.header.${name.toLowerCase()}`, headers[name]!);
        }

        setMessageBody('response', response, span);
      }
    },
  });
};
