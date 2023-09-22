import { render } from '@testing-library/react';
import { ReactElement } from 'react';

import { Trace } from '@/types';

import SanitySystem from './Sanity';

jest.mock(
  '@/components/ui/Code',
  () =>
    function MockCode({ children, ...props }: any) {
      return <div {...props}>{children}</div>;
    },
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
    expect(instance.getIconPath()).toEqual('/Sanity.svg');
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

    expect(instance.getTraceRowData(mockTrace)).toEqual({ data: 'Type: Foo' });
  });

  it('should render expeced component for `requestDetailComponent`', () => {
    const instance = new SanitySystem();
    const component = instance.requestDetailComponent(mockTrace);

    const { getByTestId } = render(component as ReactElement);
    expect(getByTestId('type')).toHaveTextContent('Foo');
    expect(getByTestId('query')).toHaveTextContent(mockTrace.sanity!.query!);
  });

  it('should return null from `transformResponseBody` if there is no response body', () => {
    const instance = new SanitySystem();
    const mockTraceWithoutResponse = {
      ...mockTrace,
      http: {
        responseBody: undefined,
      },
    } as Trace;
    const result = instance.transformResponseBody(mockTraceWithoutResponse);

    expect(result).toBe(null);
  });

  it('should remove the `query` property from the response body in `transformResponseBody`', () => {
    const instance = new SanitySystem();
    const result = instance.transformResponseBody(mockTrace);

    expect(result).toEqual({ data: { bar: 'baz' } });
  });

  it('should return `null` for `responseDetailComponent`', () => {
    const instance = new SanitySystem();
    expect(instance.responseDetailComponent(mockTrace)).toBe(null);
  });
});
