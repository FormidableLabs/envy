import type { Meta, StoryObj } from '@storybook/react';

import Section from './Section';

const meta = {
  title: 'Example/Section',
  component: Section,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    className: 'w-96',
    title: 'Section Title',
    children: 'Contents',
  },
};
