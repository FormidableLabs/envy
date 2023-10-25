import { Ref, forwardRef } from 'react';

import { tw } from '@/utils';

import Button, { ButtonProps } from './Button';

export type IconButtonProps = ButtonProps & {
  Icon?: React.FC<any>;
};

function IconButton({ Icon, children, size, ...props }: IconButtonProps, ref: Ref<HTMLButtonElement>) {
  return (
    <Button ref={ref} size={size} {...props}>
      <div className="flex flex-row gap-2">
        {Icon && <Icon className={tw('h-6 w-6', size === 'small' && 'h-4 w-4')} />}
        {children}
      </div>
    </Button>
  );
}

export default forwardRef(IconButton);
