import { useQuery } from 'urql';

import { RANDOM_COCKTAIL_QUERY } from '../queries';

export default function Cocktail() {
  const [result, refresh] = useQuery({
    query: RANDOM_COCKTAIL_QUERY,
    requestPolicy: 'network-only',
  });

  return (
    <div className="thingy">
      <h2>Random cocktail:</h2>
      {result.fetching ? (
        <p>Loading cocktail...</p>
      ) : (
        (() => {
          const cocktail = result.data?.randomCocktail;
          if (!cocktail) return null;

          return (
            <div>
              <h3>{cocktail.name}</h3>
              <div className="flex flex-row gap-4 align-top">
                <img src={cocktail.imageUrl} className="rounded w-1/2" />
                <div>
                  <h4 className="mt-0">Ingredients</h4>
                  <ul>
                    {cocktail.ingredients.map((x: string, idx: number) => (
                      <li key={idx}>{x}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <h4>Instructions</h4>
                <p>{cocktail.instructions}</p>
              </div>
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
