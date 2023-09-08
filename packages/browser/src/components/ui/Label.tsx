type LabelProps = React.HTMLAttributes<HTMLElement> & {
  label: string;
};

export default function Label({ label, className }: LabelProps) {
  return (
    <div className={`font-lg font-bold mb-2 uppercase ${className}`}>
      {label}
    </div>
  );
}
