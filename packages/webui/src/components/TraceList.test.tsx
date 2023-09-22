import { act, cleanup, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import mockTraces, { mockTraceCollection } from '@/testing/mockTraces';
import { setUseApplicationData } from '@/testing/mockUseApplication';
import { Trace } from '@/types';

import TraceList from './TraceList';

const mockListDataComponent = jest.fn();

jest.mock('@/systems', () => ({
  ListDataComponent: function MockListDataComponent(props: any) {
    mockListDataComponent(props);
    return <>Mock ListDataComponent component</>;
  },
}));

jest.mock('@/components/ui', () => ({
  Loading: function MockLoading() {
    return <>Mock Loading component</>;
  },
}));

describe('TraceList', () => {
  function setUpTraces(traces: Trace[]) {
    setUseApplicationData({
      traces: traces.reduce((acc, curr) => {
        acc.set(curr.id, curr);
        return acc;
      }, new Map()),
    });
  }

  beforeEach(() => {
    setUpTraces(mockTraces);
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
        traces: mockTraceCollection(),
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
      expect(traces).toHaveLength(mockTraces.length);
    });

    it('should call `setSelectedTrace` passing ID of trace when clicked', async () => {
      const { getAllByTestId } = render(<TraceList />);

      const traces = getAllByTestId('trace');
      const thirdTraceRow = traces.at(2)!;

      await act(async () => {
        await userEvent.click(thirdTraceRow);
      });

      const thirdTrace = mockTraces[2];
      expect(setSelectedTraceFn).toHaveBeenCalledWith(thirdTrace.id);
    });
  });

  describe('trace row colours', () => {
    const scenarios = [
      { statusCode: 500, bgColor: 'purple-500', borderColor: 'purple-500' },
      { statusCode: 404, bgColor: 'red-500', borderColor: 'red-500' },
      { statusCode: 300, bgColor: 'yellow-500', borderColor: 'yellow-500' },
      { statusCode: 200, bgColor: null, borderColor: 'green-500' },
    ];

    it.each(scenarios)('should have $bgColor background for HTTP $statusCode responses', ({ statusCode, bgColor }) => {
      setUpTraces([
        {
          id: '1',
          timestamp: 0,
          http: {
            method: 'GET',
            statusCode,
          } as Trace['http'],
        },
      ]);

      const { getByTestId } = render(<TraceList />);
      const traceRow = getByTestId('trace');

      if (bgColor) {
        expect(traceRow).toHaveClass(`bg-${bgColor}`);
        expect(traceRow).not.toHaveClass(`bg-slate-200`);
      } else {
        expect(traceRow).toHaveClass('bg-slate-200');
      }
    });

    it.each(scenarios)(
      'should have $borderColor left border for HTTP $statusCode responses',
      ({ statusCode, borderColor }) => {
        setUpTraces([
          {
            id: '1',
            timestamp: 0,
            http: {
              method: 'GET',
              statusCode,
            } as Trace['http'],
          },
        ]);

        const { getByTestId } = render(<TraceList />);
        const traceRow = getByTestId('trace');
        const methodData = within(traceRow).getByTestId('column-data-method');

        if (borderColor) {
          expect(methodData).toHaveClass(`border-${borderColor}`);
          expect(methodData).not.toHaveClass(`border-slate-200`);
        } else {
          expect(methodData).toHaveClass('bg-slate-200');
        }
      },
    );

    it('should render selected trace row correctly', () => {
      const trace = {
        id: '1',
        timestamp: 0,
        http: {
          method: 'GET',
        } as Trace['http'],
      };
      setUseApplicationData({
        selectedTraceId: trace.id,
        traces: new Map([[trace.id, trace]]),
      });

      const { getByTestId } = render(<TraceList />);
      const traceRow = getByTestId('trace');

      expect(traceRow).toHaveClass('bg-orange-300');
    });
  });

  describe('trace row data', () => {
    describe('method column', () => {
      it('should display HTTP method only if no response status code exists', () => {
        setUpTraces([
          {
            id: '1',
            timestamp: 0,
            http: {
              method: 'GET',
              statusCode: undefined,
            } as Trace['http'],
          },
        ]);

        const { getByTestId } = render(<TraceList />);
        const traceRow = getByTestId('trace');
        const methodData = within(traceRow).getByTestId('column-data-method');

        expect(methodData).toHaveTextContent('GET');
      });

      it('should display HTTP method and status code if response exists', () => {
        setUpTraces([
          {
            id: '1',
            timestamp: 0,
            http: {
              method: 'POST',
              statusCode: 204,
            } as Trace['http'],
          },
        ]);

        const { getByTestId } = render(<TraceList />);
        const traceRow = getByTestId('trace');
        const methodData = within(traceRow).getByTestId('column-data-method');

        expect(methodData).toHaveTextContent('POST');
        expect(methodData).toHaveTextContent('204');
      });
    });

    describe('request column', () => {
      it('should render ListDataComponent', () => {
        setUpTraces([
          {
            id: '1',
            timestamp: 0,
            http: {
              method: 'GET',
              statusCode: undefined,
            } as Trace['http'],
          },
        ]);

        const { getByTestId } = render(<TraceList />);
        const traceRow = getByTestId('trace');
        const methodData = within(traceRow).getByTestId('column-data-request');

        expect(methodData).toHaveTextContent('Mock ListDataComponent component');
      });

      it('should pass trace data to ListDataComponent', () => {
        const trace = {
          id: '1',
          timestamp: 0,
          http: {
            method: 'GET',
            statusCode: undefined,
          } as Trace['http'],
        };

        setUpTraces([trace]);

        render(<TraceList />);

        expect(mockListDataComponent).toHaveBeenCalledWith({ trace });
      });
    });

    describe('time column', () => {
      it('should render Loading component when duration is not defined', () => {
        setUpTraces([
          {
            id: '1',
            timestamp: 0,
            http: {
              method: 'GET',
              duration: undefined,
            } as Trace['http'],
          },
        ]);

        const { getByTestId } = render(<TraceList />);
        const traceRow = getByTestId('trace');
        const methodData = within(traceRow).getByTestId('column-data-time');

        expect(methodData).toHaveTextContent('Mock Loading component');
      });

      it('should render duration when specified', () => {
        setUpTraces([
          {
            id: '1',
            timestamp: 0,
            http: {
              method: 'GET',
              duration: 1234,
            } as Trace['http'],
          },
        ]);

        const { getByTestId } = render(<TraceList />);
        const traceRow = getByTestId('trace');
        const methodData = within(traceRow).getByTestId('column-data-time');

        expect(methodData).toHaveTextContent('1.23s');
      });

      it('should round up duration', () => {
        setUpTraces([
          {
            id: '1',
            timestamp: 0,
            http: {
              method: 'GET',
              duration: 1239,
            } as Trace['http'],
          },
        ]);

        const { getByTestId } = render(<TraceList />);
        const traceRow = getByTestId('trace');
        const methodData = within(traceRow).getByTestId('column-data-time');

        expect(methodData).toHaveTextContent('1.24s');
      });
    });
  });

  describe('missing data', () => {
    it('should render nothing for method and status if `http` property of trace is not defined', () => {
      setUpTraces([
        {
          id: '1',
          timestamp: 0,
          http: undefined,
        },
      ]);

      const { getByTestId } = render(<TraceList />);
      const traceRow = getByTestId('trace');
      const methodData = within(traceRow).getByTestId('column-data-method');

      expect(methodData).toBeEmptyDOMElement();
    });
  });
});
