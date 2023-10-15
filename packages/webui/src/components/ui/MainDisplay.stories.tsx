import type { Meta, StoryObj } from '@storybook/react';

import ApplicationContextProvider from '@/context/ApplicationContext';

import MainDisplay from './MainDisplay';

const meta = {
  title: 'UI/MainDisplay',
  component: MainDisplay,
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
} satisfies Meta<typeof MainDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {},
};
