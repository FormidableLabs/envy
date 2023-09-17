import { enableTracing } from '@envy/web';
import { createRoot } from 'react-dom/client';

import { App } from './App';

const container = document.getElementById('app');
const root = createRoot(container);

enableTracing({ serviceName: 'examples/apollo-client', debug: true, port: 9999 }).then(() => {
  root.render(<App />);
});
