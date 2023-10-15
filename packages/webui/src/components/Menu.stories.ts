import type { Meta, StoryObj } from '@storybook/react';

import Menu from './Menu';

const meta = {
  title: 'Example/Menu',
  component: Menu,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    label: 'Some Label',
    items: [
      {
        label: 'Item 1',
        callback: () => {
          // eslint-disable-next-line no-console
          console.log('Item 1 clicked');
        },
      },
      {
        label: 'Item 2',
        callback: () => {
          // eslint-disable-next-line no-console
          console.log('Item 2 clicked');
        },
      },
    ],
  },
};
