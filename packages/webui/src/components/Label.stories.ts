import type { Meta, StoryObj } from '@storybook/react';

import Label from './Label';

const meta = {
  title: 'Example/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    label: 'Some Label',
  },
};
