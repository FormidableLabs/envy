// The plan is for this system to not part of the codebase, and rather be something that
// can be implemented and registered from the application using envt to send
// network traces
import { safeParseJson } from '@envyjs/core';

import { Code, Field, Fields } from '@/components';
import { System, Trace, TraceContext } from '@/types';

type SanityData = {
  type?: string | null;
  query?: string | null;
};

export default class SanitySystem implements System<SanityData> {
  name = 'Sanity';

  isMatch(trace: Trace) {
    return !!trace.sanity;
  }

  getIconUri() {
    return 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjggMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiByeD0iNiIgZmlsbD0iI0YwM0UyRiI+PC9yZWN0PgogIDxwYXRoCiAgICBkPSJNOC42MiA3LjI1YzAgMi40MSAxLjUyIDMuODQgNC41NCA0LjZsMy4yMS43M2MyLjg3LjY0IDQuNjEgMi4yNSA0LjYxIDQuODdhNC45MSA0LjkxIDAgMDEtMS4wNyAzLjE1YzAtMi42MS0xLjM3LTQuMDItNC42OS00Ljg3bC0zLjE1LS43Yy0yLjUyLS41Ny00LjQ3LTEuODktNC40Ny00LjczYTQuODkgNC44OSAwIDAxMS4wMi0zLjA1eiIKICAgIGZpbGw9IiNmZmYiCiAgPjwvcGF0aD4KICA8cGF0aAogICAgZD0iTTE3Ljk0IDE2LjhjMS4zNy44NyAxLjk3IDIuMDcgMS45NyAzLjgtMS4xMyAxLjQyLTMuMTIgMi4yMi01LjQ2IDIuMjItMy45NCAwLTYuNy0xLjktNy4zLTUuMjFoMy43OGMuNDggMS41MiAxLjc3IDIuMjIgMy41IDIuMjIgMi4xIDAgMy40OS0xLjEgMy41Mi0zLjAzIgogICAgZmlsbD0iI0Y5QjFBQiIKICA+PC9wYXRoPgogIDxwYXRoCiAgICBkPSJNMTAuNTkgMTAuODJhMy45OSAzLjk5IDAgMDEtMS45Ny0zLjU3YzEuMS0xLjQgMy0yLjI3IDUuMzItMi4yNyA0IDAgNi4zMyAyLjA4IDYuOSA1SDE3LjJjLS40LTEuMTUtMS40LTIuMDUtMy4yMy0yLjA1LTEuOTYgMC0zLjMgMS4xMi0zLjM3IDIuOSIKICAgIGZpbGw9IiNGOUIxQUIiCiAgPjwvcGF0aD4KPC9zdmc+Cg==';
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

  getTraceRowData({ data }: TraceContext<SanityData>) {
    const { type } = data;

    return {
      data: `Type: ${type}`,
    };
  }

  getRequestDetailComponent({ data }: TraceContext<SanityData>) {
    const { type, query } = data;

    return (
      <>
        <Fields className="border-t border-manatee-400 pt-4">
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

  getResponseBody({ trace }: TraceContext<SanityData>) {
    if (!trace.http?.responseBody) return null;

    const transformed = safeParseJson(trace.http.responseBody).value;
    delete transformed.query;
    return JSON.stringify(transformed);
  }
}
