import { cleanup, render } from '@testing-library/react';

import { setUsePlatformData } from '@/testing/mockUsePlatform';

import SearchInput from './SearchInput';

jest.mock('react-icons/hi', () => ({
  HiOutlineSearch: function MockHiOutlineSearch() {
    return <>Mock HiOutlineSearch component</>;
  },
}));

jest.mock('@/hooks/usePlatform');

describe('SearchInput', () => {
  beforeEach(() => {
    setUsePlatformData('mac');
  });

  afterEach(() => {
    cleanup();
  });

  it('should render without error', () => {
    render(<SearchInput />);
  });

  it('should render an input with the role "searchbox"', () => {
    const { getByRole } = render(<SearchInput />);

    const input = getByRole('searchbox');
    expect(input).toBeInTheDocument();
  });

  it('should display search icon in text box', () => {
    const { getByRole } = render(<SearchInput />);

    const input = getByRole('searchbox');
    expect(input.previousSibling).toHaveTextContent('Mock HiOutlineSearch component');
  });

  it('should display focus key if suppied', () => {
    const { getByRole } = render(<SearchInput focusKey="K" />);

    const input = getByRole('searchbox');
    expect(input.nextSibling).toHaveTextContent('⌘K');
  });
});
