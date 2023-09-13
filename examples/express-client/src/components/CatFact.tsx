import { fetchCatFact } from '../utils/query';
import { useCallback, useEffect, useState } from 'react';

export default function CatFact() {
  const [catFact, setCatFact] = useState<string>();

  const onRefresh = useCallback(() => fetchCatFact().then(setCatFact), []);

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <div className="thingy">
      <h2>Random cat fact:</h2>
      {catFact && <p>{catFact}</p>}
      <div className="button-container">
        <button onClick={onRefresh}>Refresh</button>
      </div>
    </div>
  );
}
