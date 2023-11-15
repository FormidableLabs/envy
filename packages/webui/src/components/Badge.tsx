import { HTMLAttributes } from 'react';

import { tw } from '@/utils';

type BadgeProps = HTMLAttributes<HTMLSpanElement>;

export default function Badge({ className, children }: BadgeProps) {
  return (
    <span
      className={tw(
        'inline-flex items-center rounded-full bg-[#787B8A] px-2 py-1.5 text-xs font-medium text-white',
        className,
      )}
    >
      {children}
    </span>
  );
}
