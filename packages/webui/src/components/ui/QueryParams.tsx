import KeyValueList from '@/components/KeyValueList';
import Section from '@/components/Section';
import { Trace } from '@/types';
import { pathAndQuery } from '@/utils';

export default function QueryParams({ trace }: { trace: Trace }) {
  const [, qs] = pathAndQuery(trace);
  if (!qs) return null;

  const urlSearchParams = new URLSearchParams(qs);
  const queryParams: [string, string][] = [];
  urlSearchParams.forEach((value, key) => {
    queryParams.push([key, value]);
  });

  return (
    <Section data-test-id="request-details" title="Query Params">
      <KeyValueList values={queryParams} />
    </Section>
  );
}
