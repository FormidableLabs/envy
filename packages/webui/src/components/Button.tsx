import { MouseEvent, Ref, RefObject, forwardRef, useRef } from 'react';

import { tw } from '@/utils';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  border?: 'standard' | 'none';
  Icon?: React.FC<any>;
  selected?: boolean;
  size?: 'small' | 'standard';
};

function Button(
  { Icon, selected, onClick, className, size = 'standard', border = 'standard', children, ...props }: ButtonProps,
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
        // layout
        'inline-flex items-center gap-x-1.5 p-1.5',
        !!children && 'px-2',

        // common styles
        'border border-solid rounded-[0.25rem] font-bold shadow-sm uppercase',
        border === 'none' && 'border-none shadow-none',

        // base colors
        'text-manatee-900 border-manatee-600 bg-manatee-100',
        border === 'none' && 'bg-transparent',

        // disabled
        'disabled:text-manatee-400 disabled:border-manatee-300 disabled:bg-manatee-100',
        border === 'none' && 'bg-transparent',

        // focus
        'focus:text-apple-900 focus:border-apple-600 focus:bg-apple-200',

        // hover
        'hover:text-apple-900 hover:border-apple-700 hover:bg-apple-200',

        // pressed
        'active:text-apple-950 active:border-apple-500 active:bg-apple-500',

        // selected
        selected && 'text-apple-950 border-apple-400 bg-apple-400',

        // small
        size === 'small' && 'p-1 text-xs',
        size === 'small' && !!children && 'px-2',

        // externals
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {Icon && <Icon size={size === 'small' ? 12 : 24} />}
      {children}
    </button>
  );
}

export default forwardRef(Button);
