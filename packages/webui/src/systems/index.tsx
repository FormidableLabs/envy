import React, { ReactNode } from 'react';

import TraceRequestData from '@/components/ui/TraceRequestData';
import { System, Trace, TraceRowData } from '@/types';
import { pathAndQuery } from '@/utils';

import { getDefaultSystem, getRegisteredSystems } from './registration';

function callOrFallback<T>(trace: Trace, fnName: keyof Omit<System<unknown>, 'name' | 'isMatch' | 'getData'>): T {
  const systems = getRegisteredSystems();
  const defaultSystem = getDefaultSystem();

  const system = systems.find(x => x.isMatch(trace));
  const data = system?.getData?.(trace) ?? null;

  let value = null;
  if (typeof system?.[fnName] === 'function') {
    value = system[fnName]!({ trace, data });
  }
  return value ?? defaultSystem[fnName]!({ trace, data: null });
}

type SystemDetailProps = {
  trace: Trace;
};

export function getIconUri(trace: Trace | null): string {
  return callOrFallback(trace as Trace, 'getIconUri');
}

export function getRequestBody(trace: Trace): any {
  return callOrFallback(trace, 'getRequestBody');
}

export function getResponseBody(trace: Trace): any {
  return callOrFallback(trace, 'getResponseBody');
}

export function ListDataComponent({ trace }: SystemDetailProps): React.ReactNode {
  const traceRowData = callOrFallback<TraceRowData | null>(trace, 'getTraceRowData');

  const [path, qs] = pathAndQuery(trace);
  return (
    <TraceRequestData
      iconPath={getIconUri(trace)}
      hostName={trace.http?.host}
      path={path}
      data={traceRowData?.data ?? qs}
    />
  );
}

export function RequestDetailsComponent({ trace }: SystemDetailProps): React.ReactNode {
  const Component = callOrFallback<ReactNode | null>(trace, 'getRequestDetailComponent');
  return Component ? (
    <>
      <hr />
      {Component}
    </>
  ) : null;
}

export function ResponseDetailsComponent({ trace }: SystemDetailProps): React.ReactNode {
  const Component = callOrFallback<ReactNode | null>(trace, 'getResponseDetailComponent');
  return Component ? (
    <>
      <hr />
      {Component}
    </>
  ) : null;
}
