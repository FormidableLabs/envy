import type { Meta, StoryObj } from '@storybook/react';

import DefaultSystem from '@/systems/Default';
import GraphqlSystem from '@/systems/GraphQL';
import SanitySystem from '@/systems/Sanity';

import TraceRequestData from './TraceRequestData';

const meta = {
  title: 'UI/TraceRequestData',
  component: TraceRequestData,
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
} satisfies Meta<typeof TraceRequestData>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RestRequest: Story = {
  args: {
    iconPath: new DefaultSystem().getIconUri(),
    path: '/api/v1/trace/1234?name=test&options=br|hk|desc',
    data: 'name=test&options=br|hk|desc',
    hostName: 'https://api.myservices.com',
  },
};

export const GraphqlRequest: Story = {
  args: {
    iconPath: new GraphqlSystem().getIconUri(),
    path: '/graphql',
    data: 'Query',
    hostName: 'https://api.myservices.com',
  },
};

export const SanityRequest: Story = {
  args: {
    iconPath: new SanitySystem().getIconUri(),
    path: '/api/v1/trace/1234',
    data: 'type: Product',
    hostName: 'https://api.myservices.com',
  },
};
