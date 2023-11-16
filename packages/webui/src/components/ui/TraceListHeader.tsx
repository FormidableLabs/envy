import { tw } from '@/utils';

type TraceListHeaderProps = React.HtmlHTMLAttributes<HTMLDivElement>;

export default function TraceListHeader({ className, children, ...props }: TraceListHeaderProps) {
  return (
    <div className={tw('table-cell p-cell border-b border-manatee-400 bg-manatee-200 text-sm', className)} {...props}>
      {children}
    </div>
  );
}
