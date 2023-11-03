import { cleanup, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { setUseApplicationData } from '@/testing/mockUseApplication';

import { TabContent, TabList, TabListItem } from './Tabs';

const Tabs = () => (
  <div>
    <TabList data-test-id="tab-list">
      <TabListItem id="foo" title="Foo" />
      <TabListItem id="bar" title="Bar" />
      <TabListItem id="baz" title="Baz" />
      <TabListItem id="qux" title="Qux" disabled />
    </TabList>
    <div className="py-2">
      <TabContent id="foo">Foo content</TabContent>
      <TabContent id="bar">Bar content</TabContent>
      <TabContent id="baz">Baz content</TabContent>
      <TabContent id="qux">Qux content</TabContent>
    </div>
  </div>
);

describe('Tabs', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders a tab item as expected', () => {
    const { getByTestId } = render(<TabListItem id="foo" title="Foo" data-test-id="tab-list-item" />);
    const link = getByTestId('tab-list-item');
    expect(link).toHaveAttribute('role', 'link');
    expect(link).toHaveAttribute('aria-disabled', 'false');
    expect(link).toHaveAttribute('href', '#foo');
  });

  it('renders a disabled tab item as expected', () => {
    const { getByTestId } = render(<TabListItem id="foo" title="Foo" data-test-id="tab-list-item" disabled />);
    const link = getByTestId('tab-list-item');
    expect(link).toHaveAttribute('role', 'link');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).not.toHaveAttribute('href', '#foo');
  });

  it('should handle changing tabs as expected', async () => {
    setUseApplicationData({ selectedTab: 'foo' });

    const { getByTestId } = render(<Tabs />);

    // TODO, check for changing content

    const tabList = getByTestId('tab-list');
    const tabs = within(tabList).getAllByRole('link');

    await userEvent.click(tabs.at(1)!);
    expect(global.window.location.hash).toBe('#bar');

    await userEvent.click(tabs.at(2)!);
    expect(global.window.location.hash).toBe('#baz');

    // Disabled tab, should not change the hash
    await userEvent.click(tabs.at(3)!);
    expect(global.window.location.hash).toBe('#baz');
  });
});
