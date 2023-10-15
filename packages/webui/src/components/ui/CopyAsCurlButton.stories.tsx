import { HttpRequestState } from '@envyjs/core';
import type { Meta, StoryObj } from '@storybook/react';

import CopyAsCurlButton from './CopyAsCurlButton';

const meta = {
  title: 'UI/CopyAsCurlButton',
  component: CopyAsCurlButton,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof CopyAsCurlButton>;

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
        },
        state: HttpRequestState.Received,
        url: 'https://httpbin.org/api/v1/?trace=123&name=test',
      },
    },
  },
};
