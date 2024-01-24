import { DEFAULT_WEB_SOCKET_PORT } from '@envyjs/core';
import { TracingOptions, enableTracing as nodeTracing } from '@envyjs/node';

import { Routes } from './route';

type GlobalWithFlag = { nextjsTracingInitialized: boolean };
const globalWithFlag: GlobalWithFlag = global as unknown as GlobalWithFlag;

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextjsTracingOptions = TracingOptions & {};

export function enableTracing(options: NextjsTracingOptions) {
  const nextjsOptions: NextjsTracingOptions = {
    ...options,
  };

  // Exclude the following traces
  // 127.0.0.1:9999 websocket upgrade protocol
  // (ip address):\d{5} nextjs websocket
  const matcher = new RegExp(`(127\\.0\\.0\\.1|localhost|\\[::1\\]):(${DEFAULT_WEB_SOCKET_PORT}|\\d{5})`);

  nextjsOptions.filter = request => {
    if (matcher.test(request.url)) return false;

    if (options.filter) {
      return options.filter(request);
    }

    return true;
  };

  if (!globalWithFlag.nextjsTracingInitialized) {
    globalWithFlag.nextjsTracingInitialized = true;
    return nodeTracing({
      ...nextjsOptions,
      plugins: [...(options.plugins || []), Routes],
    });
  }
}
