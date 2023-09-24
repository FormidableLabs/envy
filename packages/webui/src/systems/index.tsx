import React, { ReactNode } from 'react';

import TraceRequestData from '@/components/ui/TraceRequestData';
import { System, Trace, TraceRowData } from '@/types';
import { pathAndQuery } from '@/utils';

import { getDefaultSystem, getRegisteredSystems } from './registration';

function callOrFallback<T>(trace: Trace, fnName: keyof Omit<System<unknown>, 'name'>): T {
  const systems = getRegisteredSystems();
  const defaultSystem = getDefaultSystem();

  const system = systems.find(x => x.isMatch(trace));
  const value = system?.[fnName]?.(trace);
  return value ?? defaultSystem[fnName]!(trace);
}

type SystemDetailProps = {
  trace: Trace;
};

export function getIconBase64(trace: Trace | null): string {
  return callOrFallback(trace as Trace, 'getIconBase64');
}

export function getRequestBody(trace: Trace): any {
  return callOrFallback(trace, 'transformRequestBody');
}

export function getResponseBody(trace: Trace): any {
  return callOrFallback(trace, 'transformResponseBody');
}

export function ListDataComponent({ trace }: SystemDetailProps): React.ReactNode {
  const traceRowData = callOrFallback<TraceRowData | null>(trace, 'getTraceRowData');

  const [path, qs] = pathAndQuery(trace);
  return (
    <TraceRequestData
      iconPath={getIconBase64(trace)}
      hostName={trace.http?.host}
      path={path}
      data={traceRowData?.data ?? qs}
    />
  );
}

export function RequestDetailsComponent({ trace }: SystemDetailProps): React.ReactNode {
  const Component = callOrFallback<ReactNode | null>(trace, 'requestDetailComponent');
  return Component ? (
    <>
      <hr />
      {Component}
    </>
  ) : null;
}

export function ResponseDetailsComponent({ trace }: SystemDetailProps): React.ReactNode {
  const Component = callOrFallback<ReactNode | null>(trace, 'responseDetailComponent');
  return Component ? (
    <>
      <hr />
      {Component}
    </>
  ) : null;
}
