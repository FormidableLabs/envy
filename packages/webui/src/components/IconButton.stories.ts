import type { Meta, StoryObj } from '@storybook/react';
import { HiTrash } from 'react-icons/hi';

import Button from './IconButton';

const meta = {
  title: 'Components/Icon Button',
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
    children: 'Trash Can',
    Icon: HiTrash,
  },
};
