import type { Meta, StoryObj } from '@storybook/react';

import SearchInput from './SearchInput';

const meta = {
  title: 'Example/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    className: 'w-96',
  },
};
