import { tw } from '@/utils';

type LabelProps = React.HTMLAttributes<HTMLElement> & {
  label: string;
};

export default function Label({ label, className, ...props }: LabelProps) {
  return (
    <div className={tw('font-lg font-bold mb-2 uppercase', className)} {...props}>
      {label}
    </div>
  );
}
