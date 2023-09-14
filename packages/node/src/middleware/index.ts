import { Event } from '@envy/core';

export type Middleware = (event: Event) => Event;
