import type { Meta, StoryObj } from '@storybook/react';

import Code from './Code';

const meta = {
  title: 'Example/Code',
  component: Code,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    children: `import React from 'react';
    import { render } from 'react-dom';
    
    function SomeComponent({ children }: { children: React.ReactNode }) {
      return <div>Some Component</div>;
    }`,
  },
};
