import { tw } from '@/utils';

import Label from './Label';

type FieldProps = React.HTMLAttributes<HTMLElement> & {
  label: string;
};

type FieldsProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
  children: React.ReactNode | React.ReactNode[];
};

export default function Fields({ className, children, ...props }: FieldsProps) {
  return (
    <div className={tw('table table-fixed w-full', className)} {...props}>
      <div className="table-row-group">{children}</div>
    </div>
  );
}

export function Field({ label, className, children, ...props }: FieldProps) {
  if (!children) return null;
  return (
    <div className="table-row table-fixed" {...props}>
      <div className={tw('table-cell pr-2 w-36', className)}>
        <Label label={label} />
      </div>
      <div className="table-cell pb-2 align-top whitespace-normal font-mono">{children}</div>
    </div>
  );
}
