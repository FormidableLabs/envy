'use client';

import { fetchRandomCocktail } from '@/utils/query';
import { Cocktail } from '@/utils/types';
import { useCallback, useEffect, useState } from 'react';

export function ClientSideCocktail() {
  const [cocktail, setCocktail] = useState<Cocktail>();

  const onRefresh = useCallback(() => fetchRandomCocktail().then(setCocktail), []);

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <div className="thingy">
      <h2>Random cocktail:</h2>
      {cocktail && (
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
      )}
      <div className="button-container">
        <button onClick={onRefresh}>Refresh</button>
      </div>
    </div>
  );
}
