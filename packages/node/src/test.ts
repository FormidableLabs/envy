// HACK: convert to jest test that captures the output
// from console and verifies it against expected values

/* eslint-disable import/order */
/* eslint-disable no-console */
import { enableTracing } from './tracing';

// must happen first in order to wrap http/https
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
