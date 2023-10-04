import { Event } from './event';

// how the 'connections' data will arrive from the collector
// [serviceName: string, isActive: boolean][]
export type ConnectionStatusData = [string, boolean][];

export type ConnectionStatusPayload = {
  type: 'connections';
  data: ConnectionStatusData;
};

export type TracePayload = {
  type: 'trace';
  data: Event;
};

export type WebSocketPayload = ConnectionStatusPayload | TracePayload;
