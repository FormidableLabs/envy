import { GraphqlRequest } from '@envyjs/core';
import { render } from '@testing-library/react';
import { ReactElement } from 'react';

import { Trace } from '@/types';

import GraphQLSystem from './GraphQL';

jest.mock(
  '@/components/Code',
  () =>
    function MockCode({ children, ...props }: any) {
      return <div {...props}>{children}</div>;
    },
);

const query = `
  query Foo {
    foo {
      bar
    }
  }
`;

const mutation = `
  mutation AddFoo {
    foo {
      bar
    }
  }
`;

const responseBody = JSON.stringify({ data: { foo: { bar: 'baz' } } });

const mockQueryTrace = {
  http: {
    responseBody,
  },
  graphql: {
    operationName: 'Foo',
    operationType: 'Query',
    query,
    variables: {},
  },
} as Trace;

const mockMutationTrace = {
  http: {
    responseBody,
  },
  graphql: {
    operationName: 'AddFoo',
    operationType: 'Mutation',
    query: mutation,
    variables: {},
  },
} as Trace;

describe('GraphQLSystem', () => {
  it('should be called "GraphQL"', () => {
    const instance = new GraphQLSystem();
    expect(instance.name).toEqual('GraphQL');
  });

  it('should match when event has `http` and `graphql` data', () => {
    const instance = new GraphQLSystem();
    const trace = {
      http: {
        path: '/foo/bar',
      },
      graphql: {
        operationType: 'Mutation',
        query: 'mutation Login {}',
      },
    } as Trace;

    expect(instance.isMatch(trace)).toBe(true);
  });

  it('should not match when event has no `graphql` data', () => {
    const instance = new GraphQLSystem();
    const trace = {
      http: {
        path: '/foo/bar',
      },
    } as Trace;

    expect(instance.isMatch(trace)).toBe(false);
  });

  it('should not match when trace does not have `http` data', () => {
    const instance = new GraphQLSystem();
    const trace = {} as Trace;

    expect(instance.isMatch(trace)).toBe(false);
  });

  it('should return the expected icon', () => {
    const instance = new GraphQLSystem();
    expect(instance.getIconUri()).toEqual(expect.any(String));
  });

  it('should return the expected keywords if operation name is present', () => {
    const instance = new GraphQLSystem();
    const data = {
      operationType: 'Query' as GraphqlRequest['operationType'],
      operationName: 'Foo',
      query,
      variables: {},
      response: responseBody,
    };

    expect(instance.getSearchKeywords({ trace: mockQueryTrace, data })).toEqual(['Foo']);
  });

  it('should return the empty keywords if operation name is not present', () => {
    const instance = new GraphQLSystem();
    const data = {
      operationType: 'Query' as GraphqlRequest['operationType'],
      operationName: undefined,
      query,
      variables: {},
      response: responseBody,
    };

    expect(instance.getSearchKeywords({ trace: mockQueryTrace, data })).toEqual([]);
  });

  it('should expected data for `getData` when trace represents a query', () => {
    const instance = new GraphQLSystem();

    expect(instance.getData(mockQueryTrace)).toEqual({
      operationType: 'Query',
      operationName: 'Foo',
      query,
      variables: {},
      response: responseBody,
    });
  });

  it('should expected data for `getData` when trace represents a mutation', () => {
    const instance = new GraphQLSystem();

    expect(instance.getData(mockMutationTrace)).toEqual({
      operationType: 'Mutation',
      operationName: 'AddFoo',
      query: mutation,
      variables: {},
      response: responseBody,
    });
  });

  it('should expected data for `getData` when trace has no response', () => {
    const instance = new GraphQLSystem();
    const traceWithoutResponse = {
      ...mockQueryTrace,
      http: {
        ...mockQueryTrace.http,
        responseBody: undefined,
      },
    } as Trace;

    expect(instance.getData(traceWithoutResponse)).toEqual({
      operationType: 'Query',
      operationName: 'Foo',
      query,
      variables: {},
      response: null,
    });
  });

  it('should return GQL query data for `getTraceRowData', () => {
    const instance = new GraphQLSystem();
    const data = {
      operationType: 'Query' as GraphqlRequest['operationType'],
      operationName: 'Foo',
      query,
      variables: {},
      response: responseBody,
    };

    expect(instance.getTraceRowData({ trace: mockQueryTrace, data })).toEqual({
      data: 'GQL Query: Foo',
    });
  });

  it('should render expeced component for `getRequestDetailComponent`', () => {
    const instance = new GraphQLSystem();
    const data = {
      operationType: 'Query' as GraphqlRequest['operationType'],
      operationName: 'Foo',
      query,
      variables: {},
      response: responseBody,
    };

    const component = instance.getRequestDetailComponent({ trace: mockQueryTrace, data });

    const { getByTestId } = render(component as ReactElement);
    expect(getByTestId('name')).toHaveTextContent('Foo');
    expect(getByTestId('type')).toHaveTextContent('Query');
    expect(getByTestId('query')).toHaveTextContent('query Foo { foo { bar } }');
  });
});
