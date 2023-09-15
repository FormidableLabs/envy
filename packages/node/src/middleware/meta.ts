import { Middleware } from '.';

export const Meta: Middleware = (event, options) => {
  event.serviceName = options.serviceName;
  return event;
};
