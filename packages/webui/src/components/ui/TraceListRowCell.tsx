import { tw } from '@/utils';

type TraceListRowCellProps = React.HtmlHTMLAttributes<HTMLDivElement>;

export default function TraceListRowCell({ className, children, ...props }: TraceListRowCellProps) {
  return (
    <div
      className={tw(
        'table-cell p-cell align-middle border-b border-solid border-gray-300 whitespace-nowrap overflow-hidden',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
