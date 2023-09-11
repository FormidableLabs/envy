/* eslint-disable no-console */
import { ReadableSpan, SpanExporter } from '@opentelemetry/sdk-trace-base';
import { ExportResult, ExportResultCode, hrTimeToMicroseconds } from '@opentelemetry/core';
import WebSocket from 'ws';

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
    return {
      traceId: span.spanContext().traceId,
      parentId: span.parentSpanId,
      traceState: span.spanContext().traceState?.serialize(),
      name: span.name,
      id: span.spanContext().spanId,
      kind: span.kind,
      timestamp: hrTimeToMicroseconds(span.startTime),
      duration: hrTimeToMicroseconds(span.duration),
      attributes: span.attributes,
      status: span.status,
      events: span.events,
      links: span.links,
    };
  }

  /**
   * Showing spans in console
   * @param spans
   * @param done
   */
  private _sendSpans(spans: ReadableSpan[], done?: (result: ExportResult) => void): void {
    for (const span of spans) {
      const formattedInfo = this._exportInfo(span);

      if (this.options.debug) {
        console.dir(formattedInfo, { depth: 3 });
      }

      this._ws.send(JSON.stringify(formattedInfo));
    }
    if (done) {
      return done({ code: ExportResultCode.SUCCESS });
    }
  }
}
