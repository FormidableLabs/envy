import type { Meta, StoryObj } from '@storybook/react';

import Authorization from './Authorization';

const meta = {
  title: 'Components/Authorization',
  component: Authorization,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Authorization>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    value:
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.vqb33-7FqzFWPNlr0ElW1v2RjJRZBel3CdDHBWD7y_o',
  },
};
