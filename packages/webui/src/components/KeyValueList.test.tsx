import { cleanup, render, within } from '@testing-library/react';

import KeyValueList, { KeyValuePair } from './KeyValueList';

jest.mock('@/components/Fields', () => ({
  Field: function MockField({ label, children }: React.PropsWithChildren<{ label: string }>) {
    return (
      <div data-test-id="mock-field">
        <div data-test-id="mock-field-label">{label}</div>
        <div data-test-id="mock-field-children">{children}</div>
      </div>
    );
  },
}));

describe('KeyValueList', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render without error', () => {
    const data: KeyValuePair[] = [
      ['foo', 'bar'],
      ['baz', 'qux'],
    ];

    render(<KeyValueList label="Foo" keyValuePairs={data} />);
  });

  it('should render a single Field component even when multiple key-value pairs are supplied', () => {
    const data: KeyValuePair[] = [
      ['foo', 'bar'],
      ['baz', 'qux'],
    ];

    const { getAllByTestId } = render(<KeyValueList label="Foo" keyValuePairs={data} />);
    const fieldComponents = getAllByTestId('mock-field');

    expect(fieldComponents).toHaveLength(1);
  });

  it('should pass the label to the Field component', () => {
    const data: KeyValuePair[] = [
      ['foo', 'bar'],
      ['baz', 'qux'],
    ];

    const { getByTestId } = render(<KeyValueList label="Foo" keyValuePairs={data} />);
    const label = getByTestId('mock-field-label');

    expect(label).toHaveTextContent('Foo');
  });

  it('should render all key value pairs', () => {
    const data: KeyValuePair[] = [
      ['foo', 'bar'],
      ['baz', 'qux'],
    ];

    const { getByTestId } = render(<KeyValueList label="Foo" keyValuePairs={data} />);
    const content = getByTestId('mock-field-children');
    const items = within(content).getAllByTestId('key-value-item');

    expect(items).toHaveLength(2);
    expect(items.at(0)!).toHaveTextContent('foo: bar');
    expect(items.at(1)!).toHaveTextContent('baz: qux');
  });

  it('should URI decode any string value for a key value pair', () => {
    const data: KeyValuePair[] = [['foo', 'this%20is%20%22encoded%22']];

    const { getByTestId } = render(<KeyValueList label="Foo" keyValuePairs={data} />);
    const content = getByTestId('mock-field-children');
    const items = within(content).getAllByTestId('key-value-item');

    expect(items).toHaveLength(1);
    expect(items.at(0)!).toHaveTextContent('foo: this is "encoded"');
  });

  it('should render non-string primitive values for a key value pair', () => {
    const data: KeyValuePair[] = [
      ['number', 0],
      ['boolean', true],
    ];

    const { getByTestId } = render(<KeyValueList label="Foo" keyValuePairs={data} />);
    const content = getByTestId('mock-field-children');
    const items = within(content).getAllByTestId('key-value-item');

    expect(items).toHaveLength(2);
    expect(items.at(0)!).toHaveTextContent('number: 0');
    expect(items.at(1)!).toHaveTextContent('boolean: true');
  });

  it('should allow components to be rendered as values for a key value pair', () => {
    function Component() {
      return <div data-test-id="mock-value-component">Mock value component</div>;
    }
    const data: KeyValuePair[] = [['component', <Component key="0" />]];

    const { getByTestId } = render(<KeyValueList label="Foo" keyValuePairs={data} />);
    const content = getByTestId('mock-field-children');
    const items = within(content).getAllByTestId('key-value-item');

    expect(items).toHaveLength(1);
    expect(items.at(0)!).toHaveTextContent('component: Mock value component');
  });

  it('should render nothing if no key-value pairs are supplied', () => {
    const { container } = render(<KeyValueList label="Foo" keyValuePairs={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
