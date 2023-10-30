import { cleanup, render } from '@testing-library/react';

import { setUseApplicationData } from '@/testing/mockUseApplication';

import TraceListPlaceholder from './TraceListPlaceholder';

describe('TraceListPlaceholder', () => {
  afterEach(() => {
    cleanup();
  });

  describe('when there are no traces', () => {
    const scenarios = [
      { status: 'connecting', useApplicationState: { connecting: true, connected: false }, message: 'Connecting...' },
      {
        status: 'connected',
        useApplicationState: { connecting: false, connected: true },
        message: 'Listening for traces...',
      },
      {
        status: 'failed to connect',
        useApplicationState: { connecting: false, connected: false },
        message: 'Unable to connect',
      },
    ];

    it.each(scenarios)('shoud rennder $status message when in $status state', ({ useApplicationState, message }) => {
      setUseApplicationData({
        ...useApplicationState,
      });

      const { getByTestId } = render(<TraceListPlaceholder />);
      const noTracesMessage = getByTestId('trace-list-placeholder');

      expect(noTracesMessage).toBeVisible();
      expect(noTracesMessage).toHaveTextContent(message);
    });
  });
});
