import { cleanup, render } from '@testing-library/react';

import Header from './Header';

jest.mock(
  '@/components/ui/ConnectionStatus',
  () =>
    function MockConnectionStatus() {
      return <div data-test-id="mock-connection-status">Mock ConnectionStatus component</div>;
    },
);
jest.mock(
  '@/components/ui/DebugToolbar',
  () =>
    function MockDebugToolbar() {
      return <div data-test-id="mock-debug-toolbar">Mock DebugToolbar component</div>;
    },
);
jest.mock(
  '@/components/ui/FiltersAndActions',
  () =>
    function MockFiltersAndActions() {
      return <div data-test-id="mock-filters-and-actions">Mock FiltersAndActions component</div>;
    },
);

describe('Header', () => {
  const originalProcessEnv = process.env;

  afterEach(() => {
    process.env = originalProcessEnv;
    cleanup();
  });

  it('should render without error', () => {
    render(<Header />);
  });

  it('should render the connection status component', () => {
    const { getByTestId } = render(<Header />);

    const connectionStatus = getByTestId('mock-connection-status');
    expect(connectionStatus).toBeVisible();
  });

  it('should render the filters and actions component', () => {
    const { getByTestId } = render(<Header />);

    const filtersAndActions = getByTestId('mock-filters-and-actions');
    expect(filtersAndActions).toBeVisible();
  });

  it('should not render the debug toolbar if not in development mode', () => {
    process.env.NODE_ENV = 'production';

    const { queryByTestId } = render(<Header />);

    const debugToolbar = queryByTestId('mock-debug-toolbar');
    expect(debugToolbar).not.toBeInTheDocument();
  });

  it('should render the debug toolbar if in development mode', () => {
    process.env.NODE_ENV = 'development';

    const { queryByTestId } = render(<Header />);

    const debugToolbar = queryByTestId('mock-debug-toolbar');
    expect(debugToolbar).toBeVisible();
  });
});
