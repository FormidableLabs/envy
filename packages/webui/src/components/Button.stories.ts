import type { Meta, StoryObj } from '@storybook/react';
import { Trash } from 'lucide-react';

import Button from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    selected: {
      control: { type: 'boolean' },
    },
    size: {
      options: ['small', 'standard'],
      control: { type: 'select' },
    },
    border: {
      options: ['standard', 'none'],
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextOnly: Story = {
  args: {
    children: 'Standard Button',
    size: 'standard',
    border: 'standard',
  },
};

export const IconOnly: Story = {
  args: {
    Icon: Trash,
  },
};

export const IconButton: Story = {
  args: {
    children: 'Trash Can',
    Icon: Trash,
  },
};
