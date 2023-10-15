import { HttpRequestState } from '@envyjs/core';
import type { Meta, StoryObj } from '@storybook/react';

import QueryParams from './QueryParams';

const meta = {
  title: 'UI/QueryParams',
  component: QueryParams,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof QueryParams>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    trace: {
      id: 'http-1',
      timestamp: 1616239022,
      http: {
        host: 'httpbin.org',
        method: 'GET',
        port: 443,
        path: '/api/v1/?trace=123&name=test',
        requestHeaders: {},
        state: HttpRequestState.Received,
        url: 'https://httpbin.org/api/v1/?trace=123&name=test',
      },
    },
  },
};
