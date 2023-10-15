import type { Meta, StoryObj } from '@storybook/react';

import ApplicationContextProvider from '@/context/ApplicationContext';

import TraceDetail from './TraceDetail';

const meta = {
  title: 'UI/TraceDetail',
  component: TraceDetail,
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
} satisfies Meta<typeof TraceDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    contentType: 'application/json',
  },
};
