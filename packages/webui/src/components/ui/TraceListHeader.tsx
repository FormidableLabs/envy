import { tw } from '@/utils';

type TraceListHeaderProps = React.HtmlHTMLAttributes<HTMLDivElement>;

export default function TraceListHeader({ className, children, ...props }: TraceListHeaderProps) {
  return (
    <div className={tw('table-cell p-cell border-b border-primary', className)} {...props}>
      {children}
    </div>
  );
}
