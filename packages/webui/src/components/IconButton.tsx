import { Ref, forwardRef } from 'react';

import Button, { ButtonProps } from './Button';

export type IconButtonProps = ButtonProps & {
  Icon?: React.FC<Partial<React.SVGProps<SVGSVGElement>>>;
};

function IconButton({ Icon, children, ...props }: IconButtonProps, ref: Ref<HTMLButtonElement>) {
  return (
    <Button ref={ref} {...props}>
      {Icon && <Icon className="h-6 w-6" />}
      {children}
    </Button>
  );
}

export default forwardRef(IconButton);
