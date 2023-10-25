import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

import { tw } from '@/utils';

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  title?: string;
  collapsible?: boolean;
};

export default function Section({ title, collapsible = true, className, children, ...props }: SectionProps) {
  const [expanded, setExpanded] = useState(true);
  const Icon = expanded ? ChevronDown : ChevronUp;
  return (
    <>
      {title && (
        <div
          data-test-id="section-title"
          className={tw(
            `flex flex-row items-center px-3 py-2`,
            `bg-gray-300 border-b border-t border-primary`,
            `font-bold uppercase`,
            collapsible ? 'cursor-pointer' : '',
            className,
          )}
          onClick={() => {
            if (collapsible) setExpanded(x => !x);
          }}
          {...props}
        >
          <div className="flex-1">{title}</div>
          {collapsible && <Icon className="h-4 w-4" />}
        </div>
      )}
      {children && expanded && (
        <div data-test-id="section-content" className="mb-2">
          {children}
        </div>
      )}
    </>
  );
}
