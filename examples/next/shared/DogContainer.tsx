'use client';

import { DogWidget } from '@/shared';
import { fetchRandomDog } from '@/utils/query';
import { Dog } from '@/utils/types';
import { useCallback, useEffect, useState } from 'react';

type Props = {
  initialDog?: Dog;
};

export function DogContainer({ initialDog }: Props) {
  const [dog, setDog] = useState(initialDog);

  const onRefresh = useCallback(() => fetchRandomDog().then(setDog), []);

  useEffect(() => {
    if (!initialDog) {
      onRefresh();
    }
  }, []);

  return (
    <DogWidget dogo={dog}>
      <div className="button-container">
        <button onClick={onRefresh}>Refresh</button>
      </div>
    </DogWidget>
  );
}
