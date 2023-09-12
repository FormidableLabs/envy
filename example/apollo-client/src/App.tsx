import { Client, Provider, cacheExchange, fetchExchange } from 'urql';

import CatFact from './components/CatFact';
import Cocktail from './components/Cocktail';
import Xkcd from './components/Xkcd';

const client = new Client({
  url: 'http://localhost:4000/graphql',
  exchanges: [cacheExchange, fetchExchange],
});

export function App() {
  return (
    <Provider value={client}>
      <main className="container my-8 mx-auto">
        <h1>Envy - Example website with Apollo GraphQL server</h1>
        <p>
          This website will make calls to the example apollo GraphQL server, which will send request telemetry over
          websockets for Envy to display in one of the Network Viewer UIs.
        </p>
        <hr className="my-8" />
        <div className="content">
          <CatFact />
          <Cocktail />
          <Xkcd />
        </div>
      </main>
    </Provider>
  );
}
