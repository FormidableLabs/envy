import { UIEvent, useLayoutEffect, useRef, useState } from 'react';
import { HiOutlineEmojiSad, HiOutlineLightningBolt, HiOutlineTrash, HiStatusOnline } from 'react-icons/hi';

import { IconButton, Loading, ToggleSwitch } from '@/components';
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
      <span className="hidden md:inline-block">
        {method}&nbsp;
        {statusCode && statusCode > -1 ? statusCode : ''}
      </span>
    </>
  );
}

function getMethodAndStatus(trace: Trace) {
  return trace.http ? <MethodAndStatus method={trace.http.method} statusCode={trace.http.statusCode} /> : null;
}

function pillStyle(trace: Trace) {
  const statusCode = trace.http?.statusCode;

  let color = '';
  if (!statusCode) color = 'ring-1 ring-gray-400';
  else if (statusCode >= 500) color = 'bg-purple-500';
  else if (statusCode >= 400) color = 'bg-red-500';
  else if (statusCode >= 300) color = 'bg-yellow-500';
  else if (statusCode >= 200) color = 'bg-green-500';
  return `w-full text-sm rounded-full px-2 py-1.5 font-semibold ${color}`;
}

function getRequestURI(trace: Trace) {
  return <ListDataComponent trace={trace} />;
}

function getRequestDuration(trace: Trace) {
  return trace.http?.duration ? `${(trace.http.duration / 1000).toFixed(2)}s` : <Loading size={2} />;
}

const columns: [string, (x: Trace) => string | number | React.ReactNode, string, (x: Trace) => string][] = [
  ['Method', getMethodAndStatus, 'w-[40px] md:w-[125px] overflow-hidden text-center', pillStyle],
  ['Request', getRequestURI, '', () => 'whitespace-nowrap overflow-hidden overflow-ellipsis'],
  ['Duration', getRequestDuration, 'w-[100px] text-right', () => 'text-sm'],
];

type TraceListProps = React.HTMLAttributes<HTMLElement> & {
  autoScroll?: boolean;
};

export default function TraceList({ autoScroll: initialAutoScroll = true }: TraceListProps) {
  const { clearTraces, connected, connecting, traces, selectedTraceId, newestTraceId, setSelectedTrace } =
    useApplication();
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

  const [Icon, message] = connected
    ? [HiStatusOnline, `Listening for traces...`]
    : connecting
    ? [HiOutlineLightningBolt, 'Connecting...']
    : [HiOutlineEmojiSad, 'Unable to connect'];

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
          <div
            data-test-id="no-traces"
            className="flex flex-none h-full justify-center items-center text-3xl text-neutral"
          >
            <Icon className="translate-y-[0.05em] w-8 h-8 mr-2" /> <span>{message}</span>
          </div>
        ) : (
          <div data-test-id="trace-list" className="table table-fixed w-full relative">
            <div className="table-header-group font-bold bg-primary sticky top-0 uppercase">
              {columns.map(([label, , baseStyle]) => (
                <div
                  key={label}
                  data-test-id={`column-heading-${label.toLowerCase()}`}
                  className={`table-cell p-cell border-b border-primary ${baseStyle}`}
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
                    'table-row h-16',
                    trace.id === selectedTraceId ? 'bg-green-100' : idx % 2 === 0 ? 'bg-gray-200' : 'bg-gray-200',
                    'hover:bg-green-100 hover:cursor-pointer hover:shadow',
                  )}
                >
                  {columns.map(([label, prop, baseStyle, cellStyle]) => (
                    <div
                      key={`${trace.id}_${prop}`}
                      data-test-id={`column-data-${label.toLowerCase()}`}
                      className={tw(
                        'table-cell p-cell align-middle border-b border-solid border-gray-300',
                        baseStyle || '',
                      )}
                    >
                      <div className={cellStyle(trace) || ''}>{typeof prop === 'function' && prop(trace)}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {hasTraces && (
        <div className="flex flex-row items-center border-t border-primary p-2">
          <div data-test-id="trace-count" className="flex-1 font-semibold uppercase">
            Traces: {data.length}
          </div>
          <div className="flex flex-row gap-2">
            <ToggleSwitch
              data-test-id="auto-scroll"
              label="Auto scroll"
              checked={autoScroll}
              onChange={value => setAutoScroll(value)}
            />
            <IconButton Icon={HiOutlineTrash} onClick={clearTraces} className="uppercase">
              Clear
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
}
