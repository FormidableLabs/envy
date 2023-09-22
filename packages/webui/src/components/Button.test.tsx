import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';

import Button, { ButtonProps } from './Button';

describe('Button', () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it('should render without error', () => {
    render(<Button>Button</Button>);
  });

  it.each(['standard', 'action', 'ghost', 'danger'])(
    'should set correct className when `type` is "%s"',
    (type: string) => {
      render(<Button type={type as ButtonProps['type']}>Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass(`btn-${type}`);
    },
  );

  it('should set correct className when `short` prop is used', () => {
    render(<Button short>Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-short');
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
