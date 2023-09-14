import { Options } from './options';

export interface MiddlewareOptions extends Options {
  client: {
    send: (data: Record<any, any>) => void;
  };
}

export type Middleware = (options: MiddlewareOptions) => void;
