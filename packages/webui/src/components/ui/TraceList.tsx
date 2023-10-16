import { UIEvent, useLayoutEffect, useRef, useState } from 'react';
import { HiOutlineEmojiSad, HiOutlineLightningBolt, HiStatusOnline } from 'react-icons/hi';

import { Loading, ToggleSwitch } from '@/components';
import useApplication from '@/hooks/useApplication';
import { ListDataComponent } from '@/systems';
import { Trace } from '@/types';
import { tw } from '@/utils';

type MethodAndStatusProps = {
  method: string;
  statusCode?: number;
};

function MethodAndStatus({ method, statusCode }: MethodAndStatusProps) {
  return (
    <>
      <span className="block">{method.toUpperCase()}</span>
      <span className="block text-xs">{statusCode && statusCode > -1 ? statusCode : '-'}</span>
    </>
  );
}

type TraceListProps = React.HTMLAttributes<HTMLElement> & {
  autoScroll?: boolean;
};

export default function TraceList({ autoScroll: initialAutoScroll = true, className }: TraceListProps) {
  const { connected, connecting, traces, selectedTraceId, newestTraceId, setSelectedTrace } = useApplication();
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
    // we don't want to include selectedTraceId here otherwise closing the trace details will automatically scroll the
    // list to the bottom even if a new trace hasn't been added
    // ---
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newestTraceId]);

  function handleScroll(e: UIEvent<HTMLDivElement>) {
    const target = e.currentTarget;
    const totalHeight = target.scrollHeight;
    const viewportHeight = target.clientHeight;
    const maxScrollTop = totalHeight - viewportHeight;
    const scrollTop = Math.ceil(target.scrollTop);

    setAutoScroll(scrollTop >= maxScrollTop);
  }

  function getMethodAndStatus(trace: Trace) {
    return trace.http ? <MethodAndStatus method={trace.http.method} statusCode={trace.http.statusCode} /> : null;
  }

  function rowStyle(trace: Trace) {
    const statusCode = trace.http?.statusCode;

    let color = '';
    if (!statusCode) color = '';
    else if (statusCode >= 500) color = 'bg-purple-500';
    else if (statusCode >= 400) color = 'bg-red-500';
    else if (statusCode >= 300) color = 'bg-yellow-500';
    else if (statusCode >= 200) color = '';

    return color ? `bg-opacity-20 ${color}` : '';
  }

  function cellStyle(trace: Trace) {
    const statusCode = trace.http?.statusCode;

    let color = 'border-transparent';
    if (!statusCode) color = 'border-transparent';
    else if (statusCode >= 500) color = 'border-purple-500';
    else if (statusCode >= 400) color = 'border-red-500';
    else if (statusCode >= 300) color = 'border-yellow-500';
    else if (statusCode >= 200) color = 'border-green-500';
    return `border-0 border-l-8 ${color}`;
  }

  function getRequestURI(trace: Trace) {
    return <ListDataComponent trace={trace} />;
  }

  function getRequestDuration(trace: Trace) {
    return trace.http?.duration ? `${(trace.http.duration / 1000).toFixed(2)}s` : <Loading size={2} />;
  }

  const columns: [string, (x: Trace) => string | number | React.ReactNode, string, (x: Trace) => string][] = [
    ['Method', getMethodAndStatus, 'w-[50px] md:w-[100px]', cellStyle],
    ['Request', getRequestURI, '', () => ''],
    ['Time', getRequestDuration, 'w-[50px] md:w-[100px] text-center', () => ''],
  ];

  const [Icon, message] = connected
    ? [HiStatusOnline, `Listening for traces...`]
    : connecting
    ? [HiOutlineLightningBolt, 'Connecting...']
    : [HiOutlineEmojiSad, 'Unable to connect'];

  const hasTraces = data.length > 0;

  return (
    <div className={tw('h-full flex flex-col', className)}>
      <div
        data-test-id="scroll-container"
        ref={scrollContainer}
        onScroll={handleScroll}
        className={tw('flex-1', hasTraces && 'overflow-y-scroll')}
      >
        {!hasTraces ? (
          <div
            data-test-id="no-traces"
            className="flex flex-none h-full justify-center items-center text-3xl text-neutral"
          >
            <Icon className="translate-y-[0.05em] w-8 h-8 mr-2" /> <span>{message}</span>
          </div>
        ) : (
          <div data-test-id="trace-list" className="table table-fixed w-full relative">
            <div className="flex-0 table-header-group gap-4 font-semibold sticky top-0 bg-secondary uppercase shadow-lg z-10">
              {columns.map(([label, , baseStyle]) => (
                <div
                  key={label}
                  data-test-id={`column-heading-${label.toLowerCase()}`}
                  className={`table-cell p-cell border-b border-primary overflow-hidden ${baseStyle}`}
                >
                  {label}
                </div>
              ))}
            </div>
            <div className="flex-1 table-row-group">
              {data.map((trace, idx) => (
                <div
                  data-test-id="trace"
                  key={trace.id}
                  onClick={() => setSelectedTrace(trace.id)}
                  className={tw(
                    'gap-4 table-row',
                    trace.id === selectedTraceId
                      ? 'bg-orange-300 shadow-lg'
                      : rowStyle(trace) || (idx % 2 === 0 ? 'bg-slate-100' : 'bg-slate-50'),
                    'hover:bg-orange-200 hover:cursor-pointer hover:shadow',
                  )}
                >
                  {columns.map(([label, prop, baseStyle, cellStyle]) => (
                    <div
                      key={`${trace.id}_${prop}`}
                      data-test-id={`column-data-${label.toLowerCase()}`}
                      className={tw(
                        'table-cell p-cell align-middle overflow-hidden whitespace-nowrap text-ellipsis',
                        baseStyle || '',
                        cellStyle(trace) || '',
                      )}
                    >
                      {typeof prop === 'function' && prop(trace)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {hasTraces && (
        <div
          className={tw(
            'flex-0 flex flex-row justify-between items-center border-t border-primary p-2',
            selectedTraceId && 'border-r border-primary',
          )}
        >
          <div data-test-id="trace-count">Traces: {data.length}</div>
          <ToggleSwitch
            data-test-id="auto-scroll"
            label="Auto scroll:"
            checked={autoScroll}
            onChange={value => setAutoScroll(value)}
          />
        </div>
      )}
    </div>
  );
}
