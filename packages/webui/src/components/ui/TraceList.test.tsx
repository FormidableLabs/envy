import { act, cleanup, fireEvent, render, within } from '@testing-library/react';
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

jest.mock('@/components', () => ({
  Loading: function MockLoading() {
    return <>Mock Loading component</>;
  },
  ToggleSwitch: function MockToggleSwitch({ checked, onChange, ...props }: any) {
    return (
      <div {...props} onClick={() => onChange(!checked)}>
        Mock ToggleSwitch component: {checked ? 'checked' : 'unchecked'}
      </div>
    );
  },
}));

describe('TraceList', () => {
  let scrollToFn: jest.Mock;

  function setUpTraces(traces: Trace[]) {
    setUseApplicationData({
      traces: traces.reduce((acc, curr) => {
        acc.set(curr.id, curr);
        return acc;
      }, new Map()),
    });
  }

  beforeEach(() => {
    scrollToFn = jest.fn();
    Element.prototype.scrollTo = scrollToFn;

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

  describe('footer', () => {
    beforeEach(() => {
      setUseApplicationData({
        traces: mockTraceCollection(),
      });
    });

    it('should display number of traces', () => {
      const { getByTestId } = render(<TraceList />);

      const traceCount = getByTestId('trace-count');
      expect(traceCount).toBeVisible();
      expect(traceCount).toHaveTextContent(`Traces: ${mockTraceCollection().size}`);
    });

    it('should display ToggleSwitch component for auto scroll', () => {
      const { getByTestId } = render(<TraceList />);

      const autoScroll = getByTestId('auto-scroll');
      expect(autoScroll).toBeVisible();
      expect(autoScroll).toHaveTextContent('Mock ToggleSwitch component: checked');
    });

    it('should toggle auto scroll when the ToggleSwitch component `onChange` handler fires', async () => {
      const { getByTestId } = render(<TraceList />);

      const autoScrollBefore = getByTestId('auto-scroll');
      expect(autoScrollBefore).toHaveTextContent('Mock ToggleSwitch component: checked');

      await act(async () => {
        await userEvent.click(autoScrollBefore);
      });

      const autoScrollAfter = getByTestId('auto-scroll');
      expect(autoScrollAfter).toHaveTextContent('Mock ToggleSwitch component: unchecked');
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

  describe('scrolling', () => {
    it('should scroll to the bottom when a new trace is added', () => {
      setUseApplicationData({ newestTraceId: '1' });

      // some fake data to validate the set scroll position
      Object.defineProperties(Element.prototype, {
        scrollHeight: {
          value: 400,
        },
      });

      render(<TraceList />);

      expect(scrollToFn).toHaveBeenCalledWith({
        behavior: 'instant',
        top: 400,
      });
    });

    it('should not scroll to the bottom when `autoScroll` is false', () => {
      setUseApplicationData({ newestTraceId: '1' });

      render(<TraceList autoScroll={false} />);

      expect(scrollToFn).not.toHaveBeenCalled();
    });

    it('should not scroll to the bottom when `newestTraceId` is undefined', () => {
      setUseApplicationData({ newestTraceId: undefined });

      render(<TraceList autoScroll={false} />);

      expect(scrollToFn).not.toHaveBeenCalled();
    });

    it('should set auto scroll to false when scrolling away from the bottom of the container', async () => {
      // some fake data to validate the set scroll position
      Object.defineProperties(Element.prototype, {
        scrollHeight: {
          value: 400,
        },
        clientHeight: {
          value: 200,
        },
        scrollTop: {
          value: 100, // not at the bottom
        },
      });

      const { getByTestId } = render(<TraceList />);

      const scrollContainer = getByTestId('scroll-container');
      fireEvent.scroll(scrollContainer);

      const autoScroll = getByTestId('auto-scroll');
      expect(autoScroll).toHaveTextContent('Mock ToggleSwitch component: unchecked');
    });

    it('should set auto scroll to true when scrolling to the bottom of the container', async () => {
      // some fake data to validate the set scroll position
      Object.defineProperties(Element.prototype, {
        scrollHeight: {
          value: 400,
        },
        clientHeight: {
          value: 200,
        },
        scrollTop: {
          value: 200, // scroll top 200 means we're at the bottom of the scrollable area
        },
      });

      const { getByTestId } = render(<TraceList />);

      const scrollContainer = getByTestId('scroll-container');
      fireEvent.scroll(scrollContainer);

      const autoScroll = getByTestId('auto-scroll');
      expect(autoScroll).toHaveTextContent('Mock ToggleSwitch component: checked');
    });
  });
});
