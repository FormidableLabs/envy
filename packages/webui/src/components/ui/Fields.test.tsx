import { cleanup, render } from '@testing-library/react';

import Fields, { Field } from './Fields';

describe('Fields', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render without error', () => {
    render(
      <Fields>
        <Field label="Foo">Bar</Field>
      </Fields>,
    );
  });

  it('should render child fields', () => {
    const { getByTestId } = render(
      <Fields data-test-id="fields">
        <Field label="Foo">Bar</Field>
        <Field label="Baz">Qux</Field>
      </Fields>,
    );

    const fields = getByTestId('fields');
    expect(fields.firstChild?.childNodes).toHaveLength(2);
  });

  it('should render field label and content', () => {
    const { getByTestId } = render(
      <Fields data-test-id="fields">
        <Field label="Foo">Bar</Field>
        <Field label="Baz">Qux</Field>
      </Fields>,
    );

    const fields = getByTestId('fields');
    const field1 = fields.firstChild?.childNodes.item(0);
    const field2 = fields.firstChild?.childNodes.item(1);

    expect(field1).toHaveTextContent('Foo');
    expect(field1).toHaveTextContent('Bar');

    expect(field2).toHaveTextContent('Baz');
    expect(field2).toHaveTextContent('Qux');
  });

  it('should not render any field items without children', () => {
    const { getByTestId } = render(
      <Fields data-test-id="fields">
        <Field label="Foo"></Field>
      </Fields>,
    );

    const fields = getByTestId('fields');
    expect(fields.firstChild?.childNodes).toHaveLength(0);
  });
});
