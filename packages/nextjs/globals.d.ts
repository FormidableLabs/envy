import { Options } from '@envyjs/core';
import { NextjsTracingOptions } from '@envyjs/nextjs';

declare global {
  interface Window {
    envy: Options;
  }

  // eslint-disable-next-line no-var
  var envy: NextjsTracingOptions;
}
