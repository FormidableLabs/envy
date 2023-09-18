import { Field } from '@/components/ui';
import { Trace } from '@/types';
import { cloneHeaders, pathAndQuery } from '@/utils';

import Authorization from './Authorization';

type KeyValueListProps = {
  label: string;
  uid: string;
  keyValuePairs: [string, any][];
};
export function KeyValueList({ label, uid, keyValuePairs }: KeyValueListProps) {
  if (!keyValuePairs.length) return null;

  return (
    <Field label={label}>
      {keyValuePairs.map(([k, v]) => (
        <span key={`${uid}_${k}`} className="w-full flex flex-row pt-2 first:pt-0">
          <span className="flex-[1] font-semibold">{k}: </span>
          <span className="group flex-[3] break-all overflow-x-visible">
            {typeof v === 'string' ? decodeURIComponent(v) : v}
          </span>
        </span>
      ))}
    </Field>
  );
}

export function RequestHeaders({ trace }: { trace: Trace }) {
  const requestHeaders = trace.http?.requestHeaders;
  if (!(requestHeaders && Object.keys(requestHeaders).length)) return null;

  const headers = cloneHeaders(requestHeaders) as Record<string, any>;
  if (headers.authorization) headers.authorization = <Authorization value={headers.authorization} />;
  return <KeyValueList label="Headers" uid={trace.id} keyValuePairs={Object.entries(headers)} />;
}

export function ResponseHeaders({ trace }: { trace: Trace }) {
  const responseHeaders = trace.http?.responseHeaders;
  if (!(responseHeaders && Object.keys(responseHeaders).length)) return null;

  const headers = cloneHeaders(responseHeaders) as Record<string, any>;
  if (headers.authorization) headers.authorization = <Authorization value={headers.authorization} />;

  return <KeyValueList label="Headers" uid={trace.id} keyValuePairs={Object.entries(headers)} />;
}

export function QueryParams({ trace }: { trace: Trace }) {
  const [, qs] = pathAndQuery(trace);
  const urlSearchParams = new URLSearchParams(qs);
  const queryParams: [string, string | null][] = [];
  urlSearchParams.forEach((value, key) => {
    queryParams.push([key, value]);
  });

  return <KeyValueList label="Query params" uid={trace.id} keyValuePairs={queryParams} />;
}
