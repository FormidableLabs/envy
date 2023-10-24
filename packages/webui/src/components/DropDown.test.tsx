import { act, cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { setUsePlatformData } from '@/testing/mockUsePlatform';

import DropDown, { DropDownItem } from './DropDown';

jest.mock('lucide-react', () => ({
  X: function MockX() {
    return <>Mock X component</>;
  },
  Check: function MockCheck() {
    return <>Mock Check component</>;
  },
}));

const items: DropDownItem[] = [
  { value: 'foo', label: 'Foo' },
  { value: 'bar', label: 'Bar' },
  { value: 'baz', label: 'Baz' },
];

describe('DropDown', () => {
  beforeEach(() => {
    setUsePlatformData('mac');
  });

  afterEach(() => {
    cleanup();
  });

  it('should render without error', () => {
    render(<DropDown items={items} />);
  });

  it('should render an dropDown with the role "listbox"', () => {
    const { getByRole } = render(<DropDown items={items} />);

    const dropDown = getByRole('listbox');
    expect(dropDown).toBeVisible();
  });

  describe('focus key', () => {
    it('should display mac-specific focus key if suppied', () => {
      setUsePlatformData('mac');

      const { getByTestId } = render(<DropDown items={items} focusKey="F" />);

      const focusKey = getByTestId('focus-key');
      expect(focusKey).toHaveTextContent('⌘F');
    });

    it('should display windows-specific focus key if suppied', () => {
      setUsePlatformData('windows');

      const { getByTestId } = render(<DropDown items={items} focusKey="F" />);

      const focusKey = getByTestId('focus-key');
      expect(focusKey).toHaveTextContent('CTRL+F');
    });
  });

  describe('with placeholder', () => {
    it('should display a placeholder in the listbox', () => {
      const { getByRole } = render(<DropDown items={items} placeholder="Select something..." />);

      const dropDown = getByRole('listbox');
      expect(dropDown).toHaveTextContent('Select something...');
    });
  });

  describe('keyboard shortcuts', () => {
    it('should not open list items when no focus key is supplied', () => {
      setUsePlatformData('mac');

      const { queryByTestId } = render(<DropDown items={items} />);

      const listItemsBefore = queryByTestId('list-items');
      expect(listItemsBefore).not.toBeInTheDocument();

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'F', metaKey: false });
        document.dispatchEvent(event);
      });

      const listItemsAfter = queryByTestId('list-items');
      expect(listItemsAfter).not.toBeInTheDocument();
    });

    it('should not open list items when focus key is used without special key', () => {
      setUsePlatformData('mac');

      const { queryByTestId } = render(<DropDown items={items} focusKey="F" />);

      const listItemsBefore = queryByTestId('list-items');
      expect(listItemsBefore).not.toBeInTheDocument();

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'F', metaKey: false });
        document.dispatchEvent(event);
      });

      const listItemsAfter = queryByTestId('list-items');
      expect(listItemsAfter).not.toBeInTheDocument();
    });

    it('should open list items when focus key is used with special key (mac)', () => {
      setUsePlatformData('mac');

      const { queryByTestId } = render(<DropDown items={items} focusKey="F" />);

      const listItemsBefore = queryByTestId('list-items');
      expect(listItemsBefore).not.toBeInTheDocument();

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'F', metaKey: true });
        document.dispatchEvent(event);
      });

      const listItemsAfter = queryByTestId('list-items');
      expect(listItemsAfter).toBeVisible();
    });

    it('should open list items when focus key is used with special key (windows)', () => {
      setUsePlatformData('windows');

      const { queryByTestId } = render(<DropDown items={items} focusKey="F" />);

      const listItemsBefore = queryByTestId('list-items');
      expect(listItemsBefore).not.toBeInTheDocument();

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'F', ctrlKey: true });
        document.dispatchEvent(event);
      });

      const listItemsAfter = queryByTestId('list-items');
      expect(listItemsAfter).toBeVisible();
    });

    it('should close list when escape key is used', async () => {
      setUsePlatformData('mac');

      const { getByRole, queryByTestId } = render(<DropDown items={items} focusKey="F" />);
      const dropDown = getByRole('listbox');

      await act(async () => {
        await userEvent.click(dropDown);
      });

      const listItemsBefore = queryByTestId('list-items');
      expect(listItemsBefore).toBeVisible();

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'escape' });
        document.dispatchEvent(event);
      });

      const listItemsAfter = queryByTestId('list-items');
      expect(listItemsAfter).not.toBeInTheDocument();
    });
  });

  describe('selecting items', () => {
    describe('single selection', () => {
      it('should display options when clicking on drop down', async () => {
        const { getByRole, getAllByTestId } = render(<DropDown items={items} />);
        const dropDown = getByRole('listbox');

        await act(async () => {
          await userEvent.click(dropDown);
        });

        const listItems = getAllByTestId('list-items-item');

        expect(listItems).toHaveLength(3);
        expect(listItems.at(0)!).toHaveTextContent('Foo');
        expect(listItems.at(1)!).toHaveTextContent('Bar');
        expect(listItems.at(2)!).toHaveTextContent('Baz');
      });

      it('should allow selection of a single list item', async () => {
        const { getByRole, getAllByTestId } = render(<DropDown items={items} />);
        const dropDown = getByRole('listbox');

        await act(async () => {
          await userEvent.click(dropDown);
        });

        await act(async () => {
          const listItems = getAllByTestId('list-items-item');
          const firstItem = listItems.at(0)!;

          await userEvent.click(firstItem);
        });

        const listSelectionItems = getAllByTestId('list-selection-item');
        expect(listSelectionItems).toHaveLength(1);
        expect(listSelectionItems.at(0)!).toHaveTextContent('Foo');
      });

      it('should hide options after making a selection', async () => {
        const { getByRole, getAllByTestId, queryByTestId } = render(<DropDown items={items} />);
        const dropDown = getByRole('listbox');

        await act(async () => {
          await userEvent.click(dropDown);
        });

        await act(async () => {
          const listItems = getAllByTestId('list-items-item');
          const firstItem = listItems.at(0)!;

          await userEvent.click(firstItem);
        });

        const listItems = queryByTestId('list-items');
        expect(listItems).not.toBeInTheDocument();
      });

      it('should overwrite selection when selection mode is not multiple', async () => {
        const { getByRole, getAllByTestId } = render(<DropDown items={items} />);
        const dropDown = getByRole('listbox');

        await act(async () => {
          await userEvent.click(dropDown);
        });

        await act(async () => {
          const listItems = getAllByTestId('list-items-item');
          const firstItem = listItems.at(0)!;
          await userEvent.click(firstItem);
        });

        await act(async () => {
          await userEvent.click(dropDown);
        });

        await act(async () => {
          const listItems = getAllByTestId('list-items-item');
          const secondItem = listItems.at(1)!;
          await userEvent.click(secondItem);
        });

        const listSelectionItems = getAllByTestId('list-selection-item');
        expect(listSelectionItems).toHaveLength(1);
        expect(listSelectionItems.at(0)!).toHaveTextContent('Bar');
      });
    });

    describe('multiple selection', () => {
      it('should allow selection of multiple items', async () => {
        const { getByRole, getAllByTestId } = render(<DropDown items={items} multiSelect />);
        const dropDown = getByRole('listbox');

        await act(async () => {
          await userEvent.click(dropDown);
        });

        await act(async () => {
          const listItems = getAllByTestId('list-items-item');

          const firstItem = listItems.at(0)!;
          await userEvent.click(firstItem);
        });

        await act(async () => {
          const listItems = getAllByTestId('list-items-item');

          const secondItem = listItems.at(1)!;
          await userEvent.click(secondItem);
        });

        const listSelectionItems = getAllByTestId('list-selection-item');
        expect(listSelectionItems).toHaveLength(2);
        expect(listSelectionItems.at(0)!).toHaveTextContent('Foo');
        expect(listSelectionItems.at(1)!).toHaveTextContent('Bar');
      });

      it('should allow selected items to be toggled off', async () => {
        const { getByRole, getAllByTestId } = render(<DropDown items={items} multiSelect />);
        const dropDown = getByRole('listbox');

        await act(async () => {
          await userEvent.click(dropDown);
        });

        await act(async () => {
          const listItems = getAllByTestId('list-items-item');
          const firstItem = listItems.at(0)!;
          await userEvent.click(firstItem);
        });

        await act(async () => {
          const listItems = getAllByTestId('list-items-item');
          const secondItem = listItems.at(1)!;
          await userEvent.click(secondItem);
        });

        await act(async () => {
          const listItems = getAllByTestId('list-items-item');
          const firstItem = listItems.at(0)!;
          await userEvent.click(firstItem);
        });

        const listSelectionItems = getAllByTestId('list-selection-item');
        expect(listSelectionItems).toHaveLength(1);
        expect(listSelectionItems.at(0)!).toHaveTextContent('Bar');
      });
    });

    describe('with label', () => {
      it('should display label before selections', async () => {
        const { getByRole, getAllByTestId } = render(<DropDown items={items} label="Selections:" />);
        const dropDown = getByRole('listbox');

        await act(async () => {
          await userEvent.click(dropDown);
        });

        await act(async () => {
          const listItems = getAllByTestId('list-items-item');
          const firstItem = listItems.at(0)!;

          await userEvent.click(firstItem);
        });

        const listSelectionItems = getAllByTestId('list-selection-item');
        const firstItem = listSelectionItems.at(0)!;

        expect(firstItem.previousSibling).toHaveTextContent('Selections:');
      });
    });
  });

  describe('with pre-selected items', () => {
    describe('with single selection', () => {
      it('should pre-select selected item', () => {
        const itemsWithSelection: DropDownItem[] = [
          { value: 'foo', label: 'Foo' },
          { value: 'bar', label: 'Bar', isSelected: true },
          { value: 'baz', label: 'Baz' },
        ];

        const { getAllByTestId } = render(<DropDown items={itemsWithSelection} />);

        const listSelectionItems = getAllByTestId('list-selection-item');
        expect(listSelectionItems).toHaveLength(1);
        expect(listSelectionItems.at(0)!).toHaveTextContent('Bar');
      });

      it('should pre-select first selected item', () => {
        const itemsWithSelection: DropDownItem[] = [
          { value: 'foo', label: 'Foo' },
          { value: 'bar', label: 'Bar', isSelected: true },
          { value: 'baz', label: 'Baz', isSelected: true },
        ];

        const { getAllByTestId } = render(<DropDown items={itemsWithSelection} />);

        const listSelectionItems = getAllByTestId('list-selection-item');
        expect(listSelectionItems).toHaveLength(1);
        expect(listSelectionItems.at(0)!).toHaveTextContent('Bar');
      });
    });

    describe('with multiple selection', () => {
      it('should pre-select selected item', () => {
        const itemsWithSelection: DropDownItem[] = [
          { value: 'foo', label: 'Foo' },
          { value: 'bar', label: 'Bar', isSelected: true },
          { value: 'baz', label: 'Baz' },
        ];

        const { getAllByTestId } = render(<DropDown items={itemsWithSelection} multiSelect />);

        const listSelectionItems = getAllByTestId('list-selection-item');
        expect(listSelectionItems).toHaveLength(1);
        expect(listSelectionItems.at(0)!).toHaveTextContent('Bar');
      });

      it('should pre-select multiple selected items', () => {
        const itemsWithSelection: DropDownItem[] = [
          { value: 'foo', label: 'Foo' },
          { value: 'bar', label: 'Bar', isSelected: true },
          { value: 'baz', label: 'Baz', isSelected: true },
        ];

        const { getAllByTestId } = render(<DropDown items={itemsWithSelection} multiSelect />);

        const listSelectionItems = getAllByTestId('list-selection-item');
        expect(listSelectionItems).toHaveLength(2);
        expect(listSelectionItems.at(0)!).toHaveTextContent('Bar');
        expect(listSelectionItems.at(1)!).toHaveTextContent('Baz');
      });
    });
  });

  describe('with no item labels', () => {
    const itemsWithIcons = [{ value: 'foo' }, { value: 'bar' }, { value: 'baz' }];

    it('should display value as label in options', async () => {
      const { getByRole, getAllByTestId } = render(<DropDown items={itemsWithIcons} multiSelect />);
      const dropDown = getByRole('listbox');

      await act(async () => {
        await userEvent.click(dropDown);
      });

      const listItems = getAllByTestId('list-items-item');

      expect(listItems).toHaveLength(3);
      expect(listItems.at(0)!).toHaveTextContent('foo');
      expect(listItems.at(1)!).toHaveTextContent('bar');
      expect(listItems.at(2)!).toHaveTextContent('baz');
    });

    it('should display value instead of label for selected items', async () => {
      const { getByRole, getAllByTestId } = render(<DropDown items={itemsWithIcons} multiSelect />);
      const dropDown = getByRole('listbox');

      await act(async () => {
        await userEvent.click(dropDown);
      });

      await act(async () => {
        const listItems = getAllByTestId('list-items-item');

        const firstItem = listItems.at(0)!;
        await userEvent.click(firstItem);
      });

      await act(async () => {
        const listItems = getAllByTestId('list-items-item');

        const secondItem = listItems.at(1)!;
        await userEvent.click(secondItem);
      });

      const listSelectionItems = getAllByTestId('list-selection-item');

      expect(listSelectionItems).toHaveLength(2);
      expect(listSelectionItems.at(0)!).toHaveTextContent('foo');
      expect(listSelectionItems.at(1)!).toHaveTextContent('bar');
    });
  });

  describe('with item icons', () => {
    const itemsWithIcons = [
      { value: 'foo', label: 'Foo', icon: 'foo.jpg' },
      { value: 'bar', label: 'Bar', icon: 'bar.jpg' },
      { value: 'baz', label: 'Baz', icon: 'baz.jpg' },
    ];

    it('should display icons alongside list items', async () => {
      const { getByRole, getByTestId } = render(<DropDown items={itemsWithIcons} multiSelect />);
      const dropDown = getByRole('listbox');

      await act(async () => {
        await userEvent.click(dropDown);
      });

      const listItems = getByTestId('list-items');
      const images = listItems.querySelectorAll('img');

      expect(images).toHaveLength(3);
      expect(images.item(0)!).toHaveAttribute('src', 'foo.jpg');
      expect(images.item(0)!.nextSibling).toHaveTextContent('Foo');

      expect(images.item(1)!).toHaveAttribute('src', 'bar.jpg');
      expect(images.item(1)!.nextSibling).toHaveTextContent('Bar');

      expect(images.item(2)!).toHaveAttribute('src', 'baz.jpg');
      expect(images.item(2)!.nextSibling).toHaveTextContent('Baz');
    });

    it('should display icons instead of labels for selected items', async () => {
      const { getByRole, getAllByTestId } = render(<DropDown items={itemsWithIcons} multiSelect />);
      const dropDown = getByRole('listbox');

      await act(async () => {
        await userEvent.click(dropDown);
      });

      await act(async () => {
        const listItems = getAllByTestId('list-items-item');

        const firstItem = listItems.at(0)!;
        await userEvent.click(firstItem);
      });

      await act(async () => {
        const listItems = getAllByTestId('list-items-item');

        const secondItem = listItems.at(1)!;
        await userEvent.click(secondItem);
      });

      const listSelectionItems = getAllByTestId('list-selection-item');
      expect(listSelectionItems).toHaveLength(2);

      expect(listSelectionItems.at(0)!.querySelector('img')).toBeVisible();
      expect(listSelectionItems.at(0)!.querySelector('img')).toHaveAttribute('src', 'foo.jpg');
      expect(listSelectionItems.at(0)!.textContent).toEqual('');

      expect(listSelectionItems.at(1)!.querySelector('img')).toBeVisible();
      expect(listSelectionItems.at(1)!.querySelector('img')).toHaveAttribute('src', 'bar.jpg');
      expect(listSelectionItems.at(1)!.textContent).toEqual('');
    });
  });

  describe('clear button', () => {
    it('should not display clear button when no selectin is made', () => {
      const { queryByTestId } = render(<DropDown items={items} />);

      const clearButton = queryByTestId('input-clear');
      expect(clearButton).not.toBeInTheDocument();
    });

    it('should display clear button when a selection is made', async () => {
      const { getByRole, getByTestId, getAllByTestId } = render(<DropDown items={items} />);
      const dropDown = getByRole('listbox');

      await act(async () => {
        await userEvent.click(dropDown);
      });

      await act(async () => {
        const listItems = getAllByTestId('list-items-item');
        const firstItem = listItems.at(0)!;
        await userEvent.click(firstItem);
      });

      const clearButton = getByTestId('input-clear');
      expect(clearButton).toHaveTextContent('Mock X component');
    });

    it('should clear list when clicked', async () => {
      const { getByRole, getByTestId, getAllByTestId, queryAllByTestId } = render(<DropDown items={items} />);
      const dropDown = getByRole('listbox');

      await act(async () => {
        await userEvent.click(dropDown);
      });

      await act(async () => {
        const listItems = getAllByTestId('list-items-item');
        const firstItem = listItems.at(0)!;
        await userEvent.click(firstItem);
      });

      await act(async () => {
        const clearButton = getByTestId('input-clear');
        await userEvent.click(clearButton);
      });

      const listSelectionItems = queryAllByTestId('list-selection-item');
      expect(listSelectionItems).toHaveLength(0);
    });
  });

  describe('clicking away', () => {
    it('should hide options when clicking away somewhere else in the document', async () => {
      const { container, getByRole, queryByTestId } = render(<DropDown items={items} />);
      const dropDown = getByRole('listbox');

      await act(async () => {
        await userEvent.click(dropDown);
      });

      const listItemsBefore = queryByTestId('list-items');
      expect(listItemsBefore).toBeVisible();

      await act(async () => {
        await userEvent.click(container);
      });

      const listItemsAfter = queryByTestId('list-items');
      expect(listItemsAfter).not.toBeInTheDocument();
    });
  });

  describe('onChange callback', () => {
    let onChange: jest.Mock;

    beforeEach(() => {
      onChange = jest.fn();
    });

    it('should trigger onChange callback immediately making a selection', async () => {
      const { getByRole, getAllByTestId } = render(<DropDown items={items} onChange={onChange} />);
      const dropDown = getByRole('listbox');

      await act(async () => {
        await userEvent.click(dropDown);
      });

      await act(async () => {
        const listItems = getAllByTestId('list-items-item');
        const firstItem = listItems.at(0)!;
        await userEvent.click(firstItem);
      });

      expect(onChange).toHaveBeenCalledWith(['foo']);
    });

    it('should trigger onChange callback when updating selection', async () => {
      const { getByRole, getAllByTestId } = render(<DropDown items={items} onChange={onChange} />);
      const dropDown = getByRole('listbox');

      await act(async () => {
        await userEvent.click(dropDown);
      });

      await act(async () => {
        const listItems = getAllByTestId('list-items-item');
        const firstItem = listItems.at(0)!;
        await userEvent.click(firstItem);
      });

      await act(async () => {
        await userEvent.click(dropDown);
      });

      await act(async () => {
        const listItems = getAllByTestId('list-items-item');
        const secondItem = listItems.at(1)!;
        await userEvent.click(secondItem);
      });

      expect(onChange).toHaveBeenCalledWith(['bar']);
    });

    it('should trigger onChange callback with multiple selections', async () => {
      const { getByRole, getAllByTestId } = render(<DropDown items={items} multiSelect onChange={onChange} />);
      const dropDown = getByRole('listbox');

      await act(async () => {
        await userEvent.click(dropDown);
      });

      await act(async () => {
        const listItems = getAllByTestId('list-items-item');
        const firstItem = listItems.at(0)!;
        await userEvent.click(firstItem);
      });

      await act(async () => {
        const listItems = getAllByTestId('list-items-item');
        const secondItem = listItems.at(1)!;
        await userEvent.click(secondItem);
      });

      expect(onChange).toHaveBeenCalledWith(['foo', 'bar']);
    });

    it('should trigger onChange callback when selections are unselected', async () => {
      const { getByRole, getAllByTestId } = render(<DropDown items={items} multiSelect onChange={onChange} />);
      const dropDown = getByRole('listbox');

      await act(async () => {
        await userEvent.click(dropDown);
      });

      await act(async () => {
        const listItems = getAllByTestId('list-items-item');
        const firstItem = listItems.at(0)!;
        await userEvent.click(firstItem);
      });

      expect(onChange).toHaveBeenCalledWith(['foo']);

      await act(async () => {
        const listItems = getAllByTestId('list-items-item');
        const secondItem = listItems.at(1)!;
        await userEvent.click(secondItem);
      });

      expect(onChange).toHaveBeenCalledWith(['foo', 'bar']);

      await act(async () => {
        const listItems = getAllByTestId('list-items-item');
        const firstItem = listItems.at(0)!;
        await userEvent.click(firstItem);
      });

      expect(onChange).toHaveBeenCalledWith(['bar']);
    });

    it('should trigger onChange callback immediately when clear button is clicked', async () => {
      const { getByRole, getByTestId, getAllByTestId } = render(<DropDown items={items} onChange={onChange} />);
      const dropDown = getByRole('listbox');

      await act(async () => {
        await userEvent.click(dropDown);
      });

      await act(async () => {
        const listItems = getAllByTestId('list-items-item');
        const firstItem = listItems.at(0)!;
        await userEvent.click(firstItem);
      });

      expect(onChange).toHaveBeenCalledWith(['foo']);

      const clearButton = getByTestId('input-clear');
      await userEvent.click(clearButton);

      expect(onChange).toHaveBeenCalledWith([]);
    });
  });
});
