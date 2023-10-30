import { HTMLAttributes } from 'react';

import { tw } from '@/utils';

type BadgeProps = HTMLAttributes<HTMLSpanElement>;

export default function Badge({ className, children }: BadgeProps) {
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
