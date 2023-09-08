import { RequestRowData } from '@/components/RequestRowData';
import { Code, Field, Fields, Label } from '@/components/ui';
import { ConnectionData } from '@/types';
import { pathAndQuery } from '@/utils';

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

  isMatch(connection: ConnectionData) {
    return connection.req.path === '/api/graphql';
  }

  getData(connection: ConnectionData) {
    const body = connection.req.body as Record<string, any>;
    const type = (body?.query?.startsWith('mutation') ? 'Mutation' : 'Query') as OperationType;
    const response =
      typeof connection.res?.body === 'object'
        ? JSON.stringify(connection.res.body, undefined, 2)
        : connection.res?.body ?? null;

    return {
      type,
      operationName: body?.operationName,
      query: body?.query,
      variables: body?.variables,
      response,
    };
  }

  getIconPath(_?: ConnectionData) {
    return icon.pathname;
  }

  listComponent(connection: ConnectionData) {
    const { type, operationName } = this.getData(connection);
    const [path] = pathAndQuery(connection);
    return (
      <RequestRowData
        iconPath={this.getIconPath(connection)}
        hostName={connection.req.host}
        path={path}
        data={`GQL ${type}: ${operationName}`}
      />
    );
  }

  requestDetailComponent(connection: ConnectionData) {
    const { type, operationName, query } = this.getData(connection);

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

  responseDetailComponent(connection: ConnectionData) {
    const { response } = this.getData(connection);
    if (!response) return null;

    const json = JSON.parse(response);
    return <>{json.error && <Label label="Errors">ERRORS!</Label>}</>;
  }
}
