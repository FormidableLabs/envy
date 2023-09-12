import process from 'process';

import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { InstrumentationOption } from '@opentelemetry/instrumentation';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { SpanExporter } from '@opentelemetry/sdk-trace-base';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

import { WebsocketSpanExporter } from './exporter';
import { HttpInstrumentation } from './http';

const DEFAULT_SOCKET = 'ws://localhost/path';

export interface TracingOptions {
  serviceName: string;
  debug?: boolean;
  instrumentations?: Array<InstrumentationOption>;
  socket?: string;
  traceExporter?: SpanExporter;
}

export function enableTracing(options: TracingOptions) {
  const traceExporter =
    options.traceExporter ||
    new WebsocketSpanExporter({
      debug: options.debug,
      socket: options.socket || DEFAULT_SOCKET,
    });

  if (options.debug) {
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
  }

  // SDK autosetups the following resources
  // https://opentelemetry.io/docs/instrumentation/js/resources/
  const sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: options.serviceName,
    }),
    traceExporter,
    instrumentations: [HttpInstrumentation(), ...(options.instrumentations || [])],
  });

  // initialize the SDK and register with the OpenTelemetry API
  // this enables the API to record telemetry
  sdk.start();

  // TODO: export this as a custom handler
  // gracefully shut down the SDK on process exit
  process.on('SIGTERM', () => {
    traceExporter.forceFlush?.();
    sdk.shutdown().finally(() => process.exit(0));
  });
}
