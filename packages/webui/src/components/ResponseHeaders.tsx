import { Trace } from '@/types';
import { cloneHeaders } from '@/utils';

import Authorization from './Authorization';
import KeyValueList from './KeyValueList';

export default function ResponseHeaders({ trace }: { trace: Trace }) {
  const responseHeaders = trace.http?.responseHeaders;
  if (!responseHeaders || Object.keys(responseHeaders).length === 0) return null;

  const headers = cloneHeaders(responseHeaders) as Record<string, any>;
  if (headers.authorization) headers.authorization = <Authorization value={headers.authorization} />;

  return <KeyValueList label="Headers" keyValuePairs={Object.entries(headers)} />;
}
