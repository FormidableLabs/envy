import { HttpRequestState } from '@envyjs/core';
import type { Meta, StoryObj } from '@storybook/react';

import RequestHeaders from './RequestHeaders';

const meta = {
  title: 'UI/RequestHeaders',
  component: RequestHeaders,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof RequestHeaders>;

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
        requestHeaders: {
          'content-type': 'application/json',
          'x-custom-header': 'custom value',
          'x-custom-header-2': 'custom value 2',
          'authorization':
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.vqb33-7FqzFWPNlr0ElW1v2RjJRZBel3CdDHBWD7y_o',
        },
        state: HttpRequestState.Received,
        url: 'https://httpbin.org/api/v1/?trace=123&name=test',
      },
    },
  },
};
