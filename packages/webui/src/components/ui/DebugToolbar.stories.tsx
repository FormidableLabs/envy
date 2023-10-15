import type { Meta, StoryObj } from '@storybook/react';

import DebugToolbar from './DebugToolbar';

const meta = {
  title: 'UI/DebugToolbar',
  component: DebugToolbar,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DebugToolbar>;

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
