import { useState } from 'react';
import { HiMinus, HiPlus } from 'react-icons/hi';

import { tw } from '@/utils';

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  title?: string;
  collapsible?: boolean;
};

export default function Section({ title, collapsible = true, className, children, ...props }: SectionProps) {
  const [expanded, setExpanded] = useState(true);
  const Icon = expanded ? HiMinus : HiPlus;
  return (
    <>
      {title && (
        <div
          data-test-id="section-title"
          className={tw(
            `relative p-short`,
            `bg-secondary border-b border-primary shadow-lg`,
            `font-semibold uppercase`,
            collapsible ? 'cursor-pointer' : '',
            className || '',
          )}
          onClick={() => {
            if (collapsible) setExpanded(x => !x);
          }}
          {...props}
        >
          {title}
          {collapsible && <Icon className="absolute-v-center right-6" />}
        </div>
      )}
      {children && expanded && (
        <div data-test-id="section-content" className="p-6">
          {children}
        </div>
      )}
    </>
  );
}
