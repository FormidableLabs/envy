import { enableTracing } from '@envy/web';
import { createRoot } from 'react-dom/client';

enableTracing({ serviceName: 'examples/apollo', debug: true, port: 9999 });

import { App } from './App';

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
