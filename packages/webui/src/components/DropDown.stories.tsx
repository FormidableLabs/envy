import type { Meta, StoryObj } from '@storybook/react';

import DropDown from './DropDown';

const meta = {
  title: 'Example/Dropdown',
  component: DropDown,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof DropDown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    className: 'w-64',
    label: 'Selected',
    placeholder: 'Choose Something',
    items: [
      {
        label: 'Item 1',
        value: 'item1',
      },
      {
        label: 'Item 2',
        value: 'item2',
      },
      {
        label: 'Item 3',
        value: 'item3',
      },
    ],
  },
};
