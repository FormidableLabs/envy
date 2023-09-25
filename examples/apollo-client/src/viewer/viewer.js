import EnvyViewer from '@envyjs/webui';
import { createRoot } from 'react-dom/client';

import CatFactsSystem from './systems/CatFacts';
import CocktailDbSystem from './systems/CocktailDb';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<EnvyViewer systems={[new CatFactsSystem(), new CocktailDbSystem()]} />);
