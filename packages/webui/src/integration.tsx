/* istanbul ignore file */

/* eslint-disable import/no-unresolved */
// @ts-expect-error
import css from 'inline:../dist/viewer.css';

import App from './App';
import { registerSystem } from './systems/registration';
import { System } from './types';

export type { System, TraceRowData, Trace } from './types';
export * from './components';

export type EnvyViewerProps = {
  systems?: System<unknown>[];
};

export default function EnvyViewer({ systems }: EnvyViewerProps) {
  for (const system of systems ?? []) {
    registerSystem(system);
  }

  return (
    <>
      <style>{css}</style>
      <App />
    </>
  );
}
