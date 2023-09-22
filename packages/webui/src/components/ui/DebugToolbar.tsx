import { useCallback } from 'react';

import Button from '@/components/Button';
import useApplication from '@/hooks/useApplication';
import mockData from '@/testing/mockTraces';

export default function DebugToolbar() {
  const { collector } = useApplication();

  const addMockData = useCallback(() => {
    for (const trace of mockData) {
      collector?.addEvent(trace);
    }
  }, [collector]);

  return <Button onClick={addMockData}>Mock data</Button>;
}
