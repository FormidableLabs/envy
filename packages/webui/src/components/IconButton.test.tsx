import { cleanup, render } from '@testing-library/react';

import IconButton from './IconButton';

describe('IconButton', () => {
  function Icon() {
    return <div data-test-id="mock-icon">Mock Icon component</div>;
  }

  afterEach(() => {
    cleanup();
  });

  it('should render without error', () => {
    render(<IconButton Icon={Icon} />);
  });

  it('should render icon before button label', () => {
    const { getByTestId } = render(<IconButton Icon={Icon}>Button label</IconButton>);

    const icon = getByTestId('mock-icon');

    expect(icon).toBeVisible();
    expect(icon.nextSibling).toHaveTextContent('Button label');
  });
});
