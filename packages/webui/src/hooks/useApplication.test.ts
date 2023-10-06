import { renderHook } from '@testing-library/react';

import ApplicationContextProvider from '@/context/ApplicationContext';

import useApplication from './useApplication';

describe('useApplication', () => {
  it('should expose ApplicationContext from ApplicationContextProvider', () => {
    const { result } = renderHook(() => useApplication(), { wrapper: ApplicationContextProvider });

    const context = result.current;
    [
      'collector',
      'port',
      'connecting',
      'connected',
      'traces',
      'connections',
      'selectedTraceId',
      'setSelectedTrace',
      'getSelectedTrace',
      'clearSelectedTrace',
      'filters',
      'setFilters',
      'clearTraces',
    ].forEach(propName => expect(context).toHaveProperty(propName));
  });
});
