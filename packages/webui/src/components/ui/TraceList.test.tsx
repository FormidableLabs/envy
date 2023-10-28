import { act, cleanup, fireEvent, render } from '@testing-library/react';
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
  ToggleSwitch: function MockToggleSwitch({ checked, onChange, ...props }: any) {
    return (
      <div {...props} onClick={() => onChange(!checked)}>
        Mock ToggleSwitch component: {checked ? 'checked' : 'unchecked'}
      </div>
    );
  },
  IconButton: function MockIconButton() {
    return <>Mock IconButton component</>;
  },
}));

jest.mock('./TraceListHeader', () => ({
  __esModule: true,
  default: function TraceListHeader() {
    return <>Mock TraceListHeader component</>;
  },
}));

jest.mock('./TraceListPlaceholder', () => ({
  __esModule: true,
  default: function TraceListPlaceholder() {
    return <>Mock TraceListPlaceholder component</>;
  },
}));

jest.mock('./TraceListRow', () => ({
  __esModule: true,
  default: function TraceListRow() {
    return <div data-test-id="trace">Mock TraceListRow component</div>;
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
