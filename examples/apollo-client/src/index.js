import { enableTracing } from '@envyjs/web';
import { createRoot } from 'react-dom/client';

import { App } from './App';

const container = document.getElementById('app');
const root = createRoot(container);

enableTracing({ serviceName: 'examples/apollo-client' }).then(() => {
  root.render(<App />);
});
