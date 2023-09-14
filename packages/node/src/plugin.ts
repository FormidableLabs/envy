import { Event } from '@envy/core';

import { Options } from './options';

export interface Exporter {
  send: (data: Event) => void;
}

export type Plugin = (options: Options, exporter: Exporter) => void;
