import { act, cleanup, fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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

jest.mock('@/systems', () => ({
  get systems() {
    return [
      new (class {
        name = 'System one';
      })(),
      new (class {
        name = 'System two';
      })(),
      new (class {
        name = 'System three';
      })(),
      new (class {
        name = 'Default';
      })(),
    ];
  },
}));

describe('FiltersAndActions', () => {
  let filterTracesFn: jest.Mock;
  let clearTracesFn: jest.Mock;

  beforeEach(() => {
    filterTracesFn = jest.fn();
    clearTracesFn = jest.fn();

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
      const options = dropDown.querySelectorAll('option');

      expect(options).toHaveLength(3);
    });
    it('should list all systems except the "Default" one', () => {
      const { getByTestId } = render(<FiltersAndActions />);

      const dropDown = getByTestId('mock-drop-down');
      const options = dropDown.querySelectorAll('option');

      expect(options).toHaveLength(3);
      expect(options.item(0)!).toHaveTextContent('System one');
      expect(options.item(1)!).toHaveTextContent('System two');
      expect(options.item(2)!).toHaveTextContent('System three');
    });

    it('should call `filterTraces` with selected systems when value changes', async () => {
      const { getByTestId } = render(<FiltersAndActions />);

      const dropDown = getByTestId('mock-drop-down');

      await act(async () => {
        await userEvent.selectOptions(dropDown, 'System one');
      });

      expect(filterTracesFn).toHaveBeenCalledWith(['System one'], '');
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
