import { act, cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DarkModeToggle from './DarkModeToggle';

function isDarkModeOnRoot() {
  return document.documentElement.classList.contains('dark');
}

describe('DarkModeToggle', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render without error', () => {
    render(<DarkModeToggle />);
  });

  it('should toggle the class on the root element', async () => {
    const isDarkMode = isDarkModeOnRoot();

    const { getByRole } = render(<DarkModeToggle />);
    const toggle = getByRole('toggle');

    await act(async () => {
      await userEvent.click(toggle);
    });

    const expectedDarkMode = isDarkModeOnRoot();
    expect(expectedDarkMode).toEqual(!isDarkMode);
  });
});
