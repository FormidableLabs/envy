import type { Meta, StoryObj } from '@storybook/react';

import ApplicationContextProvider from '@/context/ApplicationContext';

import FiltersAndActions from './FiltersAndActions';

const meta = {
  title: 'UI/FiltersAndActions',
  component: FiltersAndActions,
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
} satisfies Meta<typeof FiltersAndActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {},
};
