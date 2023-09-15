import { Event } from '@envy/core';

import { Options } from '../options';

export type Middleware = (event: Event, options: Options) => Event;
