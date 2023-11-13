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
        'text-[#52535D] ring-[#8D90A1] bg-[#EEEFF1]',
        border === 'none' && 'bg-transparent',

        // disabled
        'disabled:text-[#B5B9C4] disabled:ring-[#CBCFD6] disabled:bg-[#EEEFF1]',
        border === 'none' && 'bg-transparent',

        // focus
        'focus:text-[#214A1D] focus:ring-[#378F2A] focus:bg-[#CAEFC3]',

        // hover
        'hover:text-[#214A1D] hover:ring-[#2D7124] hover:bg-[#CAEFC3]',

        // pressed
        'active:text-[#0D280B] active:ring-[#48AE39] active:bg-[#48AE39]',

        // selected
        selected && 'text-[#0D280B] ring-[#6CC95F] bg-[#6CC95F]',

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
