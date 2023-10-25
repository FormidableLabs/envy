import type { Meta, StoryObj } from '@storybook/react';
import { Trash } from 'lucide-react';

import { default as ButtonMeta } from './Button.stories';
import Button from './IconButton';

const meta = {
  title: 'Components/Icon Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: ButtonMeta.argTypes,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    children: 'Trash Can',
    Icon: Trash,
  },
};
