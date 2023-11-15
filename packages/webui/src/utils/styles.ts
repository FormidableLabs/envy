import { HttpRequestState } from '@envyjs/core';

import { Trace } from '@/types';

export function badgeStyle(trace: Trace) {
  const { statusCode, state } = trace.http || {};

  if (state === HttpRequestState.Aborted) return 'badge-abort';

  if (statusCode) {
    if (statusCode >= 500) return 'badge-500';
    else if (statusCode >= 400) return 'badge-400';
    else if (statusCode >= 300) return 'badge-300';
    else if (statusCode >= 200) return 'badge-200';
  }
}
