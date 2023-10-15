import type { Meta, StoryObj } from '@storybook/react';

import TimingsDiagram from './TimingsDiagram';

const meta = {
  title: 'UI/TimingsDiagram',
  component: TimingsDiagram,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div style={{ width: 500 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TimingsDiagram>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    timings: {
      blocked: 200,
      connect: 120,
      dns: 50,
      receive: 300,
      send: 200,
      ssl: 100,
      wait: 200,
    },
  },
};
