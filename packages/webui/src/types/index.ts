import { Event } from '@envyjs/core';

export type Trace = Event;
export type Traces = Map<string, Trace>;

export type TraceRowData = {
  data?: string;
};

export type TraceContext<T = null> = {
  trace: Trace;
  data: T;
};

export interface System<T = null> {
  name: string;
  isMatch(trace: Trace): boolean;
  getData?(trace: Trace): T;
  getIconUri?(): string | null;
  getSearchKeywords?(context: TraceContext<T>): string[];
  getTraceRowData?(context: TraceContext<T>): TraceRowData | null;
  getRequestDetailComponent?(context: TraceContext<T>): React.ReactNode;
  getRequestBody?(context: TraceContext<T>): string | undefined | null;
  getResponseDetailComponent?(context: TraceContext<T>): React.ReactNode;
  getResponseBody?(context: TraceContext<T>): string | undefined | null;
}
