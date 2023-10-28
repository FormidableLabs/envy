import { act, cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ToggleSwitch from './ToggleSwitch';

jest.mock('lucide-react', () => ({
  CheckSquare: function CheckSquare() {
    return <div data-test-id="checkmark">Mock CheckSqaure component</div>;
  },
  Square: function Square() {
    return <>Mock Square component</>;
  },
}));

describe('ToggleSwitch', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render without error', () => {
    render(<ToggleSwitch />);
  });

  it('should render a custom label', () => {
    const { getByTestId } = render(<ToggleSwitch label="Foo" />);

    const label = getByTestId('label');
    expect(label).toHaveTextContent('Foo');
  });

  describe('initial checked state', () => {
    it('should not display checkmark by default', () => {
      const { queryByTestId } = render(<ToggleSwitch />);

      const checkmark = queryByTestId('checkmark');
      expect(checkmark).not.toBeInTheDocument();
    });

    it('should not display checkmark when `checked` is false', () => {
      const { queryByTestId } = render(<ToggleSwitch checked={false} />);

      const checkmark = queryByTestId('checkmark');
      expect(checkmark).not.toBeInTheDocument();
    });

    it('should display checkmark when `checked` is true', () => {
      const { getByTestId } = render(<ToggleSwitch checked={true} />);

      const checkmark = getByTestId('checkmark');
      expect(checkmark).toBeVisible();
    });
  });

  describe('interaction', () => {
    it('should toggle checkmark on when clicked', async () => {
      const { container, queryByTestId } = render(<ToggleSwitch />);

      const toggleSwitch = container.firstElementChild!;

      const checkmarkBefore = queryByTestId('checkmark');
      expect(checkmarkBefore).not.toBeInTheDocument();

      await act(async () => {
        await userEvent.click(toggleSwitch);
      });

      const checkmarkAfter = queryByTestId('checkmark');
      expect(checkmarkAfter).toBeVisible();
    });

    it('should toggle checkmark off when clicked', async () => {
      const { container, queryByTestId } = render(<ToggleSwitch checked={true} />);

      const toggleSwitch = container.firstElementChild!;

      const checkmarkBefore = queryByTestId('checkmark');
      expect(checkmarkBefore).toBeVisible();

      await act(async () => {
        await userEvent.click(toggleSwitch);
      });

      const checkmarkAfter = queryByTestId('checkmark');
      expect(checkmarkAfter).not.toBeInTheDocument();
    });

    it('should trigger `onChange` handler with `true` when checked', async () => {
      const onChangeFn = jest.fn();

      const { container } = render(<ToggleSwitch onChange={onChangeFn} />);

      const toggleSwitch = container.firstElementChild!;

      await act(async () => {
        await userEvent.click(toggleSwitch);
      });

      expect(onChangeFn).toHaveBeenCalledWith(true);
    });

    it('should trigger `onChange` handler with `false` when unchecked', async () => {
      const onChangeFn = jest.fn();

      const { container } = render(<ToggleSwitch onChange={onChangeFn} checked={true} />);

      const toggleSwitch = container.firstElementChild!;

      await act(async () => {
        await userEvent.click(toggleSwitch);
      });

      expect(onChangeFn).toHaveBeenCalledWith(false);
    });
  });
});
