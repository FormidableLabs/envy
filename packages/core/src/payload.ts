import { Event } from './event';

// TODO: add more payload types, such as connection status
// e.g.,
// export type ConnectionStatusPayload = {
//   type: 'connections',
//   data: [string, boolean][]
// }

export type TracePayload = {
  type: 'trace';
  data: Event;
};

// TODO: WebSocketPayload can represent the various payload types
// e.g.,
// export type WebSocketPayload = ConnectionStatusPayload | TracePayload | etc...

export type WebSocketPayload = TracePayload;
