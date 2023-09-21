import { cleanup, render } from '@testing-library/react';

import mockData, { mockDataAsTraceCollection } from '@/model/mockData';
import { setUseApplicationData } from '@/testing/mockUseApplication';

import TraceList from './TraceList';

describe('TraceList', () => {
  beforeEach(() => {
    setUseApplicationData({
      traces: mockDataAsTraceCollection(),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    cleanup();
  });

  it('should render without error', () => {
    render(<TraceList />);
  });

  describe('when there are no traces', () => {
    const scenarios = [
      { status: 'connecting', useApplicationState: { connecting: true, connected: false }, message: 'Connecting...' },
      {
        status: 'connected',
        useApplicationState: { connecting: false, connected: true, port: 1234 },
        message: 'Connected to ws://127.0.0.1:1234',
      },
      {
        status: 'failed to connect',
        useApplicationState: { connecting: false, connected: false },
        message: 'Unable to connect',
      },
    ];

    it.each(scenarios)('shoud rennder $status message when in $status state', ({ useApplicationState, message }) => {
      setUseApplicationData({
        traces: new Map(),
        ...useApplicationState,
      });

      const { getByTestId, queryByTestId } = render(<TraceList />);
      const noTracesMessage = getByTestId('no-traces');
      const traceList = queryByTestId('trace-list');

      expect(noTracesMessage).toBeVisible();
      expect(noTracesMessage).toHaveTextContent(message);

      expect(traceList).not.toBeInTheDocument();
    });
  });

  describe('where there are traces', () => {
    let setSelectedTraceFn: jest.Mock;

    beforeEach(() => {
      setSelectedTraceFn = jest.fn();

      setUseApplicationData({
        traces: mockDataAsTraceCollection(),
        setSelectedTrace: setSelectedTraceFn,
      });
    });

    it('should render trace list', () => {
      const { getByTestId, queryByTestId } = render(<TraceList />);

      const noTracesMessage = queryByTestId('no-traces');
      const traceList = getByTestId('trace-list');

      expect(noTracesMessage).not.toBeInTheDocument();
      expect(traceList).toBeVisible();
    });

    it('should render all traces', () => {
      const { getAllByTestId } = render(<TraceList />);

      const traces = getAllByTestId('trace');
      expect(traces).toHaveLength(mockData.length);
    });

    it('should call `setSelectedTrace` passing ID of trace when clicked', () => {
      const { getAllByTestId } = render(<TraceList />);

      const traces = getAllByTestId('trace');
      const thirdTraceRow = traces.at(2);

      const thirdTrace = mockData[2];
    });
  });
});
