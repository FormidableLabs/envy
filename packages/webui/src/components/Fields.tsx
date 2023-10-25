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
    <div className={tw('w-full table-fixed text-sm px-3 py-2', className)} {...props}>
      <div className="space-y-2 table-row-group">{children}</div>
    </div>
  );
}

export function Field({ label, className, children, ...props }: FieldProps) {
  if (!children) return null;
  return (
    <div className="table-row" {...props}>
      <div className={tw('table-cell w-40', className)}>
        <Label label={label} />
      </div>
      <div className="table-cell font-mono">{children}</div>
    </div>
  );
}
