import { cleanup, render } from '@testing-library/react';

import Loading from './Loading';

describe('Loading', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render without error', () => {
    render(<Loading />);
  });

  it.each([
    [2, ['w-2', 'h-2']],
    [3, ['w-3', 'h-3']],
    [4, ['w-4', 'h-4']],
    [8, ['w-8', 'h-8']],
    [32, ['w-32', 'h-32']],
  ])('should render correct classes for size `%s`', (size, classNames) => {
    const { getByTestId } = render(<Loading data-test-id="loading" size={size as any} />);
    const loading = getByTestId('loading');

    for (const className of classNames) {
      expect(loading).toHaveClass(className);
    }
  });
});
