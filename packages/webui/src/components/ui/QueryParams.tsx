import KeyValueList from '@/components/KeyValueList';
import { Trace } from '@/types';
import { pathAndQuery } from '@/utils';

export default function QueryParams({ trace }: { trace: Trace }) {
  const [, qs] = pathAndQuery(trace);
  const urlSearchParams = new URLSearchParams(qs);
  const queryParams: [string, string | null][] = [];
  urlSearchParams.forEach((value, key) => {
    queryParams.push([key, value]);
  });

  return <KeyValueList label="Query params" keyValuePairs={queryParams} />;
}
