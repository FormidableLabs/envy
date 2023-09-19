import { Event } from '../event';
import { Options } from '../options';

export type Middleware = (event: Event, options: Options) => Event;

export { Sanity } from './sanity';
export { Meta } from './meta';
