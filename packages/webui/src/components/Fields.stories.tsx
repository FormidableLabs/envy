import type { Meta, StoryObj } from '@storybook/react';

import Fields, { Field } from './Fields';

const meta = {
  title: 'Components/Fields',
  component: Fields,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Fields>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  render: () => (
    <Fields>
      <Field label="Foo">Bar</Field>
      <Field label="Gut">Shm</Field>
      <Field label="Mer">Lep</Field>
    </Fields>
  ),
  args: {
    children: [],
  },
};
