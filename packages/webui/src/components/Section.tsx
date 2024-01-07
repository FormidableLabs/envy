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
            `flex flex-row items-center py-3 pr-3`,
            `font-bold uppercase`,
            collapsible ? 'cursor-pointer' : '',
            className,
          )}
          onClick={() => {
            if (collapsible) setExpanded(x => !x);
          }}
          {...props}
        >
          <div className={tw('flex-1', !expanded && 'opacity-50')}>{title}</div>
          {collapsible && <Icon className="h-6 w-6" />}
        </div>
      )}
      {children && expanded && (
        <div data-test-id="section-content" className="pb-4 border-b border-manatee-400">
          {children}
        </div>
      )}
    </>
  );
}
