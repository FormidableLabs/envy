import { MouseEvent, Ref, RefObject, forwardRef, useRef } from 'react';

import { tw } from '@/utils';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'small' | 'standard' | 'large';
  border?: 'standard' | 'ghost';
};

function Button(
  { onClick, className, size = 'standard', border = 'standard', children, ...props }: ButtonProps,
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
      className={tw(
        'p-2 text-secondary bg-primary border border-solid border-primary rounded-md shadow-sm hover:bg-gray-50',
        border === 'ghost' && 'bg-transparent border-transparent shadow-none',
        size === 'small' && 'text-sm h-7 p-1',
        size === 'large' && 'h-10',
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default forwardRef(Button);
