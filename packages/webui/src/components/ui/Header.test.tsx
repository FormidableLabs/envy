import { cleanup, render } from '@testing-library/react';

import Header from './Header';

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
jest.mock(
  '@/components/ui/SourceAndSystemFilter',
  () =>
    function SourceAndSystemFilter() {
      return <div data-test-id="mock-source-and-systems">Mock Source and Systems component</div>;
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
