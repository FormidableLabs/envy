import { cleanup, render } from '@testing-library/react';

import Code from './Code';

jest.mock('@/utils', () => ({
  ...jest.requireActual('@/utils'),
  prettyFormat: (input: string) => `pretty_${input}`,
}));

describe('Code', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render without error', () => {
    render(<Code>const x = 1;</Code>);
  });

  it('should render correctly when `inline` prop is supplied', () => {
    const { getByTestId } = render(
      <Code data-test-id="code" inline>
        const x = 1;
      </Code>,
    );
    const code = getByTestId('code');

    expect(code.nodeName).toEqual('DIV');
    expect(code).toHaveClass('code-inline');
    expect(code).toHaveTextContent('const x = 1;');
  });

  it('should render each line in a separate list item', () => {
    const { getByTestId } = render(
      <Code data-test-id="code" prettify>
        {`const x = 1;
          const y = 2;
          const z = 3;`}
      </Code>,
    );
    const code = getByTestId('code');

    expect(code.nodeName).toEqual('DIV');
    expect(code).toHaveClass('code-block');
    expect(code.querySelectorAll('li')).toHaveLength(3);
  });

  it('should render prettified content when `prettify` prop is supplied', () => {
    const { getByTestId } = render(
      <Code data-test-id="code" prettify>
        const x = 1;
      </Code>,
    );
    const code = getByTestId('code');

    expect(code.nodeName).toEqual('DIV');
    expect(code).toHaveClass('code-block');
    expect(code).toHaveTextContent('pretty_const x = 1;');
  });

  it('should render unmodified code when `prettify` prop is `false`', () => {
    const { getByTestId } = render(<Code data-test-id="code" prettify={false}>{`const x = 1;`}</Code>);
    const code = getByTestId('code');

    expect(code.nodeName).toEqual('DIV');
    expect(code).toHaveClass('code-block');
    expect(code).toHaveTextContent('const x = 1;');
  });

  it('should render correctly if JSON is supplied', () => {
    const { getByTestId } = render(<Code data-test-id="code">{{ foo: 'bar' }}</Code>);
    const code = getByTestId('code');

    expect(code.nodeName).toEqual('DIV');
    expect(code).toHaveClass('code-block');

    expect(code.querySelectorAll('li')[0]).toHaveTextContent('{');
    expect(code.querySelectorAll('li')[1]).toHaveTextContent('"foo": "bar"');
    expect(code.querySelectorAll('li')[2]).toHaveTextContent('}');
  });

  it('should render empty content if no children are supplied', () => {
    const { getByTestId } = render(<Code data-test-id="code"></Code>);
    const code = getByTestId('code');

    expect(code.nodeName).toEqual('DIV');
    expect(code).toHaveClass('code-block');
    expect(code).toHaveTextContent('');
  });
});
