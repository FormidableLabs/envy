import { cleanup, render } from '@testing-library/react';

import KeyValueList, { KeyValuePair } from './KeyValueList';

describe('KeyValueList', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render all key value pairs', () => {
    const data: KeyValuePair[] = [
      ['foo:', 'bar'],
      ['baz:', 'qux'],
    ];

    const { getAllByTestId } = render(<KeyValueList values={data} />);
    const items = getAllByTestId('key-value-item');

    expect(items).toHaveLength(2);
    expect(items.at(0)!).toHaveTextContent('foo:bar');
    expect(items.at(1)!).toHaveTextContent('baz:qux');
  });

  it('should URI decode any string value for a key value pair', () => {
    const data: KeyValuePair[] = [['foo:', 'this%20is%20%22encoded%22']];

    const { getAllByTestId } = render(<KeyValueList values={data} />);
    const items = getAllByTestId('key-value-item');

    expect(items).toHaveLength(1);
    expect(items.at(0)!).toHaveTextContent('foo:this is "encoded"');
  });

  it('should render non-string primitive values for a key value pair', () => {
    const data: KeyValuePair[] = [
      ['number:', 0],
      ['boolean:', true],
    ];

    const { getAllByTestId } = render(<KeyValueList values={data} />);
    const items = getAllByTestId('key-value-item');

    expect(items).toHaveLength(2);
    expect(items.at(0)!).toHaveTextContent('number:0');
    expect(items.at(1)!).toHaveTextContent('boolean:true');
  });

  it('should allow components to be rendered as values for a key value pair', () => {
    function Component() {
      return <div data-test-id="mock-value-component">Mock value component</div>;
    }
    const data: KeyValuePair[] = [['component:', <Component key="0" />]];

    const { getAllByTestId } = render(<KeyValueList values={data} />);
    const items = getAllByTestId('key-value-item');

    expect(items).toHaveLength(1);
    expect(items.at(0)!).toHaveTextContent('component:Mock value component');
  });

  it('should render nothing if no key-value pairs are supplied', () => {
    const { container } = render(<KeyValueList values={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
