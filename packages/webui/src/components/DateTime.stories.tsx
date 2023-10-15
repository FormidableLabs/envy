import type { Meta, StoryObj } from '@storybook/react';

import DateTime from './DateTime';

const meta = {
  title: 'Components/DateTime',
  component: DateTime,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof DateTime>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    time: 1629999999999,
  },
};
