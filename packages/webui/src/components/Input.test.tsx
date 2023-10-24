import { act, cleanup, fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { setUsePlatformData } from '@/testing/mockUsePlatform';

import Input from './Input';

jest.mock('lucide-react', () => ({
  X: function MockX() {
    return <>Mock X component</>;
  },
}));

describe('Input', () => {
  beforeEach(() => {
    setUsePlatformData('mac');
  });

  afterEach(() => {
    cleanup();
  });

  it('should render without error', () => {
    render(<Input />);
  });

  it('should render an input with the role "textbox"', () => {
    const { getByRole } = render(<Input />);

    const input = getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  describe('icon', () => {
    it('should display icon in text box if supplied', () => {
      const Icon = () => <>Mock Icon</>;
      const { getByRole } = render(<Input Icon={Icon} />);

      const input = getByRole('textbox');
      expect(input.previousSibling).toHaveTextContent('Mock Icon');
    });
  });

  describe('focus key', () => {
    it('should display mac-specific focus key if suppied', () => {
      setUsePlatformData('mac');

      const { getByTestId } = render(<Input focusKey="K" />);

      const focusKey = getByTestId('focus-key');
      expect(focusKey).toHaveTextContent('⌘K');
    });

    it('should display windows-specific focus key if suppied', () => {
      setUsePlatformData('windows');

      const { getByTestId } = render(<Input focusKey="K" />);

      const focusKey = getByTestId('focus-key');
      expect(focusKey).toHaveTextContent('CTRL+K');
    });
  });

  describe('keyboard shortcuts', () => {
    it('should not focus textbox when no focus key is supplied', () => {
      setUsePlatformData('mac');

      const { getByRole } = render(<Input />);
      const input = getByRole('textbox');

      expect(input).not.toHaveFocus();

      const event = new KeyboardEvent('keydown', { key: 'K', metaKey: false });
      document.dispatchEvent(event);

      expect(input).not.toHaveFocus();
    });

    it('should not focus textbox when focus key is used without special key', () => {
      setUsePlatformData('mac');

      const { getByRole } = render(<Input focusKey="K" />);
      const input = getByRole('textbox');

      expect(input).not.toHaveFocus();

      const event = new KeyboardEvent('keydown', { key: 'K', metaKey: false });
      document.dispatchEvent(event);

      expect(input).not.toHaveFocus();
    });

    it('should focus textbox when focus key is used with special key (mac)', () => {
      setUsePlatformData('mac');

      const { getByRole } = render(<Input focusKey="K" />);
      const input = getByRole('textbox');

      expect(input).not.toHaveFocus();

      const event = new KeyboardEvent('keydown', { key: 'K', metaKey: true });
      document.dispatchEvent(event);

      expect(input).toHaveFocus();
    });

    it('should focus textbox when focus key is used with special key (windows)', () => {
      setUsePlatformData('windows');

      const { getByRole } = render(<Input focusKey="K" />);
      const input = getByRole('textbox');

      expect(input).not.toHaveFocus();

      const event = new KeyboardEvent('keydown', { key: 'K', ctrlKey: true });
      document.dispatchEvent(event);

      expect(input).toHaveFocus();
    });

    it('should blur from textbox when escape key is used', () => {
      setUsePlatformData('mac');

      const { getByRole } = render(<Input focusKey="K" />);
      const input = getByRole('textbox');
      input.focus();

      expect(input).toHaveFocus();

      const event = new KeyboardEvent('keydown', { key: 'escape' });
      document.dispatchEvent(event);

      expect(input).not.toHaveFocus();
    });
  });

  describe('clear button', () => {
    it('should not display clear button when value is blank', () => {
      const { queryByTestId } = render(<Input />);

      const clearButton = queryByTestId('input-clear');
      expect(clearButton).not.toBeInTheDocument();
    });

    it('should display clear button when value is not blank', async () => {
      const { getByRole, getByTestId } = render(<Input />);
      const input = getByRole('textbox');

      await act(async () => {
        await userEvent.type(input, 'Something');
      });

      expect(input).toHaveValue('Something');

      const clearButton = getByTestId('input-clear');
      expect(clearButton).toHaveTextContent('Mock X component');
    });

    it('should clear textbox when clicked', async () => {
      const { getByRole, getByTestId } = render(<Input />);
      const input = getByRole('textbox');

      await act(async () => {
        await userEvent.type(input, 'Something');

        const clearButton = getByTestId('input-clear');
        await userEvent.click(clearButton);
      });

      expect(input).toHaveValue('');
    });
  });

  describe('onChange callback', () => {
    let onChange: jest.Mock;

    beforeEach(() => {
      jest.useFakeTimers();
      onChange = jest.fn();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should not trigger onChange callback immediately on typing a character', () => {
      const { getByRole } = render(<Input onChange={onChange} />);
      const input = getByRole('textbox');

      fireEvent.change(input, {
        target: { value: 'A' },
      });

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should not trigger onChange callback after 299ms delay', () => {
      const { getByRole } = render(<Input onChange={onChange} />);
      const input = getByRole('textbox');

      fireEvent.change(input, {
        target: { value: 'A' },
      });

      jest.advanceTimersByTime(299);

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should trigger onChange callback after 300ms delay', () => {
      const { getByRole } = render(<Input onChange={onChange} />);
      const input = getByRole('textbox');

      fireEvent.change(input, {
        target: { value: 'A' },
      });

      jest.advanceTimersByTime(300);

      expect(onChange).toHaveBeenCalledWith('A');
    });

    it('should debounce onChange calls so that rapid typing only triggers one callback', () => {
      const { getByRole } = render(<Input onChange={onChange} />);
      const input = getByRole('textbox');

      fireEvent.change(input, {
        target: { value: 'A' },
      });
      fireEvent.change(input, {
        target: { value: 'AB' },
      });
      fireEvent.change(input, {
        target: { value: 'ABC' },
      });

      jest.advanceTimersByTime(300);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('ABC');
    });

    it('should trigger multiple onChange callback if typing is slow', () => {
      const { getByRole } = render(<Input onChange={onChange} />);
      const input = getByRole('textbox');

      fireEvent.change(input, {
        target: { value: 'A' },
      });

      jest.advanceTimersByTime(300);

      fireEvent.change(input, {
        target: { value: 'AB' },
      });

      jest.advanceTimersByTime(300);

      fireEvent.change(input, {
        target: { value: 'ABC' },
      });

      jest.advanceTimersByTime(300);

      expect(onChange).toHaveBeenCalledTimes(3);
      expect(onChange).toHaveBeenCalledWith('A');
      expect(onChange).toHaveBeenCalledWith('AB');
      expect(onChange).toHaveBeenCalledWith('ABC');
    });

    it('should trigger onChange callback immediately when clear button is clicked', async () => {
      jest.useRealTimers();

      const { getByRole, getByTestId } = render(<Input onChange={onChange} />);
      const input = getByRole('textbox');

      await act(async () => {
        await userEvent.type(input, 'Something');

        const clearButton = getByTestId('input-clear');
        await userEvent.click(clearButton);
      });

      expect(onChange).toHaveBeenCalledWith('');
    });
  });
});
