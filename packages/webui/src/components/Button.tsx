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
        'inline-flex items-center gap-x-1.5 p-2',
        !!children && 'px-3',

        // common styles
        'ring-1 ring-inset rounded-md font-bold shadow-sm uppercase',
        border === 'none' && 'ring-0 shadow-none',

        // base colors
        'text-manatee-900 ring-manatee-600 bg-manatee-100',
        border === 'none' && 'bg-transparent',

        // disabled
        'disabled:text-manatee-400 disabled:ring-manatee-300 disabled:bg-manatee-100',
        border === 'none' && 'bg-transparent',

        // focus
        'focus:text-apple-900 focus:ring-apple-600 focus:bg-apple-200',

        // hover
        'hover:text-apple-900 hover:ring-[#2D7124] hover:bg-apple-200',

        // pressed
        'active:text-apple-950 active:ring-apple-500 active:bg-apple-500',

        // selected
        selected && 'text-apple-950 ring-apple-400 bg-apple-400',

        // small
        size === 'small' && 'p-1.5 text-xs',
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
