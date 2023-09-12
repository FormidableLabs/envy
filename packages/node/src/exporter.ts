/* eslint-disable no-console */
import { EventType, type HttpRequest, type HttpResponse } from '@envy/core';
import { ReadableSpan, SpanExporter } from '@opentelemetry/sdk-trace-base';
import { ExportResult, ExportResultCode, hrTimeToMicroseconds } from '@opentelemetry/core';
import WebSocket from 'ws';

const IGNORE_HEADERS = ['host', 'traceparent'];

export interface ExporterOptions {
  debug?: boolean;
  socket: string;
}

/**
 * This is implementation of {@link SpanExporter} that sends
 * spans to a Websocket
 */
export class WebsocketSpanExporter implements SpanExporter {
  private _ws: WebSocket;

  constructor(private options: ExporterOptions) {
    // TODO: validate options aggressively
    this._ws = new WebSocket(options.socket);

    // TODO: automatic reconnection
    this._ws.on('error', error => console.error('@envy/node websocket', { error, socket: options.socket }));
  }

  /**
   * Export spans.
   * @param spans
   * @param resultCallback
   */
  export(spans: ReadableSpan[], resultCallback: (result: ExportResult) => void): void {
    return this._sendSpans(spans, resultCallback);
  }

  /**
   * Shutdown the exporter.
   */
  shutdown(): Promise<void> {
    this._sendSpans([]);
    return this.forceFlush();
  }

  /**
   * Exports any pending spans in exporter
   */
  forceFlush(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Transforms span info into more readable format
   * @param span
   */
  private _exportInfo(span: ReadableSpan) {
    // HACK: for now, we are going to emit the request and response
    // together until we swap out opentelem

    const id = span.spanContext().spanId;
    const parentId = span.parentSpanId;
    const traceId = span.spanContext().traceId;

    const request: HttpRequest = {
      id,
      traceId,
      parentId,
      timestamp: hrTimeToMicroseconds(span.startTime),
      headers: this._parseHeaders(span.attributes, 'request'),
      host: span.attributes['http.request.header.host'] as string,
      httpVersion: span.attributes['http.flavor'] as string,
      method: span.attributes['http.method'] as HttpRequest['method'],
      path: span.attributes['http.target'] as string,
      port: Number(span.attributes['net.peer.port']),
      type: EventType.HttpRequest,
      url: span.attributes['http.url'] as string,
      body: span.attributes['http.request.body'] as string,
    };
    this._sendEvent(request);

    const response: HttpResponse = {
      id: id + '1', // HACK: lol, temp abuse this span id
      traceId,
      parentId,
      timestamp: hrTimeToMicroseconds(span.startTime) + hrTimeToMicroseconds(span.duration),
      headers: this._parseHeaders(span.attributes, 'response'),
      statusCode: Number(span.attributes['http.status_code']),
      statusMessage: span.attributes['http.status_text'] as string,
      type: EventType.HttpResponse,
      body: span.attributes['http.response.body'] as string,
    };
    this._sendEvent(response);
  }

  /**
   * Parse attributes for available headers
   */
  private _parseHeaders(attrs: Record<string, any>, type: 'request' | 'response') {
    const headers: HttpRequest['headers'] = {};
    const prefix = `http.${type}.header.`;
    for (const key in attrs) {
      if (key.startsWith(prefix) && !IGNORE_HEADERS.includes(key)) {
        headers[key.replace(prefix, '')] = attrs[key];
      }
    }
    return headers;
  }

  /**
   * Sends the data to the websocket
   * @param data
   */
  private _sendEvent(data: any) {
    if (this.options.debug) {
      console.dir(data, { depth: 3 });
    }

    // INFO: nested under "event" so we can send different
    // types of messages to the server
    this._ws.send(JSON.stringify(data));
  }

  /**
   * Showing spans in console
   * @param spans
   * @param done
   */
  private _sendSpans(spans: ReadableSpan[], done?: (result: ExportResult) => void): void {
    for (const span of spans) {
      this._exportInfo(span);
    }
    if (done) {
      return done({ code: ExportResultCode.SUCCESS });
    }
  }
}
