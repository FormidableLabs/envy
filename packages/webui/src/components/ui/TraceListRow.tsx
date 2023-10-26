import { HttpRequestState } from '@envyjs/core';

import { Loading } from '@/components';
import useApplication from '@/hooks/useApplication';
import { ListDataComponent } from '@/systems';
import { Trace } from '@/types';
import { tw } from '@/utils';

import TraceListRowCell from './TraceListRowCell';

export default function TraceListRow({ trace }: { trace: Trace }) {
  const { selectedTraceId, setSelectedTrace } = useApplication();

  return (
    <div
      data-test-id="trace"
      key={trace.id}
      onClick={() => setSelectedTrace(trace.id)}
      className={tw(
        'table-row h-16 hover:bg-green-100 hover:cursor-pointer hover:shadow',
        trace.id === selectedTraceId && 'bg-green-100',
      )}
    >
      <TraceListRowCell data-test-id="column-data-badge-cell">
        <div className={tw('rounded-full h-6 w-6', badgeStyle(trace))}></div>
      </TraceListRowCell>
      <TraceListRowCell data-test-id="column-data-request-cell">
        <ListDataComponent trace={trace} />
      </TraceListRowCell>
      {!selectedTraceId && (
        <>
          <TraceListRowCell data-test-id="column-data-method-cell">{trace.http?.method}</TraceListRowCell>
          <TraceListRowCell data-test-id="column-data-status-cell">{formatStatus(trace)}</TraceListRowCell>
          <TraceListRowCell className="text-right" data-test-id="column-data-code-cell">
            {trace.http?.statusCode}
          </TraceListRowCell>
        </>
      )}
      <TraceListRowCell className="text-right" data-test-id="column-data-time-cell">
        {formatRequestDuration(trace)}
      </TraceListRowCell>
    </div>
  );
}

function badgeStyle(trace: Trace) {
  const statusCode = trace.http?.statusCode;

  if (statusCode) {
    if (statusCode >= 500) return 'bg-purple-500';
    else if (statusCode >= 400) return 'bg-red-500';
    else if (statusCode >= 300) return 'bg-yellow-500';
    else if (statusCode >= 200) return 'bg-green-500';
  }

  return 'ring-1 ring-gray-400';
}

function formatRequestDuration(trace: Trace) {
  return trace.http?.duration ? `${(trace.http.duration / 1000).toFixed(2)}s` : <Loading size={2} />;
}

function formatStatus(trace: Trace) {
  switch (trace.http?.state) {
    case HttpRequestState.Received:
      return 'Completed';
    case HttpRequestState.Aborted:
      return 'Aborted';
    case HttpRequestState.Blocked:
      return 'Blocked';
    case HttpRequestState.Error:
      return 'Error';
    case HttpRequestState.Timeout:
      return 'Timeout';
    case HttpRequestState.Sent:
    default:
      return 'Active';
  }
}
