import { Event, EventType, SanityRequest } from '@envy/core';

import { RequestRowData } from '@/components/RequestRowData';
import { Code, Field, Fields } from '@/components/ui';
import { Trace } from '@/types';
import { pathAndQuery, safeParseJson } from '@/utils';

import { System } from '.';

type SanityData = {
  type?: string | null;
  query?: string | null;
};

const icon = new URL('Sanity.svg', import.meta.url);

export default class Sanity implements System<SanityData> {
  name = 'Sanity';

  isMatch(trace: Trace) {
    return (trace as Event).type === EventType.SanityRequest;
  }

  getData(trace: Trace) {
    const sanityRequest = trace as unknown as SanityRequest;

    const query = sanityRequest.query;
    const type = sanityRequest.queryType;

    return {
      type: type,
      query:
        query &&
        query
          .split('\n')
          .filter(x => x.trim().length)
          .join('\n'),
    };
  }

  getIconPath(_?: Trace) {
    return icon.pathname;
  }

  listComponent(trace: Trace) {
    const { type } = this.getData(trace);
    const [path] = pathAndQuery(trace);
    return (
      <RequestRowData iconPath={this.getIconPath(trace)} hostName={trace.host} path={path} data={`Type: ${type}`} />
    );
  }

  requestDetailComponent(trace: Trace) {
    const { type, query } = this.getData(trace);

    return (
      <>
        <Fields>
          <Field label="Item type">{type}</Field>
          <Field label="Query">
            <Code>{query}</Code>
          </Field>
        </Fields>
      </>
    );
  }

  transformResponseBody(trace: Trace) {
    if (!trace.responseBody) return null;

    const json = safeParseJson(trace.responseBody);
    const transformed = { ...json };
    delete transformed.query;
    return transformed;
  }

  responseDetailComponent(_: Trace) {
    return null;
  }
}
