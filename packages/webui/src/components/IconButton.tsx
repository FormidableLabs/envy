import { Ref, forwardRef } from 'react';
import { IconType } from 'react-icons';

import Button, { ButtonProps } from './Button';

type IconButtonProps = ButtonProps & {
  Icon?: IconType;
};

function IconButton({ Icon, children, ...props }: IconButtonProps, ref: Ref<HTMLButtonElement>) {
  return (
    <Button ref={ref} {...props}>
      {Icon && <Icon />}
      {children}
    </Button>
  );
}

export default forwardRef(IconButton);
