import type { Meta, StoryObj } from '@storybook/react';

import Button from './Button';

const meta = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      options: ['standard', 'action', 'ghost', 'danger'],
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    type: 'standard',
    children: 'Standard Button',
    short: false,
  },
};
