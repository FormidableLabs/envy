import type { Meta, StoryObj } from '@storybook/react';

import Button from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      options: ['small', 'standard', 'large'],
      control: { type: 'select' },
    },
    border: {
      options: ['standard', 'ghost'],
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    children: 'Standard Button',
    size: 'standard',
    border: 'standard',
  },
};
