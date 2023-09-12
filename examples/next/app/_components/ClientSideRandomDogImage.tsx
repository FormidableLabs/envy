'use client';

import { fetchRandomDog } from '@/utils/query';
import { Dog } from '@/utils/types';
import { useCallback, useEffect, useState } from 'react';

export function ClientSideRandomDogImage() {
  const [dog, setDog] = useState<Dog>();

  const onRefresh = useCallback(() => fetchRandomDog().then(setDog), []);

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <div className="thingy">
      <h2>Ramdom Dog Image:</h2>
      <div>
        <img src={dog?.imageUrl} />
      </div>
      <div className="button-container">
        <button onClick={onRefresh}>Refresh</button>
      </div>
    </div>
  );
}
