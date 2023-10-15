import { HttpRequestState } from '@envyjs/core';
import type { Meta, StoryObj } from '@storybook/react';

import ResponseHeaders from './ResponseHeaders';

const meta = {
  title: 'UI/ResponseHeaders',
  component: ResponseHeaders,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ResponseHeaders>;

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
        responseHeaders: {
          'content-type': 'application/json',
          'x-custom-header': 'custom value',
          'x-custom-header-2': 'custom value 2',
        },
        state: HttpRequestState.Received,
        url: 'https://httpbin.org/api/v1/?trace=123&name=test',
      },
    },
  },
};
