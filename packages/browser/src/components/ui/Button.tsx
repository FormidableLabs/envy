import { forwardRef, MouseEvent, Ref, RefObject, useRef } from 'react';

import { tw } from '@/utils';

export type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  type?: 'standard' | 'action' | 'ghost' | 'danger';
  short?: boolean;
};

function Button(
  { type = 'standard', short, onClick, className, children, ...props }: ButtonProps,
  ref: Ref<HTMLButtonElement>,
) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const finalRef = (ref || buttonRef) as RefObject<HTMLButtonElement>;

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    onClick?.(e);
    finalRef.current?.blur();
  }
  return (
    <button
      ref={finalRef}
      className={tw('btn-icon', short && 'btn-short', type && `btn-${type}`, className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default forwardRef(Button);
