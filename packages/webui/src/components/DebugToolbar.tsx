import { useCallback } from 'react';

import useApplication from '@/hooks/useApplication';
import mockData from '@/model/mockData';

import Button from './ui/Button';

export default function DebugToolbar() {
  const { collector } = useApplication();

  const addMockData = useCallback(() => {
    for (const trace of mockData) {
      collector?.addEvent(trace);
    }
  }, [collector]);

  return (
    <>
      <Button onClick={addMockData}>Mock data</Button>
    </>
  );
}
