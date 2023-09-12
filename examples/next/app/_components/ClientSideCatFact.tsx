'use client';

import { fetchCatFact } from '@/utils/query';
import { CatFact } from '@/utils/types';
import { useCallback, useEffect, useState } from 'react';

export function ClientSideCatFact() {
  const [catFact, setCatFact] = useState<CatFact>();

  const onRefresh = useCallback(() => fetchCatFact().then(setCatFact), []);

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <div className="thingy">
      <h2>Random cat fact:</h2>
      {catFact && <p>{catFact.text}</p>}
      <div className="button-container">
        <button onClick={onRefresh}>Refresh</button>
      </div>
    </div>
  );
}
