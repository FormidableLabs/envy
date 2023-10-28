import { cleanup, render } from '@testing-library/react';

import TraceListRowCell from './TraceListRowCell';

describe('TraceListRowCell', () => {
  afterEach(() => {
    cleanup();
  });

  it('should not overwrite base css classes', () => {
    const { container } = render(<TraceListRowCell className="lkj" />);
    expect(container.firstChild).toHaveClass('table-cell');
    expect(container.firstChild).toHaveClass('lkj');
  });
});
