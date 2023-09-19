import { Event, Options } from '@envy/core';

export interface Exporter {
  send: (data: Event) => void;
}

export type Plugin = (options: Options, exporter: Exporter) => void;
