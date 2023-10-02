import { cleanup, render } from '@testing-library/react';

import { setUseApplicationData } from '@/testing/mockUseApplication';

import MainDisplay from './MainDisplay';

jest.mock('react-hot-toast', () => ({
  Toaster: function MockToaster() {
    return <div data-test-id="mock-toaster">Mock Toaster component</div>;
  },
}));
jest.mock(
  '@/components/ui/TraceDetail',
  () =>
    function MockTraceDetail() {
      return <div data-test-id="mock-trace-detail">Mock TraceDetail component</div>;
    },
);
jest.mock(
  '@/components/ui/TraceList',
  () =>
    function MockTraceList() {
      return <div data-test-id="mock-trace-list">Mock TraceList component</div>;
    },
);

describe('MainDisplay', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render without error', () => {
    render(<MainDisplay />);
  });

  it('should render trace list component', () => {
    const { getByTestId } = render(<MainDisplay />);

    const connectionStatus = getByTestId('mock-trace-list');
    expect(connectionStatus).toBeVisible();
  });

  it('should not render trace detail component if `selectedTraceId` is undefined', () => {
    setUseApplicationData({ selectedTraceId: undefined });

    const { queryByTestId } = render(<MainDisplay />);

    const connectionStatus = queryByTestId('mock-trace-detail');
    expect(connectionStatus).not.toBeInTheDocument();
  });

  it('should render trace detail component if `selectedTraceId` has a value', () => {
    setUseApplicationData({ selectedTraceId: '1' });

    const { queryByTestId } = render(<MainDisplay />);

    const connectionStatus = queryByTestId('mock-trace-detail');
    expect(connectionStatus).toBeVisible();
  });

  it('should render Toaster component ', () => {
    setUseApplicationData({ selectedTraceId: '1' });

    const { queryByTestId } = render(<MainDisplay />);

    const toaster = queryByTestId('mock-toaster');
    expect(toaster).toBeVisible();
    expect(toaster).toHaveTextContent('Mock Toaster component');
  });
});
