import { Trash } from 'lucide-react';
import { UIEvent, useLayoutEffect, useRef, useState } from 'react';

import { Button, ToggleSwitch } from '@/components';
import useApplication from '@/hooks/useApplication';

import TraceListHeader from './TraceListHeader';
import TraceListPlaceholder from './TraceListPlaceholder';
import TraceListRow from './TraceListRow';

type TraceListProps = React.HTMLAttributes<HTMLElement> & {
  autoScroll?: boolean;
};

export default function TraceList({ autoScroll: initialAutoScroll = true }: TraceListProps) {
  const { clearTraces, traces, newestTraceId } = useApplication();
  const [autoScroll, setAutoScroll] = useState(initialAutoScroll);

  const data = [...traces.values()];

  const scrollContainer = useRef<HTMLDivElement>(null);

  // when a new trace is added to the list, auto scroll to the bottom of the list unless:
  // - the user has unchcked the "auto scroll" toggleSwitch
  // - the user has manually scrolled the list away from the bottom
  useLayoutEffect(() => {
    if (!autoScroll) return;
    if (!newestTraceId) return;

    scrollContainer.current?.scrollTo({
      top: scrollContainer.current.scrollHeight,
      behavior: 'instant',
    });
  }, [autoScroll, newestTraceId]);

  function handleScroll(e: UIEvent<HTMLDivElement>) {
    const target = e.currentTarget;
    const totalHeight = target.scrollHeight;
    const viewportHeight = target.clientHeight;
    const maxScrollTop = totalHeight - viewportHeight;
    const scrollTop = Math.ceil(target.scrollTop);

    setAutoScroll(scrollTop >= maxScrollTop);
  }

  const hasTraces = data.length > 0;

  return (
    <div className="h-full flex flex-col bg-manatee-100">
      <div
        data-test-id="scroll-container"
        ref={scrollContainer}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
        {!hasTraces ? (
          <TraceListPlaceholder />
        ) : (
          <div data-test-id="trace-list" className="table table-fixed w-full">
            <div className="table-header-group font-bold sticky top-0 uppercase">
              <TraceListHeader className="w-[110px]">Method</TraceListHeader>
              <TraceListHeader>Request</TraceListHeader>
              <TraceListHeader className="text-right w-[85px]">Time</TraceListHeader>
            </div>
            <div className="table-row-group">
              {data.map(trace => (
                <TraceListRow trace={trace} key={trace.id} />
              ))}
            </div>
          </div>
        )}
      </div>
      {hasTraces && (
        <div className="flex flex-row items-center p-3 bg-manatee-200 border-t border-manatee-400">
          <div data-test-id="trace-count" className="flex-1 font-bold uppercase text-xs">
            Traces: {data.length}
          </div>
          <div className="flex flex-row gap-2">
            <ToggleSwitch
              data-test-id="auto-scroll"
              label="Auto scroll"
              checked={autoScroll}
              size="small"
              onChange={value => setAutoScroll(value)}
            />
            <Button Icon={Trash} size="small" onClick={clearTraces}>
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
