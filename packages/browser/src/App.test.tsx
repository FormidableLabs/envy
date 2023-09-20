import { cleanup, render } from '@testing-library/react';

import App from './App';

describe('App', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render without error', () => {
    render(<App />);
  });
});
