import { cleanup, render } from '@testing-library/react';

import JsonDisplay from './JsonDisplay';

jest.mock(
  'react-json-view',
  () =>
    function MockReactJson({ src }: any) {
      return <div data-test-id="mock-react-json">{JSON.stringify(src)}</div>;
    }
);

describe('JsonDisplay', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render without error', () => {
    render(<JsonDisplay>{{ foo: 'bar' }}</JsonDisplay>);
  });

  it('should display code in ReactJson component', () => {
    const data = { foo: 'bar' };
    const { getByTestId } = render(<JsonDisplay>{data}</JsonDisplay>);

    const reactJson = getByTestId('mock-react-json');
    expect(reactJson).toHaveTextContent('{"foo":"bar"}');
  });

  it('should parse strings as json', () => {
    const data = '{"foo":"bar"}';
    const { getByTestId } = render(<JsonDisplay>{data}</JsonDisplay>);

    const reactJson = getByTestId('mock-react-json');
    expect(reactJson).toHaveTextContent('{"foo":"bar"}');
  });

  it('should display error when supplied json is invalid', () => {
    const data = 'blah';
    const { getByTestId } = render(<JsonDisplay>{data}</JsonDisplay>);

    const reactJson = getByTestId('mock-react-json');
    expect(reactJson).toHaveTextContent('{"error":"Error parsing JSON data","data":"blah"}');
  });
});
