import { useQuery } from 'urql';

import { RANDOM_CAT_FACT_QUERY } from '../queries';

export default function CatFact() {
  const [result, refresh] = useQuery({
    query: RANDOM_CAT_FACT_QUERY,
    requestPolicy: 'network-only',
  });

  return (
    <div className="thingy">
      <h2>Random cat fact:</h2>
      {result.fetching ? (
        <p>Loading cat fact...</p>
      ) : (
        (() => {
          const randomFact = result.data?.randomCatFact;
          if (!randomFact) return null;

          return (
            <>
              <p>{randomFact.fact}</p>
            </>
          );
        })()
      )}
      <div className="button-container">
        <button onClick={() => refresh()}>Refresh</button>
      </div>
    </div>
  );
}
