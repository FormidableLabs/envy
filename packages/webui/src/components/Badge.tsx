import { tw } from '@/utils';

export default function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={tw(
        'inline-flex items-center rounded-full bg-gray-400 px-3 py-1 text-sm font-medium text-white',
        className,
      )}
    >
      {children}
    </span>
  );
}
