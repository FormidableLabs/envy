'use client';

import { CatFactWidget } from '@/shared';
import { fetchCatFact } from '@/utils/query';
import { CatFact } from '@/utils/types';
import { useCallback, useEffect, useState } from 'react';

type Props = {
  initialCatFact?: CatFact;
};

export function CatFactContainer({ initialCatFact }: Props) {
  const [catFact, setCatFact] = useState(initialCatFact);

  const onRefresh = useCallback(() => fetchCatFact().then(setCatFact), []);

  useEffect(() => {
    if (!initialCatFact) {
      onRefresh();
    }
  }, []);

  return (
    <CatFactWidget fact={catFact}>
      <div className="button-container">
        <button onClick={onRefresh}>Refresh</button>
      </div>
    </CatFactWidget>
  );
}
