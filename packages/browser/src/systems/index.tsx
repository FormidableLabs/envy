import React from 'react';

import { ConnectionData } from '@/types';

import Default from './Default';
import GraphQL from './GraphQL';

export interface System<T> {
  name: string;
  isMatch(connection: ConnectionData): boolean;
  getData?(connection: ConnectionData): T;
  getIconPath?(connection?: ConnectionData): string;
  listComponent?(connection: ConnectionData): React.ReactNode;
  requestDetailComponent?(connection: ConnectionData): React.ReactNode;
  transformRequestBody?(connection: ConnectionData): any;
  responseDetailComponent?(connection: ConnectionData): React.ReactNode;
  transformResponseBody?(connection: ConnectionData): any;
}

const defaultSystem: System<unknown> = new Default();
export const systems: System<unknown>[] = [
  // TODO: provide a way to register custom systems here, before `defaultSystem`
  new GraphQL(),

  defaultSystem, // fallback presentation
];

function callOrFallback<T>(
  connection: ConnectionData,
  fnName: keyof Omit<System<unknown>, 'name'>,
): T {
  const system = systems.find(x => x.isMatch(connection));
  if (system && typeof system[fnName] === 'function')
    return system[fnName]!(connection);

  return defaultSystem[fnName]!(connection);
}

export type SystemDetailProps = {
  connection: ConnectionData;
};

export function getSystemIconPath(connection: ConnectionData): string {
  return callOrFallback(connection, 'getIconPath');
}

export function getRequestBody(connection: ConnectionData): any {
  return callOrFallback(connection, 'transformRequestBody');
}

export function getResponseBody(connection: ConnectionData): any {
  return callOrFallback(connection, 'transformResponseBody');
}

export function ListDataComponent({
  connection,
}: SystemDetailProps): React.ReactNode {
  return callOrFallback(connection, 'listComponent');
}

export function SystemRequestDetailsComponent({
  connection,
}: SystemDetailProps): React.ReactNode {
  return callOrFallback(connection, 'requestDetailComponent');
}

export function SystemResponseDetailsComponent({
  connection,
}: SystemDetailProps): React.ReactNode {
  return callOrFallback(connection, 'responseDetailComponent');
}
