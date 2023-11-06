import React, { ReactNode } from 'react';

import TraceRequestData from '@/components/ui/TraceRequestData';
import { System, Trace, TraceRowData } from '@/types';
import { pathAndQuery } from '@/utils';

import { getDefaultSystem, getRegisteredSystems } from './registration';

function getSystemByTrace(trace: Trace): System<unknown> | null {
  const systems = getRegisteredSystems();
  return systems.find(x => x.isMatch(trace)) ?? null;
}

function callOrFallback<T>(trace: Trace, fnName: keyof Omit<System<unknown>, 'name' | 'isMatch' | 'getData'>): T {
  const system = getSystemByTrace(trace);
  const defaultSystem = getDefaultSystem();
  const data = system?.getData?.(trace) ?? null;

  let value = null;
  if (typeof system?.[fnName] === 'function') {
    value = system[fnName]!({ trace, data });
  }
  return (value as T) ?? (defaultSystem[fnName]!({ trace, data: null }) as T);
}

type SystemDetailProps = {
  trace: Trace;
};

export function getSystemName(trace: Trace): string {
  return getSystemByTrace(trace)?.name ?? getDefaultSystem().name;
}

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
      systemName={getSystemName(trace)}
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
