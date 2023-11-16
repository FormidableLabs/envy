import { HttpRequestState } from '@envyjs/core';

import { Badge, Loading } from '@/components';
import useApplication from '@/hooks/useApplication';
import { ListDataComponent } from '@/systems';
import { Trace } from '@/types';
import { tw } from '@/utils';
import { badgeStyle } from '@/utils/styles';

import TraceListRowCell from './TraceListRowCell';

export default function TraceListRow({ trace }: { trace: Trace }) {
  const { selectedTraceId, setSelectedTrace } = useApplication();

  return (
    <div
      data-test-id="trace"
      key={trace.id}
      onClick={() => setSelectedTrace(trace.id)}
      className={tw(
        'table-row h-11 hover:bg-apple-200 hover:cursor-pointer hover:text-apple-900 text-manatee-800',
        trace.http?.state === HttpRequestState.Sent && 'text-manatee-500',
        trace.id === selectedTraceId ? 'bg-manatee-400 text-manatee-950' : 'even:bg-manatee-200',
      )}
    >
      <TraceListRowCell data-test-id="column-data-method-cell">
        <Badge className={badgeStyle(trace)}>
          <span className="font-bold mr-1">{trace.http?.method.toUpperCase()}</span> {getResponseStatus(trace)}
        </Badge>
      </TraceListRowCell>
      <TraceListRowCell data-test-id="column-data-request-cell">
        <ListDataComponent trace={trace} />
      </TraceListRowCell>
      <TraceListRowCell className="text-right text-xs" data-test-id="column-data-time-cell">
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

function formatRequestDuration(trace: Trace) {
  return trace.http?.duration ? `${(trace.http.duration / 1000).toFixed(2)}s` : <Loading size={2} />;
}
