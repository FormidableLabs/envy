import { System } from '@/types';

import DefaultSystem from './Default';
import GraphQLSystem from './GraphQL';
import SanitySystem from './Sanity';

const defaultSystem = new DefaultSystem();

const systems: System<unknown>[] = [
  // TODO: provide a way to register custom systems here, before `defaultSystem`
  new GraphQLSystem(),
  new SanitySystem(),
];

export function getDefaultSystem() {
  return defaultSystem;
}

export function getRegisteredSystems(): System<unknown>[] {
  return systems;
}

export function registerSystem(system: System<unknown>) {
  systems.push(system);
}
