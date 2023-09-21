import { Trace } from '@/types';
import { cloneHeaders } from '@/utils';

import Authorization from './Authorization';
import KeyValueList from './KeyValueList';

export default function RequestHeaders({ trace }: { trace: Trace }) {
  const requestHeaders = trace.http?.requestHeaders;
  if (!requestHeaders || Object.keys(requestHeaders).length === 0) return null;

  const headers = cloneHeaders(requestHeaders) as Record<string, any>;
  if (headers.authorization) headers.authorization = <Authorization value={headers.authorization} />;

  return <KeyValueList label="Headers" keyValuePairs={Object.entries(headers)} />;
}
