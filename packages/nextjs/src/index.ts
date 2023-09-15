import { TracingOptions, enableTracing as nodeTracing } from '@envy/node';

import { Routes } from './route';

export type NextjsTracingOptions = TracingOptions;

// nextjs dev mode can run this multiple times
// prevent multiple registrations with a flag
let initialized = false;

export function enableTracing(options: NextjsTracingOptions) {
  if (!initialized) {
    initialized = true;
    return nodeTracing({
      ...options,
      plugins: [...(options.plugins || []), Routes],
    });
  }
}
