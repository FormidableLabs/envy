import type { Meta, StoryObj } from '@storybook/react';

import ApplicationContextProvider from '@/context/ApplicationContext';

import Header from './Header';

const meta = {
  title: 'UI/Header',
  component: Header,
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
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {},
};
