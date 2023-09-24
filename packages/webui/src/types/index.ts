import { Event } from '@envyjs/core';

export type Trace = Event;
export type Traces = Map<string, Trace>;

export type TraceRowData = {
  data?: string;
};

export interface System<T> {
  name: string;
  isMatch(trace: Trace): boolean;
  getIconBase64?(trace: Trace | null): string | null;
  getData?(trace: Trace): T;
  getTraceRowData?(trace: Trace): TraceRowData | null;
  requestDetailComponent?(trace: Trace): React.ReactNode;
  transformRequestBody?(trace: Trace): any;
  responseDetailComponent?(trace: Trace): React.ReactNode;
  transformResponseBody?(trace: Trace): any;
}
