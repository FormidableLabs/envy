import { useQuery } from 'urql';

import { LATEST_XKCD_QUERY } from '../queries';

export default function Xkcd() {
  const [result, refresh] = useQuery({
    query: LATEST_XKCD_QUERY,
    requestPolicy: 'network-only',
  });

  return (
    <div className="thingy">
      <h2>Latest xkcd:</h2>
      {result.fetching ? (
        <p>Loading comic...</p>
      ) : (
        (() => {
          const comic = result.data?.latestXkcd;
          if (!comic) return null;

          return (
            <div>
              <h3>{comic.name}</h3>
              <img src={comic.imageUrl} />
            </div>
          );
        })()
      )}
      <div className="button-container">
        <button onClick={() => refresh()}>Refresh</button>
      </div>
    </div>
  );
}
