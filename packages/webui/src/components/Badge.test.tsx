import { cleanup, render } from '@testing-library/react';

import Badge from './Badge';

describe('badge', () => {
  afterEach(() => {
    cleanup();
  });

  it('should not overwrite base css classes', () => {
    const { container } = render(<Badge className="lkj">Label</Badge>);
    expect(container.firstChild).toHaveClass('lkj');
    expect(container.firstChild).toHaveClass('inline-flex');
  });
});
