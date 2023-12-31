import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';

import Button from './Button';

describe('Button', () => {
  function Icon() {
    return <div data-test-id="mock-icon">Mock Icon component</div>;
  }

  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it('should render without error', () => {
    render(<Button>Button</Button>);
  });

  it('should call onClick handler when clicked', async () => {
    const handler = jest.fn();
    render(
      <Button role="button" onClick={handler}>
        Button
      </Button>,
    );

    expect(handler).not.toHaveBeenCalled();

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(handler).toHaveBeenCalled();
  });

  it('should forward ref to button', async () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toBe(ref.current);
  });

  it('should render icon before button label', () => {
    const { getByTestId } = render(<Button Icon={Icon}>Button label</Button>);

    const icon = getByTestId('mock-icon');

    expect(icon).toBeVisible();
    expect(icon.nextSibling).toHaveTextContent('Button label');
  });

  it('should call onClick handler when clicked', async () => {
    const handler = jest.fn();
    render(
      <Button role="button" onClick={handler}>
        Button
      </Button>,
    );

    expect(handler).not.toHaveBeenCalled();

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(handler).toHaveBeenCalled();
  });

  it('should forward ref to button', async () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toBe(ref.current);
  });
});
