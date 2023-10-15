import type { Meta, StoryObj } from '@storybook/react';

import Toggle from './ToggleSwitch';

const meta = {
  title: 'Components/Toggle Switch',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    label: 'Autoscroll',
    labelPosition: 'left',
  },
};
