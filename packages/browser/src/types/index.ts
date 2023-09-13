import { HttpRequest, HttpResponse } from '@envy/core';

export type Trace = {
  req: HttpRequest;
  res: HttpResponse | null;
  duration?: number;
};

export type Traces = Record<string, Trace>;
