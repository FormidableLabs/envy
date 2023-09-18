import React, { ReactNode } from 'react';

import { Section } from '@/components/ui';
import { Trace } from '@/types';

import Default from './Default';
import GraphQL from './GraphQL';
import Sanity from './Sanity';

export interface System<T> {
  name: string;
  isMatch(trace: Trace): boolean;
  getData?(trace: Trace): T;
  getIconPath?(trace?: Trace): string;
  listComponent?(trace: Trace): React.ReactNode;
  requestDetailComponent?(trace: Trace): React.ReactNode;
  transformRequestBody?(trace: Trace): any;
  responseDetailComponent?(trace: Trace): React.ReactNode;
  transformResponseBody?(trace: Trace): any;
}

const defaultSystem: System<unknown> = new Default();
export const systems: System<unknown>[] = [
  // TODO: provide a way to register custom systems here, before `defaultSystem`
  new GraphQL(),
  new Sanity(),

  defaultSystem, // fallback presentation
];

function callOrFallback<T>(trace: Trace, fnName: keyof Omit<System<unknown>, 'name'>): T {
  const system = systems.find(x => x.isMatch(trace));
  if (system && typeof system[fnName] === 'function') return system[fnName]!(trace);

  return defaultSystem[fnName]!(trace);
}

export type SystemDetailProps = {
  trace: Trace;
};

export function getSystemIconPath(trace: Trace): string {
  return callOrFallback(trace, 'getIconPath');
}

export function getRequestBody(trace: Trace): any {
  return callOrFallback(trace, 'transformRequestBody');
}

export function getResponseBody(trace: Trace): any {
  return callOrFallback(trace, 'transformResponseBody');
}

export function ListDataComponent({ trace }: SystemDetailProps): React.ReactNode {
  return callOrFallback(trace, 'listComponent');
}

export function SystemRequestDetailsComponent({ trace }: SystemDetailProps): React.ReactNode {
  const Component = callOrFallback<ReactNode | null>(trace, 'requestDetailComponent');
  return Component ? (
    <>
      <hr />
      {Component}
    </>
  ) : null;
}

export function SystemResponseDetailsComponent({ trace }: SystemDetailProps): React.ReactNode {
  const Component = callOrFallback<ReactNode | null>(trace, 'responseDetailComponent');
  return Component ? (
    <>
      <hr />
      {Component}
    </>
  ) : null;
}
