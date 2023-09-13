import React from 'react';

import { Trace } from '@/types';

import Default from './Default';
import GraphQL from './GraphQL';

export interface System<T> {
  name: string;
  isMatch(connection: Trace): boolean;
  getData?(connection: Trace): T;
  getIconPath?(connection?: Trace): string;
  listComponent?(connection: Trace): React.ReactNode;
  requestDetailComponent?(connection: Trace): React.ReactNode;
  transformRequestBody?(connection: Trace): any;
  responseDetailComponent?(connection: Trace): React.ReactNode;
  transformResponseBody?(connection: Trace): any;
}

const defaultSystem: System<unknown> = new Default();
export const systems: System<unknown>[] = [
  // TODO: provide a way to register custom systems here, before `defaultSystem`
  new GraphQL(),

  defaultSystem, // fallback presentation
];

function callOrFallback<T>(connection: Trace, fnName: keyof Omit<System<unknown>, 'name'>): T {
  const system = systems.find(x => x.isMatch(connection));
  if (system && typeof system[fnName] === 'function') return system[fnName]!(connection);

  return defaultSystem[fnName]!(connection);
}

export type SystemDetailProps = {
  connection: Trace;
};

export function getSystemIconPath(connection: Trace): string {
  return callOrFallback(connection, 'getIconPath');
}

export function getRequestBody(connection: Trace): any {
  return callOrFallback(connection, 'transformRequestBody');
}

export function getResponseBody(connection: Trace): any {
  return callOrFallback(connection, 'transformResponseBody');
}

export function ListDataComponent({ connection }: SystemDetailProps): React.ReactNode {
  return callOrFallback(connection, 'listComponent');
}

export function SystemRequestDetailsComponent({ connection }: SystemDetailProps): React.ReactNode {
  return callOrFallback(connection, 'requestDetailComponent');
}

export function SystemResponseDetailsComponent({ connection }: SystemDetailProps): React.ReactNode {
  return callOrFallback(connection, 'responseDetailComponent');
}
