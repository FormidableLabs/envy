import { Trash } from 'lucide-react';
import { UIEvent, useLayoutEffect, useRef, useState } from 'react';

import { IconButton, ToggleSwitch } from '@/components';
import useApplication from '@/hooks/useApplication';

import TraceListHeader from './TraceListHeader';
import TraceListPlaceholder from './TraceListPlaceholder';
import TraceListRow from './TraceListRow';

type TraceListProps = React.HTMLAttributes<HTMLElement> & {
  autoScroll?: boolean;
};

export default function TraceList({ autoScroll: initialAutoScroll = true }: TraceListProps) {
  const { clearTraces, traces, newestTraceId, selectedTraceId } = useApplication();
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
    <div className="h-full flex flex-col">
      <div
        data-test-id="scroll-container"
        ref={scrollContainer}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
        {!hasTraces ? (
          <TraceListPlaceholder />
        ) : (
          <div data-test-id="trace-list" className="table table-fixed w-full relative">
            <div className="table-header-group font-bold bg-primary sticky top-0 uppercase">
              <TraceListHeader className="w-[50px]" data-test-id="column-heading-badge" />
              <TraceListHeader data-test-id="column-heading-request">Request</TraceListHeader>
              {!selectedTraceId && (
                <>
                  <TraceListHeader className="w-[85px]" data-test-id="column-heading-method">
                    Method
                  </TraceListHeader>
                  <TraceListHeader className="w-[85px]" data-test-id="column-heading-status">
                    Status
                  </TraceListHeader>
                  <TraceListHeader className="text-right w-[85px]" data-test-id="column-heading-code">
                    Code
                  </TraceListHeader>
                </>
              )}
              <TraceListHeader className="text-right w-[85px]" data-test-id="column-heading-time">
                Time
              </TraceListHeader>
            </div>
            <div className="flex-1 table-row-group">
              {data.map(trace => (
                <TraceListRow trace={trace} key={trace.id} />
              ))}
            </div>
          </div>
        )}
      </div>
      {hasTraces && (
        <div className="flex flex-row items-center border-t border-primary p-3">
          <div data-test-id="trace-count" className="flex-1 font-semibold uppercase">
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
            <IconButton Icon={Trash} size="small" onClick={clearTraces} className="uppercase">
              Clear
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
}
