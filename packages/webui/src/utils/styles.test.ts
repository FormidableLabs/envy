import { HttpRequestState } from '@envyjs/core';

import { badgeStyle } from './styles';

describe('badgeStyle', () => {
  const scenarios = [
    { statusCode: 500, bgColor: 'badge-500' },
    { statusCode: 404, bgColor: 'badge-400' },
    { statusCode: 300, bgColor: 'badge-300' },
    { statusCode: 200, bgColor: 'badge-200' },
  ];

  it.each(scenarios)('should have $bgColor for HTTP $statusCode responses', ({ statusCode, bgColor }) => {
    const trace = {
      http: {
        state: HttpRequestState.Received,
        statusCode,
      },
    } as any;

    const style = badgeStyle(trace);
    expect(style).toEqual(bgColor);
  });

  it('should have badge-abort for aborted HTTP requests', () => {
    const trace = {
      http: {
        state: HttpRequestState.Aborted,
      },
    } as any;

    const style = badgeStyle(trace);
    expect(style).toEqual('badge-abort');
  });
});
