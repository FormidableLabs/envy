import { fetchCatFact } from '../utils/query';
import { useCallback, useEffect, useState } from 'react';
import { CatFact as CatFactType } from '../utils/types';

export default function CatFact() {
  const [catFact, setCatFact] = useState<CatFactType>();

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
