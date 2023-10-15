import type { Meta, StoryObj } from '@storybook/react';

import Loading from './Loading';

const meta = {
  title: 'Example/Loading',
  component: Loading,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    size: 8,
  },
};
