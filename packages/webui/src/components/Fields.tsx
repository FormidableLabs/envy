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
    <div className={tw('sm:table sm:table-fixed w-full', className)} {...props}>
      <div className="space-y-4 sm:gap-0 sm:table-row-group">{children}</div>
    </div>
  );
}

export function Field({ label, className, children, ...props }: FieldProps) {
  if (!children) return null;
  return (
    <div className="sm:table-row sm:table-fixed" {...props}>
      <div className={tw('sm:table-cell pr-2 w-36', className)}>
        <Label label={label} />
      </div>
      <div className="sm:table-cell pb-2 align-top whitespace-normal font-mono">{children}</div>
    </div>
  );
}
