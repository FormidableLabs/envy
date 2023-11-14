import { cleanup, render, waitFor } from '@testing-library/react';

import CodeDisplay from './CodeDisplay';

jest.mock(
  './MonacoEditor',
  () =>
    function MockEditor({ value, language }: any) {
      return <div data-test-id={`lang-${language}`}>{value}</div>;
    },
);

describe('CodeDisplay', () => {
  afterEach(() => {
    cleanup();
  });

  it('should parse application/json', async () => {
    const data = { foo: 'bar' };
    const { getByTestId } = render(<CodeDisplay data={JSON.stringify(data)} contentType="application/json" />);

    const reactJson = await waitFor(() => getByTestId('lang-json'));
    expect(reactJson).toHaveTextContent('{ "foo": "bar" }');
  });

  it('should parse application/graphql-response+json as json', async () => {
    const data = { foo: 'bar' };
    const { getByTestId } = render(
      <CodeDisplay data={JSON.stringify(data)} contentType="application/graphql-response+json" />,
    );

    const reactJson = await waitFor(() => getByTestId('lang-json'));
    expect(reactJson).toHaveTextContent('{ "foo": "bar" }');
  });

  it('should parse application/json with charset', async () => {
    const data = { foo: 'bar' };
    const { getByTestId } = render(
      <CodeDisplay data={JSON.stringify(data)} contentType="application/json; ; charset=utf-8" />,
    );

    const reactJson = await waitFor(() => getByTestId('lang-json'));
    expect(reactJson).toHaveTextContent('{ "foo": "bar" }');
  });

  it('should use txt language when contentType is undefined', async () => {
    const data = { foo: 'bar' };
    const { getByTestId } = render(<CodeDisplay data={JSON.stringify(data)} />);

    const reactJson = await waitFor(() => getByTestId('lang-txt'));
    expect(reactJson).toHaveTextContent('{"foo":"bar"}');
  });
});
