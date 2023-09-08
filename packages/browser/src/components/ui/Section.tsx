import { useState } from 'react';
import { HiMinus, HiPlus } from 'react-icons/hi';

import { tw } from '@/utils';

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  title?: string;
  collapsible?: boolean;
};

export default function Section({ title, collapsible = true, className, children }: SectionProps) {
  const [expanded, setExpanded] = useState(true);
  const Icon = expanded ? HiMinus : HiPlus;
  return (
    <>
      {title && (
        <div
          className={tw(
            `relative p-short`,
            `bg-slate-400 border-b border-slate-600 shadow-lg`,
            `font-semibold uppercase`,
            collapsible ? 'cursor-pointer' : '',
            className || '',
          )}
          onClick={() => {
            if (collapsible) setExpanded(x => !x);
          }}
        >
          {title}
          {collapsible && <Icon className="absolute-v-center right-6" />}
        </div>
      )}
      {children && expanded && <div className="p-6">{children}</div>}
    </>
  );
}
