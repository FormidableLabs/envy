import { tw } from '@/utils';

type FieldProps = React.HTMLAttributes<HTMLElement> & {
  label: string;
};

type FieldsProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
  children: React.ReactNode | React.ReactNode[];
};

export default function Fields({ className, children, ...props }: FieldsProps) {
  return (
    <table className={tw('table table-fixed min-w-full text-xs', className)} {...props}>
      <tbody>{children}</tbody>
    </table>
  );
}

export function Field({ label, className, children, ...props }: FieldProps) {
  if (!children) return null;
  return (
    <tr className={className} {...props}>
      <td className={tw('table-cell w-[200px] py-1 font-semibold font-mono uppercase', className)}>{label}</td>
      <td className="table-cell font-mono">{children}</td>
    </tr>
  );
}
