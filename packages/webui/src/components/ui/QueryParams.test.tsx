import { cleanup, render } from '@testing-library/react';

import { Trace } from '@/types';

import QueryParams from './QueryParams';

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

describe('QueryParams', () => {
  afterEach(() => {
    jest.resetAllMocks();
    cleanup();
  });

  it('should render without error', () => {
    const trace = {} as Trace;
    render(<QueryParams trace={trace} />);
  });

  it('should pass `label` "Query params" to KeyValueList component', () => {
    const trace = {} as Trace;
    render(<QueryParams trace={trace} />);

    expect(mockKeyValueListComponent).lastCalledWith(expect.objectContaining({ label: 'Query params' }));
  });

  it('should pass empty `keyValuePairs` if trace has no query params', () => {
    const trace = {} as Trace;
    render(<QueryParams trace={trace} />);

    expect(mockKeyValueListComponent).lastCalledWith(expect.objectContaining({ keyValuePairs: [] }));
  });

  it('should pass trace query params as `keyValuePairs`', () => {
    const trace = {
      http: {
        path: '/page?foo=bar&baz=qux',
      },
    } as Trace;
    render(<QueryParams trace={trace} />);

    expect(mockKeyValueListComponent).lastCalledWith(
      expect.objectContaining({
        keyValuePairs: [
          ['foo', 'bar'],
          ['baz', 'qux'],
        ],
      }),
    );
  });
});
