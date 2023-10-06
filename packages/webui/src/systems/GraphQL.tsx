// The plan is for this system to not part of the codebase, and rather be something that
// can be implemented and registered from the application using envt to send
// network traces
import { GraphqlRequest } from '@envyjs/core';

import { Code, Field, Fields } from '@/components';
import { System, Trace, TraceContext } from '@/types';

type GraphQLData = GraphqlRequest & {
  response: string | null;
};

export default class GraphQLSystem implements System<GraphQLData> {
  name = 'GraphQL';

  isMatch(trace: Trace) {
    return !!(trace.http && trace.graphql);
  }

  getIconUri() {
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTIwIiBmaWxsPSIjZTEwMDk4Ij4KICA8c3R5bGU+CiAgICBzdmcgewogICAgICBmaWxsOiAjRkZGRkZGOwogICAgfQogIDwvc3R5bGU+CiAgPGRlZnM+CiAgICA8ZyBpZD0ibG9nbyI+CiAgICAgIDxwYXRoCiAgICAgICAgZmlsbC1ydWxlPSJldmVub2RkIgogICAgICAgIGNsaXAtcnVsZT0iZXZlbm9kZCIKICAgICAgICBkPSJNNTAgNi45MDMwOEw4Ny4zMjMgMjguNDUxNVY3MS41NDg0TDUwIDkzLjA5NjhMMTIuNjc3IDcxLjU0ODRWMjguNDUxNUw1MCA2LjkwMzA4Wk0xNi44NjQ3IDMwLjg2OTNWNjIuNTI1MUw0NC4yNzk1IDE1LjA0MTRMMTYuODY0NyAzMC44NjkzWk01MCAxMy41MDg2TDE4LjM5NzUgNjguMjQ1N0g4MS42MDI1TDUwIDEzLjUwODZaTTc3LjQxNDggNzIuNDMzNEgyMi41ODUyTDUwIDg4LjI2MTNMNzcuNDE0OCA3Mi40MzM0Wk04My4xMzUzIDYyLjUyNTFMNTUuNzIwNSAxNS4wNDE0TDgzLjEzNTMgMzAuODY5M1Y2Mi41MjUxWiIKICAgICAgLz4KICAgICAgPGNpcmNsZSBjeD0iNTAiIGN5PSI5LjMyMDkiIHI9IjguODIiIC8+CiAgICAgIDxjaXJjbGUgY3g9Ijg1LjIyOTIiIGN5PSIyOS42NjA1IiByPSI4LjgyIiAvPgogICAgICA8Y2lyY2xlIGN4PSI4NS4yMjkyIiBjeT0iNzAuMzM5NiIgcj0iOC44MiIgLz4KICAgICAgPGNpcmNsZSBjeD0iNTAiIGN5PSI5MC42NzkxIiByPSI4LjgyIiAvPgogICAgICA8Y2lyY2xlIGN4PSIxNC43NjU5IiBjeT0iNzAuMzM5NiIgcj0iOC44MiIgLz4KICAgICAgPGNpcmNsZSBjeD0iMTQuNzY1OSIgY3k9IjI5LjY2MDUiIHI9IjguODIiIC8+CiAgICA8L2c+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iMjAiIGZpbGw9IiNFMTAwOTgiIC8+CiAgPHVzZSBocmVmPSIjbG9nbyIgeD0iMTAiIHk9IjEwIiAvPgo8L3N2Zz4K';
  }

  getData(trace: Trace) {
    return {
      ...trace.graphql!,
      response: trace.http?.responseBody ?? null,
    };
  }
  getTraceRowData({ data }: TraceContext<GraphQLData>) {
    const { operationType, operationName } = data;

    let rowData = `GQL ${operationType}`;
    if (operationName) {
      rowData += `: ${operationName}`;
    }

    return {
      data: rowData,
    };
  }

  getRequestDetailComponent({ data }: TraceContext<GraphQLData>) {
    const { operationType, operationName, query } = data;

    return (
      <>
        <Fields>
          <Field data-test-id="name" label="Name">
            {operationName}
          </Field>
          <Field data-test-id="type" label="Type">
            {operationType}
          </Field>
          <Field label="Query">
            <Code data-test-id="query">{query}</Code>
          </Field>
        </Fields>
      </>
    );
  }
}
