// HACK: convert to jest test that captures the output
// from console and verifies it against expected values

/* eslint-disable import/order */
/* eslint-disable no-console */
import { enableTracing } from './tracing';

// must happen first in order to wrap http/https
// https://github.com/open-telemetry/opentelemetry-js/issues/1315
enableTracing({
  debug: true,
  serviceName: 'unicorns',
});

import fetch from 'node-fetch';

// test against node-fetch
fetch('https://api.quotable.io/quotes/random', {
  headers: {
    Authorization: 'Bearer 12345',
  },
})
  .then(response => response.json())
  .then((quote: Array<{ content: string }>) => {
    console.log('Quote Fetched:', quote[0].content);
  });

// otel needs time to flush so we cant exit immediately for testing
// eslint-disable-next-line @typescript-eslint/no-empty-function
setInterval(() => {}, 1 << 30);
