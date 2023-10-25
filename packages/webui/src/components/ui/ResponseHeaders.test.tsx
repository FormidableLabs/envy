import { cleanup, render } from '@testing-library/react';

import Authorization from '@/components/Authorization';
import { Trace } from '@/types';

import ResponseHeaders from './ResponseHeaders';

const mockKeyValueListComponent = jest.fn();

jest.mock(
  '@/components/KeyValueList',
  () =>
    function MockKeyValueList(props: any) {
      // call the spy, since we want to verify props passed in without caring
      // much about the presentation for this unit test
      mockKeyValueListComponent(props);
      return <></>;
    },
);

describe('ResponseHeaders', () => {
  afterEach(() => {
    jest.resetAllMocks();
    cleanup();
  });

  it('should render without error', () => {
    const trace = {} as Trace;
    render(<ResponseHeaders trace={trace} />);
  });

  it('should render nothing if trace has no headers', () => {
    const trace = {} as Trace;
    const { container } = render(<ResponseHeaders trace={trace} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should pass trace request headers as `keyValuePairs`', () => {
    const trace = {
      http: {
        responseHeaders: {
          foo: 'bar',
          baz: 'qux',
        } as Record<string, string>,
      },
    } as Trace;
    render(<ResponseHeaders trace={trace} />);

    expect(mockKeyValueListComponent).lastCalledWith(
      expect.objectContaining({
        values: [
          ['foo', 'bar'],
          ['baz', 'qux'],
        ],
      }),
    );
  });

  it('should pass Authorization component for "authorization" header`', () => {
    const trace = {
      http: {
        responseHeaders: {
          authorization: 'some_auth_token',
        } as Record<string, string>,
      },
    } as Trace;
    render(<ResponseHeaders trace={trace} />);

    const [key, value] = mockKeyValueListComponent.mock.lastCall[0].values[0];
    expect(key).toEqual('authorization');
    expect(value.type).toEqual(Authorization);
    expect(value.props).toEqual({ value: 'some_auth_token' });
  });
});
