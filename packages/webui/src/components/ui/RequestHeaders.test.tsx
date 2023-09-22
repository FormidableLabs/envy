import { cleanup, render } from '@testing-library/react';

import Authorization from '@/components/Authorization';
import { Trace } from '@/types';

import RequestHeaders from './RequestHeaders';

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

describe('RequestHeaders', () => {
  afterEach(() => {
    jest.resetAllMocks();
    cleanup();
  });

  it('should render without error', () => {
    const trace = {} as Trace;
    render(<RequestHeaders trace={trace} />);
  });

  it('should render nothing if trace has no headers', () => {
    const trace = {} as Trace;
    const { container } = render(<RequestHeaders trace={trace} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should pass `label` "Headers" to KeyValueList component', () => {
    const trace = {
      http: {
        requestHeaders: {
          foo: 'bar',
          baz: 'qux',
        } as Record<string, string>,
      },
    } as Trace;
    render(<RequestHeaders trace={trace} />);

    expect(mockKeyValueListComponent).lastCalledWith(expect.objectContaining({ label: 'Headers' }));
  });

  it('should pass trace request headers as `keyValuePairs`', () => {
    const trace = {
      http: {
        requestHeaders: {
          foo: 'bar',
          baz: 'qux',
        } as Record<string, string>,
      },
    } as Trace;
    render(<RequestHeaders trace={trace} />);

    expect(mockKeyValueListComponent).lastCalledWith(
      expect.objectContaining({
        keyValuePairs: [
          ['foo', 'bar'],
          ['baz', 'qux'],
        ],
      }),
    );
  });

  it('should pass Authorizatin component for "authorization" header`', () => {
    const trace = {
      http: {
        requestHeaders: {
          authorization: 'some_auth_token',
        } as Record<string, string>,
      },
    } as Trace;
    render(<RequestHeaders trace={trace} />);

    const [key, value] = mockKeyValueListComponent.mock.lastCall[0].keyValuePairs[0];
    expect(key).toEqual('authorization');
    expect(value.type).toEqual(Authorization);
    expect(value.props).toEqual({ value: 'some_auth_token' });
  });
});
