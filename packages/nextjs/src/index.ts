import { TracingOptions, enableTracing as nodeTracing } from '@envyjs/node';

import { Routes } from './route';

export type NextjsTracingOptions = TracingOptions & {
  /**
   * Set to true to ignore browser calls to React Server Components
   */
  ignoreRSC?: boolean;
};

// nextjs dev mode can run this multiple times
// prevent multiple registrations with a flag
let initialized = false;

export function enableTracing(options: NextjsTracingOptions) {
  const nextjsOptions: NextjsTracingOptions = {
    ...options,
  };

  if (options.ignoreRSC === true) {
    nextjsOptions.filter = request => {
      if (request.host?.includes('127.0.0.1:6') || request.host?.includes('localhost:6')) return false;

      if (options.filter) {
        return options.filter(request);
      }

      return true;
    };
  }

  if (!initialized) {
    initialized = true;
    return nodeTracing({
      ...nextjsOptions,
      plugins: [...(options.plugins || []), Routes],
    });
  }
}
