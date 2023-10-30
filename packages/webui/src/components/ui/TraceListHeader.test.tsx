import { cleanup, render } from '@testing-library/react';

import TraceListHeader from './TraceListHeader';

describe('TraceListHeader', () => {
  afterEach(() => {
    cleanup();
  });

  it('should not overwrite base css classes', () => {
    const { container } = render(<TraceListHeader className="lkj" />);
    expect(container.firstChild).toHaveClass('table-cell');
    expect(container.firstChild).toHaveClass('lkj');
  });
});
