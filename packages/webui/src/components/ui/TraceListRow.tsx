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
        rowStyle(trace),
        trace.id === selectedTraceId && 'bg-green-100',
      )}
    >
      <TraceListRowCell
        className={tw('border-0 p-0 border-l-8', indicatorStyle(trace))}
        data-test-id="column-data-status-cell"
      >
        <div className="font-semibold" data-test-id="column-data-method-cell">
          {trace.http?.method.toUpperCase()}
        </div>
        <div className="font-semibold text-xs text-opacity-70 uppercase" data-test-id="column-data-code-cell">
          {getResponseStatus(trace)}
        </div>
      </TraceListRowCell>
      <TraceListRowCell data-test-id="column-data-request-cell">
        <ListDataComponent trace={trace} />
      </TraceListRowCell>
      <TraceListRowCell className="text-right" data-test-id="column-data-time-cell">
        {formatRequestDuration(trace)}
      </TraceListRowCell>
    </div>
  );
}

function getResponseStatus(trace: Trace) {
  const { statusCode, state } = trace.http || {};

  if (state === HttpRequestState.Aborted) return 'Aborted';

  return statusCode;
}

function indicatorStyle(trace: Trace) {
  const { statusCode, state } = trace.http || {};

  if (state === HttpRequestState.Aborted) return 'border-l-gray-500';

  if (statusCode) {
    if (statusCode >= 500) return 'border-l-purple-500';
    else if (statusCode >= 400) return 'border-l-red-500';
    else if (statusCode >= 300) return 'border-l-yellow-500';
    else if (statusCode >= 200) return 'border-l-green-500';
  }
}

function rowStyle(trace: Trace) {
  const { statusCode, state } = trace.http || {};

  if (state === HttpRequestState.Aborted) return 'bg-gray-300';

  if (statusCode) {
    if (statusCode >= 500) return 'bg-purple-200';
    else if (statusCode >= 400) return 'bg-red-200';
    else if (statusCode >= 300) return 'bg-yellow-200';
  }
}

function formatRequestDuration(trace: Trace) {
  return trace.http?.duration ? `${(trace.http.duration / 1000).toFixed(2)}s` : <Loading size={2} />;
}
