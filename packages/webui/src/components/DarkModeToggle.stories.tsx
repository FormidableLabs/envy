import type { Meta, StoryObj } from '@storybook/react';

import DarkModeToggle from './DarkModeToggle';

const meta = {
  title: 'Example/DarkModeToggle',
  component: DarkModeToggle,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof DarkModeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {},
};
