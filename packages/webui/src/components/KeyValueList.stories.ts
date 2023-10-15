import type { Meta, StoryObj } from '@storybook/react';

import KeyValueList from './KeyValueList';

const meta = {
  title: 'Components/KeyValueList',
  component: KeyValueList,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof KeyValueList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    label: 'Some Label',
    keyValuePairs: [
      ['Key 1', 'Value 1'],
      ['Key 2', 'Value 2'],
    ],
  },
};
