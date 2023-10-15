import { ConnectionStatusData, DEFAULT_WEB_SOCKET_PORT, Event } from '@envyjs/core';

import { mockTraceCollection } from '@/testing/mockTraces';
import { Traces } from '@/types';

export const MockCollectorData: {
  connected: boolean;
  connecting: boolean;
  connections: ConnectionStatusData;
  traces: Traces;
} = {
  connected: true,
  connecting: false,
  connections: [
    ['node-client', true],
    ['web-client', true],
    ['ts-client', false],
  ],
  traces: mockTraceCollection(),
};

type WebSocketClientOptions = {
  port?: number;
  changeHandler?: () => void;
};

export default class CollectorClient {
  private readonly _port: number;
  private _changeHandler?: (newTraceId?: string) => void;

  constructor({ port, changeHandler }: WebSocketClientOptions) {
    this._port = port ?? DEFAULT_WEB_SOCKET_PORT;
    this._changeHandler = changeHandler;
  }

  get port() {
    return '8080';
  }

  get traces() {
    return MockCollectorData.traces;
  }

  get connected() {
    return MockCollectorData.connected;
  }

  get connecting() {
    return MockCollectorData.connecting;
  }

  get connections() {
    return MockCollectorData.connections;
  }

  private _signalChange(newTraceId?: string) {
    this._changeHandler?.(newTraceId);
  }

  start() {
    // intentionally left blank
  }

  addEvent(event: Event) {
    const trace = { ...event };
    const isNewTrace = !MockCollectorData.traces.has(trace.id);
    MockCollectorData.traces.set(trace.id, trace);
    this._signalChange(isNewTrace ? trace.id : undefined);
  }

  clearTraces() {
    MockCollectorData.traces.clear();
    this._signalChange();
  }
}
