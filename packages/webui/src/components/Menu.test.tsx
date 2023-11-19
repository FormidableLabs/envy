import { act, cleanup, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { setUsePlatformData } from '@/testing/mockUsePlatform';

import Menu, { MenuItem } from './Menu';

const items: MenuItem[] = [
  { label: 'Foo', callback: () => void 0 },
  { label: 'Bar', callback: () => void 0 },
  { label: 'Baz', callback: () => void 0 },
];

describe('Menu', () => {
  beforeEach(() => {
    setUsePlatformData('mac');
  });

  afterEach(() => {
    cleanup();
  });

  it('should render without error', () => {
    render(<Menu label="Menu" items={items} />);
  });

  it('should render an menu with the role "menu"', () => {
    const { getByRole } = render(<Menu label="Menu" items={items} />);

    const menu = getByRole('menu');
    expect(menu).toBeVisible();
  });

  it('should display the label in the menu button', () => {
    const { getByRole } = render(<Menu label="Menu" items={items} />);

    const menu = getByRole('menu');
    expect(menu).toHaveTextContent('Menu');
  });

  describe('focus key', () => {
    it('should display mac-specific focus key if suppied', () => {
      setUsePlatformData('mac');

      const { getByTestId } = render(<Menu label="Menu" items={items} focusKey="F" />);

      const focusKey = getByTestId('focus-key');
      expect(focusKey).toHaveTextContent('⌘F');
    });

    it('should display windows-specific focus key if suppied', () => {
      setUsePlatformData('windows');

      const { getByTestId } = render(<Menu label="Menu" items={items} focusKey="F" />);

      const focusKey = getByTestId('focus-key');
      expect(focusKey).toHaveTextContent('CTRL+F');
    });
  });

  describe('keyboard shortcuts', () => {
    it('should not open list items when no focus key is supplied', () => {
      setUsePlatformData('mac');

      const { queryByTestId } = render(<Menu label="Menu" items={items} />);

      const listItemsBefore = queryByTestId('menu-items');
      expect(listItemsBefore).not.toBeInTheDocument();

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'F', metaKey: false });
        document.dispatchEvent(event);
      });

      const listItemsAfter = queryByTestId('menu-items');
      expect(listItemsAfter).not.toBeInTheDocument();
    });

    it('should not open list items when focus key is used without special key', () => {
      setUsePlatformData('mac');

      const { queryByTestId } = render(<Menu label="Menu" items={items} focusKey="F" />);

      const listItemsBefore = queryByTestId('menu-items');
      expect(listItemsBefore).not.toBeInTheDocument();

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'F', metaKey: false });
        document.dispatchEvent(event);
      });

      const listItemsAfter = queryByTestId('menu-items');
      expect(listItemsAfter).not.toBeInTheDocument();
    });

    it('should open list items when focus key is used with special key (mac)', () => {
      setUsePlatformData('mac');

      const { queryByTestId } = render(<Menu label="Menu" items={items} focusKey="F" />);

      const listItemsBefore = queryByTestId('menu-items');
      expect(listItemsBefore).not.toBeInTheDocument();

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'F', metaKey: true });
        document.dispatchEvent(event);
      });

      const listItemsAfter = queryByTestId('menu-items');
      expect(listItemsAfter).toBeVisible();
    });

    it('should open list items when focus key is used with special key (windows)', () => {
      setUsePlatformData('windows');

      const { queryByTestId } = render(<Menu label="Menu" items={items} focusKey="F" />);

      const listItemsBefore = queryByTestId('menu-items');
      expect(listItemsBefore).not.toBeInTheDocument();

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'F', ctrlKey: true });
        document.dispatchEvent(event);
      });

      const listItemsAfter = queryByTestId('menu-items');
      expect(listItemsAfter).toBeVisible();
    });

    it('should close list when escape key is used', async () => {
      setUsePlatformData('mac');

      const { getByRole, queryByTestId } = render(<Menu label="Menu" items={items} focusKey="F" />);
      const menu = getByRole('menu');

      await act(async () => {
        await userEvent.click(menu);
      });

      const listItemsBefore = queryByTestId('menu-items');
      expect(listItemsBefore).toBeVisible();

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'escape' });
        document.dispatchEvent(event);
      });

      const listItemsAfter = queryByTestId('menu-items');
      expect(listItemsAfter).not.toBeInTheDocument();
    });
  });

  describe('menu items', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const fn3 = jest.fn();

    let itemsWithCallback: MenuItem[];

    beforeEach(() => {
      itemsWithCallback = [
        { label: 'Foo', callback: fn1 },
        { label: 'Bar', callback: fn2 },
        { label: 'Baz', callback: fn3 },
      ];
    });

    it('should display items when clicking on menu', async () => {
      const { getByRole, getAllByTestId } = render(<Menu label="Menu" items={itemsWithCallback} />);
      const menu = getByRole('menu');

      await act(async () => {
        await userEvent.click(menu);
      });

      const listItems = getAllByTestId('menu-items-item');

      expect(listItems).toHaveLength(3);
      expect(listItems.at(0)!).toHaveTextContent('Foo');
      expect(listItems.at(1)!).toHaveTextContent('Bar');
      expect(listItems.at(2)!).toHaveTextContent('Baz');
    });

    it('should trigger callback of item when clicked', async () => {
      const { getByRole, getAllByTestId } = render(<Menu label="Menu" items={itemsWithCallback} />);
      const menu = getByRole('menu');

      await act(async () => {
        await userEvent.click(menu);
      });

      await act(async () => {
        const listItems = getAllByTestId('menu-items-item');
        const firstItem = listItems.at(0)!;

        await userEvent.click(firstItem);
      });

      expect(fn1).toHaveBeenCalled();
      expect(fn2).not.toHaveBeenCalled();
      expect(fn3).not.toHaveBeenCalled();
    });

    it('should include event object in callback when clicked', async () => {
      const { getByRole, getAllByTestId } = render(<Menu label="Menu" items={itemsWithCallback} />);
      const menu = getByRole('menu');

      await act(async () => {
        await userEvent.click(menu);
      });

      await act(async () => {
        const user = userEvent.setup();

        const listItems = getAllByTestId('menu-items-item');
        const firstItem = listItems.at(0)!;

        await user.keyboard('{Shift>}');
        await user.keyboard('{Meta>}');
        await user.click(firstItem);
        await user.keyboard('{/Shift}');
        await user.keyboard('{/Meta}');
      });

      expect(fn1).toHaveBeenCalledWith(expect.objectContaining({ shiftKey: true, metaKey: true }));
    });

    it('should hide items after clicked', async () => {
      const { getByRole, getAllByTestId, queryByTestId } = render(<Menu label="Menu" items={items} />);
      const menu = getByRole('menu');

      await act(async () => {
        await userEvent.click(menu);
      });

      await act(async () => {
        const listItems = getAllByTestId('menu-items-item');
        const firstItem = listItems.at(0)!;

        await userEvent.click(firstItem);
      });

      const listItems = queryByTestId('menu-items');
      expect(listItems).not.toBeInTheDocument();
    });
  });

  describe('with item descriptions', () => {
    const itemsWithDescriptions = [
      { label: 'Foo', description: 'Foo description', callback: () => void 0 },
      { label: 'Bar', description: 'Bar description', callback: () => void 0 },
      { label: 'Baz', description: 'Baz description', callback: () => void 0 },
    ];

    it('should display icons alongside list items', async () => {
      const { getByRole, getByTestId } = render(<Menu label="Menu" items={itemsWithDescriptions} />);
      const menu = getByRole('menu');

      await act(async () => {
        await userEvent.click(menu);
      });

      const listItems = getByTestId('menu-items');
      const descriptions = within(listItems).getAllByTestId('description');

      expect(descriptions).toHaveLength(3);
      expect(descriptions.at(0)!).toHaveTextContent('Foo description');
      expect(descriptions.at(0)!.previousSibling).toHaveTextContent('Foo');

      expect(descriptions.at(1)!).toHaveTextContent('Bar description');
      expect(descriptions.at(1)!.previousSibling).toHaveTextContent('Bar');

      expect(descriptions.at(2)!).toHaveTextContent('Baz description');
      expect(descriptions.at(2)!.previousSibling).toHaveTextContent('Baz');
    });
  });

  describe('clicking away', () => {
    it('should hide options when clicking away somewhere else in the document', async () => {
      const { container, getByRole, queryByTestId } = render(<Menu label="Menu" items={items} />);
      const menu = getByRole('menu');

      await act(async () => {
        await userEvent.click(menu);
      });

      const listItemsBefore = queryByTestId('menu-items');
      expect(listItemsBefore).toBeVisible();

      await act(async () => {
        await userEvent.click(container);
      });

      const listItemsAfter = queryByTestId('menu-items');
      expect(listItemsAfter).not.toBeInTheDocument();
    });
  });
});
