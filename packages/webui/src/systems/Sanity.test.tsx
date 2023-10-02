import { render } from '@testing-library/react';
import { ReactElement } from 'react';

import { Trace } from '@/types';

import SanitySystem from './Sanity';

jest.mock(
  '@/components/Code',
  () =>
    function MockCode({ children, ...props }: any) {
      return <div {...props}>{children}</div>;
    }
);

const mockTrace = {
  sanity: {
    queryType: 'Foo',
    query: `*[_type == 'foo'] { bar }`,
  },
  http: {
    responseBody: JSON.stringify({
      query: `*[_type == 'foo'] { bar }`,
      data: { bar: 'baz' },
    }),
  },
} as Trace;

describe('SanitySystem', () => {
  it('should be called "Sanity"', () => {
    const instance = new SanitySystem();
    expect(instance.name).toEqual('Sanity');
  });

  it('should match when trace has `sanity` data', () => {
    const instance = new SanitySystem();

    expect(instance.isMatch(mockTrace)).toBe(true);
  });

  it('should not match when path ends does not end with `/sanity`', () => {
    const instance = new SanitySystem();
    const mockHttpTrace = {
      http: {
        path: '/foo/bar',
      },
    } as Trace;

    expect(instance.isMatch(mockHttpTrace)).toBe(false);
  });

  it('should return the expected icon', () => {
    const instance = new SanitySystem();
    expect(instance.getIconUri()).toEqual(expect.any(String));
  });

  it('should expected data for `getData`', () => {
    const instance = new SanitySystem();

    expect(instance.getData(mockTrace)).toEqual({
      type: mockTrace.sanity!.queryType,
      query: mockTrace.sanity!.query,
    });
  });

  it('should return Sanity type data for `getTraceRowData', () => {
    const instance = new SanitySystem();
    const data = {
      type: mockTrace.sanity!.queryType,
      query: mockTrace.sanity!.query,
    };

    expect(instance.getTraceRowData({ trace: mockTrace, data })).toEqual({ data: 'Type: Foo' });
  });

  it('should render expeced component for `getRequestDetailComponent`', () => {
    const instance = new SanitySystem();
    const data = {
      type: mockTrace.sanity!.queryType,
      query: mockTrace.sanity!.query,
    };

    const component = instance.getRequestDetailComponent({ trace: mockTrace, data });

    const { getByTestId } = render(component as ReactElement);
    expect(getByTestId('type')).toHaveTextContent('Foo');
    expect(getByTestId('query')).toHaveTextContent(mockTrace.sanity!.query!);
  });

  it('should return null from `getResponseBody` if there is no response body', () => {
    const instance = new SanitySystem();
    const data = {
      type: mockTrace.sanity!.queryType,
      query: mockTrace.sanity!.query,
    };

    const mockTraceWithoutResponse = {
      ...mockTrace,
      http: {
        responseBody: undefined,
      },
    } as Trace;
    const result = instance.getResponseBody({ trace: mockTraceWithoutResponse, data });

    expect(result).toBe(null);
  });

  it('should remove the `query` property from the response body in `getResponseBody`', () => {
    const instance = new SanitySystem();
    const data = {
      type: mockTrace.sanity!.queryType,
      query: mockTrace.sanity!.query,
    };

    const result = instance.getResponseBody({ trace: mockTrace, data });

    expect(result).toEqual({ data: { bar: 'baz' } });
  });
});
