// The plan is for this system to not part of the codebase, and rather be something that
// can be implemented and registered from the application using envt to send
// network traces

import { Code, Field, Fields } from '@/components/ui';
import { System, Trace } from '@/types';
import { safeParseJson } from '@/utils';

type OperationType = 'Query' | 'Mutation';

type GraphQLData = {
  type: OperationType;
  operationName: string;
  query: string;
  variables?: Record<string, any>;
  response: string | null;
};

const icon = new URL('GraphQL.svg', import.meta.url);

export default class GraphQLSystem implements System<GraphQLData> {
  name = 'GraphQL';

  isMatch(trace: Trace) {
    return trace.http?.path?.endsWith('/graphql') ?? false;
  }

  getIconPath() {
    return icon.pathname;
  }

  getData(trace: Trace) {
    const reqBody = safeParseJson(trace.http?.requestBody);
    const type = (reqBody?.query?.trim().startsWith('mutation') ? 'Mutation' : 'Query') as OperationType;

    return {
      type,
      operationName: reqBody?.operationName,
      query: reqBody?.query,
      variables: reqBody?.variables,
      response: trace.http?.responseBody ?? null,
    };
  }
  getTraceRowData(trace: Trace) {
    const { type, operationName } = this.getData(trace);

    return {
      data: `GQL ${type}: ${operationName}`,
    };
  }

  requestDetailComponent(trace: Trace) {
    const { type, operationName, query } = this.getData(trace);

    return (
      <>
        <Fields>
          <Field data-test-id="name" label="Name">
            {operationName}
          </Field>
          <Field data-test-id="type" label="Type">
            {type}
          </Field>
          <Field label="Query">
            <Code data-test-id="query">{query}</Code>
          </Field>
        </Fields>
      </>
    );
  }

  responseDetailComponent(_: Trace) {
    return null;
  }
}
