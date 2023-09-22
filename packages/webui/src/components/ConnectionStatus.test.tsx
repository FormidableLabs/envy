import { cleanup, render } from '@testing-library/react';

import { setUseApplicationData } from '@/testing/mockUseApplication';

import ConnectionStatus from './ConnectionStatus';

jest.mock('react-icons/hi', () => ({
  HiStatusOffline: function MockHiStatusOffline() {
    return <>Mock HiStatusOffline component</>;
  },
  HiStatusOnline: function MockHiStatusOnline() {
    return <>Mock HiStatusOnline component</>;
  },
}));
jest.mock('@/components/ui', () => ({
  Loading: function MockLoading() {
    return <>Mock Loading component</>;
  },
}));

describe('ConnectionStatus', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render without error', () => {
    render(<ConnectionStatus />);
  });

  it('should render loading state when connecting', () => {
    setUseApplicationData({ connecting: true, connected: false });

    const { container } = render(<ConnectionStatus />);

    expect(container).toHaveTextContent('Mock Loading component');
  });

  it('should render connected state when connected', () => {
    setUseApplicationData({ connecting: false, connected: true });

    const { container } = render(<ConnectionStatus />);

    expect(container).toHaveTextContent('Mock HiStatusOnline component');
  });

  it('should render disconnected state when not connecting and not connected', () => {
    setUseApplicationData({ connecting: false, connected: false });

    const { container } = render(<ConnectionStatus />);

    expect(container).toHaveTextContent('Mock HiStatusOffline component');
  });
});
