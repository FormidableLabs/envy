import { act, cleanup, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ApplicationContextData, Filters } from '@/hooks/useApplication';
import { mockSystems, setupMockSystems } from '@/testing/mockSystems';
import { setUseApplicationData as callSetUseApplicationData } from '@/testing/mockUseApplication';

import SourceAndSystemFilter from './SourceAndSystemFilter';

jest.mock('lucide-react', () => ({
  Filter: function MockHiOutlineFilter() {
    return <>Mock Filter component</>;
  },
  X: function MockX() {
    return <>Mock X component</>;
  },
  Check: function MockCheck() {
    return <>Mock Check component</>;
  },
}));

describe('SourceAndSystemFilter', () => {
  let setFiltersFn: jest.Mock;

  function setUseApplicationData(data: Partial<ApplicationContextData> = {}) {
    setFiltersFn = jest.fn();

    callSetUseApplicationData({
      connections: [
        ['source1', true],
        ['source2', true],
        ['source3', false],
      ],
      filters: {
        sources: [],
        systems: [],
        searchTerm: '',
      },
      setFilters: setFiltersFn,
      ...data,
    });
  }

  async function openDropDown() {
    const renderResult = render(<SourceAndSystemFilter />);

    await act(async () => {
      const component = renderResult.getByRole('listbox');
      await userEvent.click(component);
    });

    return renderResult;
  }

  function assertSetFilterUpdate(currentFilters: Filters, expectedValue: Filters) {
    const updateFn = setFiltersFn.mock.lastCall?.[0];
    const updateFnResult = updateFn(currentFilters);

    expect(updateFnResult).toEqual(expectedValue);
  }

  beforeEach(() => {
    setUseApplicationData();
    setupMockSystems();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render without error', () => {
    render(<SourceAndSystemFilter />);
  });

  it('should render a component with the role "listbox"', () => {
    const { getByRole } = render(<SourceAndSystemFilter />);

    const component = getByRole('listbox');
    expect(component).toBeVisible();
  });

  describe('placeholder', () => {
    it('should display expected placeholder in the listbox when there are no registered systems', () => {
      // mock that there are no registered systems
      setupMockSystems([]);

      const { getByRole } = render(<SourceAndSystemFilter />);

      const component = getByRole('listbox');
      expect(component).toHaveTextContent('Sources...');
    });

    it('should display expected placeholder in the listbox when there is one or more registered systems', () => {
      setupMockSystems(mockSystems);
      const { getByRole } = render(<SourceAndSystemFilter />);

      const component = getByRole('listbox');
      expect(component).toHaveTextContent('Sources & Systems');
    });
  });

  describe('selection summary', () => {
    it('should display expected selection summary when one source is selected', () => {
      const filters: Filters = {
        sources: ['source1'],
        systems: [],
        searchTerm: '',
      };
      setUseApplicationData({ filters });

      const { getByRole } = render(<SourceAndSystemFilter />);

      const component = getByRole('listbox');
      expect(component).toHaveTextContent('1 source');
    });

    it('should display expected selection summary when two sources are selected', () => {
      const filters: Filters = {
        sources: ['source1', 'source2'],
        systems: [],
        searchTerm: '',
      };
      setUseApplicationData({ filters });

      const { getByRole } = render(<SourceAndSystemFilter />);

      const component = getByRole('listbox');
      expect(component).toHaveTextContent('2 sources');
    });

    it('should display expected selection summary when one system is selected', () => {
      const filters: Filters = {
        sources: [],
        systems: [mockSystems[0].name],
        searchTerm: '',
      };
      setUseApplicationData({ filters });

      const { getByRole } = render(<SourceAndSystemFilter />);

      const component = getByRole('listbox');
      expect(component).toHaveTextContent('1 system');
    });

    it('should display expected selection summary when two systems are selected', () => {
      const filters: Filters = {
        sources: [],
        systems: [mockSystems[0].name, mockSystems[1].name],
        searchTerm: '',
      };
      setUseApplicationData({ filters });

      const { getByRole } = render(<SourceAndSystemFilter />);

      const component = getByRole('listbox');
      expect(component).toHaveTextContent('2 systems');
    });

    it('should display expected selection summary when a combination of sources and systems are selected', () => {
      const filters: Filters = {
        sources: ['source1'],
        systems: [mockSystems[0].name, mockSystems[1].name],
        searchTerm: '',
      };
      setUseApplicationData({ filters });

      const { getByRole } = render(<SourceAndSystemFilter />);

      const component = getByRole('listbox');
      expect(component).toHaveTextContent('1 source, 2 systems');
    });

    it('should display the placeholder when no sources or systems are selected', () => {
      const filters: Filters = {
        sources: [],
        systems: [],
        searchTerm: '',
      };
      setUseApplicationData({ filters });

      const { getByRole } = render(<SourceAndSystemFilter />);

      const component = getByRole('listbox');
      expect(component).toHaveTextContent('Sources & Systems');
    });
  });

  describe('selection options', () => {
    describe('with no registered systems', () => {
      beforeEach(() => {
        callSetUseApplicationData({
          connections: [
            ['source1', true],
            ['source2', true],
            ['source3', false],
          ],
        });
        setupMockSystems([]);
      });

      it('should not display source options if there are no sources', async () => {
        callSetUseApplicationData({
          connections: [],
        });

        const { queryByTestId } = await openDropDown();

        const sourceItems = queryByTestId('source-items');

        expect(sourceItems).not.toBeInTheDocument();
      });

      it('should display "no sources" message if there are no sources', async () => {
        callSetUseApplicationData({
          connections: [],
        });

        const { getByTestId } = await openDropDown();

        const noSourcesMessage = getByTestId('no-sources');

        expect(noSourcesMessage).toBeVisible();
        expect(noSourcesMessage).toHaveTextContent('No sources connected...');
      });

      it('should display source options', async () => {
        const { getByTestId } = await openDropDown();

        const sourceItems = getByTestId('source-items');

        expect(sourceItems).toBeVisible();
      });

      it('should not display system options', async () => {
        const { queryByTestId } = await openDropDown();

        const systemItems = queryByTestId('system-items');

        expect(systemItems).not.toBeInTheDocument();
      });

      it('should not display source options heading', async () => {
        const { queryByTestId } = await openDropDown();

        const sourceItemsHeading = queryByTestId('source-items-heading');

        expect(sourceItemsHeading).not.toBeInTheDocument();
      });

      it('should not display source / system divider', async () => {
        const { queryByTestId } = await openDropDown();

        const itemsDivider = queryByTestId('items-divider');

        expect(itemsDivider).not.toBeInTheDocument();
      });

      it('should display each source as an option', async () => {
        const { getAllByTestId } = await openDropDown();

        const sourceItems = getAllByTestId('source-item');

        expect(sourceItems).toHaveLength(3);
        expect(sourceItems.at(0)!).toHaveTextContent('source1');
        expect(sourceItems.at(1)!).toHaveTextContent('source2');
        expect(sourceItems.at(2)!).toHaveTextContent('source3');
      });

      it('should display active status for each source', async () => {
        const { getAllByTestId } = await openDropDown();

        const sourceItems = getAllByTestId('source-item');

        expect(within(sourceItems.at(0)!).getByTestId('status')).toHaveClass('bg-green-300');
        expect(within(sourceItems.at(1)!).getByTestId('status')).toHaveClass('bg-green-300');
        expect(within(sourceItems.at(2)!).getByTestId('status')).toHaveClass('bg-red-300');
      });
    });

    describe('with some registered systems', () => {
      beforeEach(() => {
        callSetUseApplicationData({
          connections: [
            ['source1', true],
            ['source2', true],
            ['source3', false],
          ],
        });
        setupMockSystems(mockSystems);
      });

      it('should display source options', async () => {
        const { getByTestId } = await openDropDown();

        const sourceItems = getByTestId('source-items');

        expect(sourceItems).toBeVisible();
      });

      it('should display system options', async () => {
        const { getByTestId } = await openDropDown();

        const systemItems = getByTestId('system-items');

        expect(systemItems).toBeVisible();
      });

      it('should display source options heading', async () => {
        const { getByTestId } = await openDropDown();

        const sourceItemsHeading = getByTestId('source-items-heading');

        expect(sourceItemsHeading).toBeVisible();
      });

      it('should not display source / system divider', async () => {
        const { getByTestId } = await openDropDown();

        const itemsDivider = getByTestId('items-divider');

        expect(itemsDivider).toBeVisible();
      });

      it('should display each source as an option', async () => {
        const { getAllByTestId } = await openDropDown();

        const sourceItems = getAllByTestId('source-item');

        expect(sourceItems).toHaveLength(3);
        expect(sourceItems.at(0)!).toHaveTextContent('source1');
        expect(sourceItems.at(1)!).toHaveTextContent('source2');
        expect(sourceItems.at(2)!).toHaveTextContent('source3');
      });

      it('should display active status for each source', async () => {
        const { getAllByTestId } = await openDropDown();

        const sourceItems = getAllByTestId('source-item');

        expect(within(sourceItems.at(0)!).getByTestId('status')).toHaveClass('bg-green-300');
        expect(within(sourceItems.at(1)!).getByTestId('status')).toHaveClass('bg-green-300');
        expect(within(sourceItems.at(2)!).getByTestId('status')).toHaveClass('bg-red-300');
      });

      it('should display each system as an option', async () => {
        const { getAllByTestId } = await openDropDown();

        const sourceItems = getAllByTestId('system-item');

        expect(sourceItems).toHaveLength(mockSystems.length);
        mockSystems.forEach((mockSystem, idx) => {
          expect(sourceItems.at(idx)!).toHaveTextContent(mockSystem.name);
        });
      });
    });
  });

  describe('making selections', () => {
    describe('source selection', () => {
      it('should call `setFilters` with updated sources when adding a new source', async () => {
        const filters: Filters = {
          sources: [],
          systems: [],
          searchTerm: '',
        };
        setUseApplicationData({ filters });

        const { getAllByTestId } = await openDropDown();

        await act(async () => {
          const listItems = getAllByTestId('source-item');

          const firstItem = listItems.at(0)!;
          await userEvent.click(firstItem);
        });

        assertSetFilterUpdate(filters, {
          sources: ['source1'],
          systems: [],
          searchTerm: '',
        });
      });

      it('should add to existing sources when new sources selected', async () => {
        const filters: Filters = {
          sources: ['source1'],
          systems: [],
          searchTerm: '',
        };
        setUseApplicationData({ filters });

        const { getAllByTestId } = await openDropDown();

        await act(async () => {
          const listItems = getAllByTestId('source-item');

          const secondItem = listItems.at(1)!;
          await userEvent.click(secondItem);
        });

        assertSetFilterUpdate(filters, {
          sources: ['source1', 'source2'],
          systems: [],
          searchTerm: '',
        });
      });

      it('should remove source from filters when existing source selected', async () => {
        const filters: Filters = {
          sources: ['source1', 'source2'],
          systems: [],
          searchTerm: '',
        };
        setUseApplicationData({ filters });

        const { getAllByTestId } = await openDropDown();

        await act(async () => {
          const listItems = getAllByTestId('source-item');

          const firstItem = listItems.at(0)!;
          await userEvent.click(firstItem);
        });

        assertSetFilterUpdate(filters, {
          sources: ['source2'],
          systems: [],
          searchTerm: '',
        });
      });

      it('should not alter systems or search term', async () => {
        const filters: Filters = {
          sources: [],
          systems: [mockSystems[0].name],
          searchTerm: 'search term',
        };
        setUseApplicationData({ filters });

        const { getAllByTestId } = await openDropDown();

        await act(async () => {
          const listItems = getAllByTestId('source-item');

          const firstItem = listItems.at(0)!;
          await userEvent.click(firstItem);
        });

        assertSetFilterUpdate(filters, {
          sources: ['source1'],
          systems: [mockSystems[0].name],
          searchTerm: 'search term',
        });
      });
    });

    describe('system selection', () => {
      it('should call `setFilters` with updated systems when adding a new system', async () => {
        const filters: Filters = {
          sources: [],
          systems: [],
          searchTerm: '',
        };
        setUseApplicationData({ filters });

        const { getAllByTestId } = await openDropDown();

        await act(async () => {
          const listItems = getAllByTestId('system-item');

          const firstItem = listItems.at(0)!;
          await userEvent.click(firstItem);
        });

        assertSetFilterUpdate(filters, {
          sources: [],
          systems: [mockSystems[0].name],
          searchTerm: '',
        });
      });

      it('should add to existing sources when new sources selected', async () => {
        const filters: Filters = {
          sources: [],
          systems: [mockSystems[0].name],
          searchTerm: '',
        };
        setUseApplicationData({ filters });

        const { getAllByTestId } = await openDropDown();

        await act(async () => {
          const listItems = getAllByTestId('system-item');

          const secondItem = listItems.at(1)!;
          await userEvent.click(secondItem);
        });

        assertSetFilterUpdate(filters, {
          sources: [],
          systems: [mockSystems[0].name, mockSystems[1].name],
          searchTerm: '',
        });
      });

      it('should remove source from filters when existing source selected', async () => {
        const filters: Filters = {
          sources: [],
          systems: [mockSystems[0].name, mockSystems[1].name],
          searchTerm: '',
        };
        setUseApplicationData({ filters });

        const { getAllByTestId } = await openDropDown();

        await act(async () => {
          const listItems = getAllByTestId('system-item');

          const firstItem = listItems.at(0)!;
          await userEvent.click(firstItem);
        });

        assertSetFilterUpdate(filters, {
          sources: [],
          systems: [mockSystems[1].name],
          searchTerm: '',
        });
      });

      it('should not alter systems or search term', async () => {
        const filters: Filters = {
          sources: ['source1'],
          systems: [],
          searchTerm: 'search term',
        };
        setUseApplicationData({ filters });

        const { getAllByTestId } = await openDropDown();

        await act(async () => {
          const listItems = getAllByTestId('system-item');

          const firstItem = listItems.at(0)!;
          await userEvent.click(firstItem);
        });

        assertSetFilterUpdate(filters, {
          sources: ['source1'],
          systems: [mockSystems[0].name],
          searchTerm: 'search term',
        });
      });
    });
  });

  describe('clearing selections', () => {
    it('should not display clear button when no selection is made', () => {
      const filters: Filters = {
        sources: [],
        systems: [],
        searchTerm: '',
      };
      setUseApplicationData({ filters });

      const { queryByTestId } = render(<SourceAndSystemFilter />);

      const clearButton = queryByTestId('input-clear');
      expect(clearButton).not.toBeInTheDocument();
    });

    it('should display clear button when a selection is made', async () => {
      const filters: Filters = {
        sources: ['source1'],
        systems: [mockSystems[0].name],
        searchTerm: '',
      };
      setUseApplicationData({ filters });

      const { getByTestId } = render(<SourceAndSystemFilter />);

      const clearButton = getByTestId('input-clear');
      expect(clearButton).toHaveTextContent('Mock X component');
    });

    it('should call `setFilters` with empty source and systems when clicking the clear button', async () => {
      const filters: Filters = {
        sources: ['source1'],
        systems: [mockSystems[0].name],
        searchTerm: '',
      };
      setUseApplicationData({ filters });

      const { getByTestId } = render(<SourceAndSystemFilter />);

      await act(async () => {
        const clearButton = getByTestId('input-clear');
        await userEvent.click(clearButton);
      });

      assertSetFilterUpdate(filters, {
        sources: [],
        systems: [],
        searchTerm: '',
      });
    });

    it('should not affect search term when clicking the clear button', async () => {
      const filters: Filters = {
        sources: ['source1'],
        systems: [mockSystems[0].name],
        searchTerm: 'search term',
      };
      setUseApplicationData({ filters });

      const { getByTestId } = render(<SourceAndSystemFilter />);

      await act(async () => {
        const clearButton = getByTestId('input-clear');
        await userEvent.click(clearButton);
      });

      assertSetFilterUpdate(filters, {
        sources: [],
        systems: [],
        searchTerm: 'search term',
      });
    });
  });

  describe('clicking away', () => {
    it('should hide options when clicking away somewhere else in the document', async () => {
      const { container, getByRole, queryByTestId } = render(<SourceAndSystemFilter />);
      const sourceAndSystemFilter = getByRole('listbox');

      await act(async () => {
        await userEvent.click(sourceAndSystemFilter);
      });

      const listItemsBefore = queryByTestId('filter-options');
      expect(listItemsBefore).toBeVisible();

      await act(async () => {
        await userEvent.click(container);
      });

      const listItemsAfter = queryByTestId('filter-options');
      expect(listItemsAfter).not.toBeInTheDocument();
    });
  });
});
