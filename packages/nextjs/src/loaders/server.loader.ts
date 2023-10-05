import { enableTracing } from '../tracing';

// global.envy is injected by webpack
const options = global.envy;
enableTracing(options);
