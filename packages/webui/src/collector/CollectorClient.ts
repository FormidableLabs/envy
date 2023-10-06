import { ConnectionStatusData, DEFAULT_WEB_SOCKET_PORT, Event, WebSocketPayload, safeParseJson } from '@envyjs/core';

import { Traces } from '@/types';

type WebSocketClientOptions = {
  port?: number;
  changeHandler?: () => void;
};

export default class CollectorClient {
  private readonly _port: number;

  private _connected: boolean = false;
  private _connecting: boolean = true;
  private _connections: ConnectionStatusData = [];
  private _traces: Traces = new Map();
  private _changeHandler?: (newTraceId?: string) => void;

  constructor({ port, changeHandler }: WebSocketClientOptions) {
    this._port = port ?? DEFAULT_WEB_SOCKET_PORT;
    this._changeHandler = changeHandler;
  }

  get port() {
    return this._port;
  }

  get traces() {
    return this._traces;
  }

  get connected() {
    return this._connected;
  }

  get connecting() {
    return this._connecting;
  }

  get connections() {
    return this._connections;
  }

  private _signalChange(newTraceId?: string) {
    this._changeHandler?.(newTraceId);
  }

  private _connect() {
    const port = this._port;
    const socket = new WebSocket(`ws://127.0.0.1:${port}/viewer`);

    socket.addEventListener('open', () => {
      this._connecting = false;
      this._connected = true;
      this._signalChange();
    });

    socket.addEventListener('message', ({ data }) => {
      const payload = safeParseJson<WebSocketPayload>(data.toString());
      if (!payload.value) return;

      switch (payload.value.type) {
        case 'connections':
          this._updateConnections(payload.value.data);
          break;
        case 'trace':
          this.addEvent(payload.value.data);
          break;
      }
    });
  }

  private _updateConnections(connections: ConnectionStatusData) {
    this._connections = connections;
    this._signalChange();
  }

  start() {
    this._connect();
  }

  addEvent(event: Event) {
    const trace = { ...event };
    const isNewTrace = !this._traces.has(trace.id);

    this._traces.set(trace.id, trace);
    this._signalChange(isNewTrace ? trace.id : undefined);
  }

  clearTraces() {
    this._traces.clear();
    this._signalChange();
  }
}
