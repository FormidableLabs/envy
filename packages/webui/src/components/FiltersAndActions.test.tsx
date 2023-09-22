import { act, cleanup, fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { setupMockSystems } from '@/testing/mockSystems';
import { setUseApplicationData } from '@/testing/mockUseApplication';

import FiltersAndActions from './FiltersAndActions';
import { DropDownItem } from './ui/DropDown';

jest.mock('@/components/ui', () => ({
  DropDown: function ({ items, onChange }: any) {
    return (
      <select
        data-test-id="mock-drop-down"
        onChange={e => {
          // simulate returning array of selected systems
          onChange([e.target.value]);
        }}
      >
        {items.map((item: DropDownItem) => (
          <option key={item.value} value={item.value}>
            {item.value}
          </option>
        ))}
      </select>
    );
  },
  IconButton: function ({ onClick }: any) {
    return <button data-test-id="mock-icon-button" onClick={onClick} />;
  },
  SearchInput: function ({ onChange }: any) {
    return <input data-test-id="mock-search-input" onChange={e => onChange(e.target.value)} />;
  },
}));

describe('FiltersAndActions', () => {
  let filterTracesFn: jest.Mock;
  let clearTracesFn: jest.Mock;

  beforeEach(() => {
    filterTracesFn = jest.fn();
    clearTracesFn = jest.fn();

    setupMockSystems();

    setUseApplicationData({
      filterTraces: filterTracesFn,
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

  describe('systems', () => {
    it('should render DropDown component', () => {
      const { getByTestId } = render(<FiltersAndActions />);

      const dropDown = getByTestId('mock-drop-down');
      expect(dropDown).toBeVisible();
    });

    it('should list all registered systems', () => {
      const { getByTestId } = render(<FiltersAndActions />);

      const dropDown = getByTestId('mock-drop-down');
      const options = dropDown.querySelectorAll('option');

      // see /src/testing/mockSystems.ts for where these test systems are registered
      expect(options).toHaveLength(4);
      expect(options.item(0)!).toHaveTextContent('Foo');
      expect(options.item(1)!).toHaveTextContent('Bar');
      expect(options.item(2)!).toHaveTextContent('Fallback');
      expect(options.item(3)!).toHaveTextContent('OddNumbers');
    });

    it('should call `filterTraces` with selected systems when value changes', async () => {
      const { getByTestId } = render(<FiltersAndActions />);

      const dropDown = getByTestId('mock-drop-down');

      await act(async () => {
        await userEvent.selectOptions(dropDown, 'Foo');
      });

      expect(filterTracesFn).toHaveBeenCalledWith(['Foo'], '');
    });
  });

  describe('search term', () => {
    it('should render SearchInput component', () => {
      const { getByTestId } = render(<FiltersAndActions />);

      const searchInput = getByTestId('mock-search-input');
      expect(searchInput).toBeVisible();
    });

    it('should call `filterTraces` with search term when value changes', () => {
      const { getByTestId } = render(<FiltersAndActions />);

      const searchInput = getByTestId('mock-search-input');

      fireEvent.change(searchInput, {
        target: { value: '/foo' },
      });

      expect(filterTracesFn).toHaveBeenCalledWith([], '/foo');
    });
  });

  describe('clear button', () => {
    it('should render IconButton component', () => {
      const { getByTestId } = render(<FiltersAndActions />);

      const clearButton = getByTestId('mock-icon-button');
      expect(clearButton).toBeVisible();
    });

    it('should call `clearTraces` when clicked', async () => {
      const { getByTestId } = render(<FiltersAndActions />);

      await act(async () => {
        const clearButton = getByTestId('mock-icon-button');
        await userEvent.click(clearButton);
      });

      expect(clearTracesFn).toHaveBeenCalled();
    });
  });
});
