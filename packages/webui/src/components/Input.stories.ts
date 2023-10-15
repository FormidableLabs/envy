import type { Meta, StoryObj } from '@storybook/react';

import Input from './Input';

const meta = {
  title: 'Example/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    className: 'w-96',
  },
};
