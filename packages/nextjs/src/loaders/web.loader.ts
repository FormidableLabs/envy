import { enableTracing } from '@envyjs/web';

// window.envy is injected by webpack
const options = window.envy;
enableTracing(options);
