import { cleanup, render } from '@testing-library/react';

import DateTime from './DateTime';

describe('DateTime', () => {
  const time = 1695198462902; // 2023-09-20 08:27:42 UTC

  afterEach(() => {
    cleanup();
  });

  it('should render without error', () => {
    render(<DateTime time={time} />);
  });

  it('should render nothing if no time is provided', () => {
    const { container } = render(<DateTime time={undefined} />);

    expect(container.childElementCount).toEqual(0);
  });

  it('should render the time in the expected format', () => {
    const { container } = render(<DateTime time={time} />);

    expect(container).toHaveTextContent('2023-09-20 @ 08:27:42');
  });
});
