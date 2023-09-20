import { cleanup, render } from '@testing-library/react';

import Label from './Label';

describe('Label', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render without error', () => {
    render(<Label label="My label text" />);
  });

  it('should render `label` as child', () => {
    const { container } = render(<Label label="My label text" />);
    expect(container).toHaveTextContent('My label text');
  });
});
