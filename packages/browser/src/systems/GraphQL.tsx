import { RequestRowData } from '@/components/RequestRowData';
import { Code, Field, Fields, Label } from '@/components/ui';
import { Trace } from '@/types';
import { pathAndQuery, safeParseJson } from '@/utils';

import { System } from '.';

type OperationType = 'Query' | 'Mutation';

type GraphQLData = {
  type: OperationType;
  operationName: string;
  query: string;
  variables?: Record<string, any>;
  response: string | null;
};

const icon = new URL('GraphQL.svg', import.meta.url);

export default class GraphQL implements System<GraphQLData> {
  name = 'GraphQL';

  isMatch(trace: Trace) {
    return trace.path?.endsWith('/graphql') ?? false;
  }

  getData(trace: Trace) {
    const reqBody = safeParseJson<Record<string, any>>(trace.requestBody ?? '{}') as Record<string, any>;
    const type = (reqBody?.query?.startsWith('mutation') ? 'Mutation' : 'Query') as OperationType;

    return {
      type,
      operationName: reqBody?.operationName,
      query: reqBody?.query,
      variables: reqBody?.variables,
      response: trace.responseBody ?? null,
    };
  }

  getIconPath(_?: Trace) {
    return icon.pathname;
  }

  listComponent(trace: Trace) {
    const { type, operationName } = this.getData(trace);
    const [path] = pathAndQuery(trace);
    return (
      <RequestRowData
        iconPath={this.getIconPath(trace)}
        hostName={trace.host}
        path={path}
        data={`GQL ${type}: ${operationName}`}
      />
    );
  }

  requestDetailComponent(trace: Trace) {
    const { type, operationName, query } = this.getData(trace);

    return (
      <>
        <Fields>
          <Field label="Name">{operationName}</Field>
          <Field label="Type">{type}</Field>
          <Field label="Query">
            <Code>{query}</Code>
          </Field>
        </Fields>
      </>
    );
  }

  responseDetailComponent(_: Trace) {
    return null;
  }
}
