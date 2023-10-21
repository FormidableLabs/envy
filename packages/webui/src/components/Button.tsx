import { MouseEvent, Ref, RefObject, forwardRef, useRef } from 'react';

import { tw } from '@/utils';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ onClick, className, children, ...props }: ButtonProps, ref: Ref<HTMLButtonElement>) {
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
        'flex gap-2 items-center p-2 text-sm text-secondary border border-solid border-primary rounded-md shadow-sm hover:bg-gray-50',
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
