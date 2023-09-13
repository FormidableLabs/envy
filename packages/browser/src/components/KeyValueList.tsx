import { Field } from '@/components/ui';
import { ConnectionData } from '@/types';
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

export function RequestHeaders({ connection }: { connection: ConnectionData }) {
  if (!Object.keys(connection.req.headers).length) return null;

  const headers = cloneHeaders(connection.req.headers) as Record<string, any>;
  if (headers.authorization) headers.authorization = <Authorization value={headers.authorization} />;
  return <KeyValueList label="Headers" uid={connection.req.traceId} keyValuePairs={Object.entries(headers)} />;
}

export function ResponseHeaders({ connection }: { connection: ConnectionData }) {
  if (!connection.res) return null;
  if (!Object.keys(connection.res?.headers || {})?.length) return null;

  const headers = cloneHeaders(connection.res.headers) as Record<string, any>;
  if (headers.authorization) headers.authorization = <Authorization value={headers.authorization} />;

  return <KeyValueList label="Headers" uid={connection.req.traceId} keyValuePairs={Object.entries(headers)} />;
}

export function QueryParams({ connection }: { connection: ConnectionData }) {
  const [, qs] = pathAndQuery(connection);
  const urlSearchParams = new URLSearchParams(qs);
  const queryParams: [string, string | null][] = [];
  urlSearchParams.forEach((value, key) => {
    queryParams.push([key, value]);
  });

  return <KeyValueList label="Query params" uid={connection.req.traceId} keyValuePairs={queryParams} />;
}
