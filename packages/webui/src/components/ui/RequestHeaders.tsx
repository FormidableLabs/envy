import Authorization from '@/components/Authorization';
import KeyValueList from '@/components/KeyValueList';
import { Trace } from '@/types';
import { cloneHeaders } from '@/utils';

export default function RequestHeaders({ trace }: { trace: Trace }) {
  const requestHeaders = trace.http?.requestHeaders;
  if (!requestHeaders || Object.keys(requestHeaders).length === 0) return null;

  const headers = cloneHeaders(requestHeaders) as Record<string, any>;
  if (headers.authorization) headers.authorization = <Authorization value={headers.authorization} />;

  return <KeyValueList label="Headers" keyValuePairs={Object.entries(headers)} />;
}
