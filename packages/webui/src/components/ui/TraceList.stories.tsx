import type { Meta, StoryObj } from '@storybook/react';

import ApplicationContextProvider from '@/context/ApplicationContext';

import TraceList from './TraceList';

const meta = {
  title: 'UI/TraceList',
  component: TraceList,
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
} satisfies Meta<typeof TraceList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Connecting: Story = {
  args: {},
};
