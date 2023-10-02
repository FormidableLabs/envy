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
    requestBody: JSON.stringify({
      operationName: 'Foo',
      query,
      variables: {},
    }),
    responseBody,
  },
} as Trace;

const mockMutationTrace = {
  http: {
    requestBody: JSON.stringify({
      operationName: 'AddFoo',
      query: mutation,
      variables: {},
    }),
    responseBody,
  },
} as Trace;

describe('GraphQLSystem', () => {
  it('should be called "GraphQL"', () => {
    const instance = new GraphQLSystem();
    expect(instance.name).toEqual('GraphQL');
  });

  it('should match when path ends with `/graphql`', () => {
    const instance = new GraphQLSystem();
    const trace = {
      http: {
        path: '/api/graphql',
      },
    } as Trace;

    expect(instance.isMatch(trace)).toBe(true);
  });

  it('should not match when path ends does not end with `/graphql`', () => {
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

  it('should expected data for `getData` when trace represents a query', () => {
    const instance = new GraphQLSystem();

    expect(instance.getData(mockQueryTrace)).toEqual({
      type: 'Query',
      operationName: 'Foo',
      query,
      variables: {},
      response: responseBody,
    });
  });

  it('should expected data for `getData` when trace represents a mutation', () => {
    const instance = new GraphQLSystem();

    expect(instance.getData(mockMutationTrace)).toEqual({
      type: 'Mutation',
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
      type: 'Query',
      operationName: 'Foo',
      query,
      variables: {},
      response: null,
    });
  });

  it('should return GQL query data for `getTraceRowData', () => {
    const instance = new GraphQLSystem();
    const data = {
      type: 'Query' as any,
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
      type: 'Query' as any,
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
