import type { Meta, StoryObj } from '@storybook/react';

import ApplicationContextProvider from '@/context/ApplicationContext';

import ConnectionStatus from './ConnectionStatus';

const meta = {
  title: 'UI/ConnectionStatus',
  component: ConnectionStatus,
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
} satisfies Meta<typeof ConnectionStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Connected: Story = {};
