import type { Meta, StoryObj } from '@storybook/react';

import ApplicationContextProvider from '@/context/ApplicationContext';

import { TabContent, TabList, TabListItem } from './Tabs';

const meta = {
  title: 'UI/Tabs',
  component: TabList,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <ApplicationContextProvider>
        <Story />
      </ApplicationContextProvider>
    ),
  ],
} satisfies Meta<typeof TabList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  render: () => (
    <div>
      <TabList>
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
  ),
  args: {
    children: [],
  },
};
