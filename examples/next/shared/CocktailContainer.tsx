'use client';

import { CocktailWidget } from '@/shared';
import { fetchRandomCocktail } from '@/utils/query';
import { Cocktail } from '@/utils/types';
import { useCallback, useEffect, useState } from 'react';

type Props = {
  initialCocktail?: Cocktail;
};

export function CocktailContainer({ initialCocktail }: Props) {
  const [cocktail, setCocktail] = useState(initialCocktail);

  const onRefresh = useCallback(() => fetchRandomCocktail().then(setCocktail), []);

  useEffect(() => {
    if (!initialCocktail) {
      onRefresh();
    }
  }, []);

  return (
    <CocktailWidget cocktail={cocktail}>
      <div className="button-container">
        <button onClick={onRefresh}>Refresh</button>
      </div>
    </CocktailWidget>
  );
}
