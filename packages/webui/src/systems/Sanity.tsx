// The plan is for this system to not part of the codebase, and rather be something that
// can be implemented and registered from the application using envt to send
// network traces

import { Code, Field, Fields } from '@/components';
import { System, Trace } from '@/types';
import { safeParseJson } from '@/utils';

type SanityData = {
  type?: string | null;
  query?: string | null;
};

const icon = new URL('Sanity.svg', import.meta.url);

export default class SanitySystem implements System<SanityData> {
  name = 'Sanity';

  isMatch(trace: Trace) {
    return !!trace.sanity;
  }

  getIconPath() {
    return icon.pathname;
  }

  getData(trace: Trace) {
    const { queryType, query } = trace.sanity!;

    return {
      type: queryType,
      query:
        query &&
        query
          .split('\n')
          .filter(x => x.trim().length)
          .join('\n'),
    };
  }

  getTraceRowData(trace: Trace) {
    const { type } = this.getData(trace);

    return {
      data: `Type: ${type}`,
    };
  }

  requestDetailComponent(trace: Trace) {
    const { type, query } = this.getData(trace);

    return (
      <>
        <Fields>
          <Field data-test-id="type" label="Item type">
            {type}
          </Field>
          <Field label="Query">
            <Code data-test-id="query">{query}</Code>
          </Field>
        </Fields>
      </>
    );
  }

  transformResponseBody(trace: Trace) {
    if (!trace.http?.responseBody) return null;

    const json = safeParseJson(trace.http.responseBody);
    const transformed = { ...json };
    delete transformed.query;
    return transformed;
  }

  responseDetailComponent(_: Trace) {
    return null;
  }
}
