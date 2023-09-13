import { HttpRequest, HttpResponse } from '@envy/core';

export type ConnectionData = {
  req: HttpRequest;
  res: HttpResponse | null;
  duration?: number;
};

export type Traces = Record<string, ConnectionData>;
