import { cleanup, fireEvent, render } from '@testing-library/react';

import { Filters } from '@/hooks/useApplication';
import { setupMockSystems } from '@/testing/mockSystems';
import { setUseApplicationData } from '@/testing/mockUseApplication';

import FiltersAndActions from './FiltersAndActions';

jest.mock('@/components', () => ({
  SourceAndSystemFilter: function (props: any) {
    return <div {...props}>Mock SourceAndSystemFilter component</div>;
  },
  SearchInput: function ({ onChange }: any) {
    return <input data-test-id="mock-search-input" onChange={e => onChange(e.target.value)} />;
  },
}));

jest.mock(
  './SourceAndSystemFilter',
  () =>
    function MockSourceAndSystem(props: any) {
      return <div {...props}>Mock SourceAndSystemFilter component</div>;
    },
);

describe('FiltersAndActions', () => {
  let setFiltersFn: jest.Mock;
  let clearTracesFn: jest.Mock;

  function assertSetFilterUpdate(currentFilters: Filters, expectedValue: Filters) {
    const updateFn = setFiltersFn.mock.lastCall?.[0];
    const updateFnResult = updateFn(currentFilters);

    expect(updateFnResult).toEqual(expectedValue);
  }

  beforeEach(() => {
    setFiltersFn = jest.fn();
    clearTracesFn = jest.fn();

    setupMockSystems();

    setUseApplicationData({
      setFilters: setFiltersFn,
      clearTraces: clearTracesFn,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    cleanup();
  });

  it('should render without error', () => {
    render(<FiltersAndActions />);
  });

  describe('sources and systems', () => {
    it('should render SourceAndSystemFilter component', () => {
      const { getByTestId } = render(<FiltersAndActions />);

      const sourcesAndSystems = getByTestId('sources-and-systems');
      expect(sourcesAndSystems).toBeVisible();
      expect(sourcesAndSystems).toHaveTextContent('Mock SourceAndSystemFilter component');
    });
  });

  describe('search term', () => {
    it('should render SearchInput component', () => {
      const { getByTestId } = render(<FiltersAndActions />);

      const searchInput = getByTestId('mock-search-input');
      expect(searchInput).toBeVisible();
    });

    it('should call `filterTraces` with search term when value changes', () => {
      const filters: Filters = {
        sources: ['source1'],
        systems: ['system1'],
        searchTerm: '',
      };

      setUseApplicationData({
        filters,
        setFilters: setFiltersFn,
      });

      const { getByTestId } = render(<FiltersAndActions />);

      const searchInput = getByTestId('mock-search-input');

      fireEvent.change(searchInput, {
        target: { value: '/foo' },
      });

      assertSetFilterUpdate(filters, {
        sources: ['source1'],
        systems: ['system1'],
        searchTerm: '/foo',
      });
    });
  });
});
