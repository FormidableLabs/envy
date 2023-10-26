import { act, cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { setUseApplicationData } from '@/testing/mockUseApplication';
import { Trace } from '@/types';

import TraceListRow from './TraceListRow';

jest.mock('@/components', () => ({
  Loading: function Loading() {
    return <>Mock Loading component</>;
  },
}));

const mockListDataComponent = jest.fn();

jest.mock('@/systems', () => ({
  ListDataComponent: function MockListDataComponent(props: any) {
    mockListDataComponent(props);
    return <>Mock ListDataComponent component</>;
  },
}));

describe('trace row data', () => {
  afterEach(() => {
    cleanup();
  });

  describe('request column', () => {
    it('should render ListDataComponent', () => {
      const trace = {
        id: '1',
        timestamp: 0,
        http: {
          method: 'GET',
          statusCode: undefined,
        } as Trace['http'],
      };

      const { getByTestId } = render(<TraceListRow trace={trace} />);
      const methodData = getByTestId('column-data-request-cell');

      expect(methodData).toHaveTextContent('Mock ListDataComponent component');
    });
  });

  describe('method column', () => {
    it('should display HTTP method only if no response status code exists', () => {
      setUseApplicationData({});

      const trace = {
        id: '1',
        timestamp: 0,
        http: {
          method: 'GET',
          statusCode: undefined,
        } as Trace['http'],
      };

      const { getByTestId } = render(<TraceListRow trace={trace} />);
      const methodData = getByTestId('column-data-method-cell');
      expect(methodData).toHaveTextContent('GET');
    });

    it('should display HTTP method and status code if response exists', () => {
      const trace = {
        id: '1',
        timestamp: 0,
        http: {
          method: 'POST',
          statusCode: 204,
        } as Trace['http'],
      };

      const { getByTestId } = render(<TraceListRow trace={trace} />);
      const methodData = getByTestId('column-data-method-cell');

      expect(methodData).toHaveTextContent('POST');
    });
  });

  describe('code column', () => {
    it('should display HTTP code if response exists', () => {
      const trace = {
        id: '1',
        timestamp: 0,
        http: {
          method: 'POST',
          statusCode: 204,
        } as Trace['http'],
      };

      const { getByTestId } = render(<TraceListRow trace={trace} />);
      const methodData = getByTestId('column-data-code-cell');

      expect(methodData).toHaveTextContent('204');
    });
  });

  describe('time column', () => {
    it('should render Loading component when duration is not defined', () => {
      const trace = {
        id: '1',
        timestamp: 0,
        http: {
          method: 'GET',
          duration: undefined,
        } as Trace['http'],
      };

      const { getByTestId } = render(<TraceListRow trace={trace} />);
      const methodData = getByTestId('column-data-time-cell');

      expect(methodData).toHaveTextContent('Mock Loading component');
    });

    it('should render duration when specified', () => {
      const trace = {
        id: '1',
        timestamp: 0,
        http: {
          method: 'GET',
          duration: 1234,
        } as Trace['http'],
      };

      const { getByTestId } = render(<TraceListRow trace={trace} />);
      const methodData = getByTestId('column-data-time-cell');

      expect(methodData).toHaveTextContent('1.23s');
    });

    it('should round up duration', () => {
      const trace = {
        id: '1',
        timestamp: 0,
        http: {
          method: 'GET',
          duration: 1239,
        } as Trace['http'],
      };

      const { getByTestId } = render(<TraceListRow trace={trace} />);
      const methodData = getByTestId('column-data-time-cell');

      expect(methodData).toHaveTextContent('1.24s');
    });
  });

  describe('trace row colours', () => {
    const scenarios = [
      { statusCode: 500, bgColor: 'purple-500' },
      { statusCode: 404, bgColor: 'red-500' },
      { statusCode: 300, bgColor: 'yellow-500' },
      { statusCode: 200, bgColor: 'green-500' },
    ];

    it.each(scenarios)('should have $bgColor left border for HTTP $statusCode responses', ({ statusCode, bgColor }) => {
      const trace = {
        id: '1',
        timestamp: 0,
        http: {
          method: 'GET',
          statusCode,
        } as Trace['http'],
      };

      const { getByTestId } = render(<TraceListRow trace={trace} />);
      const badge = getByTestId('column-data-badge-cell').firstChild;

      if (bgColor) {
        expect(badge).toHaveClass(`bg-${bgColor}`);
        expect(badge).not.toHaveClass(`border-neutral`);
      } else {
        expect(badge).toHaveClass('bg-gray-100');
      }
    });

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

      const { getByTestId } = render(<TraceListRow trace={trace} />);
      const traceRow = getByTestId('trace');

      expect(traceRow).toHaveClass('bg-green-100');
    });
  });

  it('should call `setSelectedTrace` passing ID of trace when clicked', async () => {
    const setSelectedTraceFn = jest.fn();
    setUseApplicationData({ setSelectedTrace: setSelectedTraceFn });

    const trace = {
      id: '1234',
      timestamp: 0,
      http: {
        method: 'GET',
      } as Trace['http'],
    };
    const { getByTestId } = render(<TraceListRow trace={trace} />);
    const traceRow = getByTestId('trace');

    await act(async () => {
      await userEvent.click(traceRow);
    });

    expect(setSelectedTraceFn).toHaveBeenCalledWith('1234');
  });
});
