import { DEFAULT_WEB_SOCKET_PORT, Event, WebSocketPayload, safeParseJson } from '@envyjs/core';

import { Traces } from '@/types';

type WebSocketClientOptions = {
  port?: number;
  changeHandler?: () => void;
};

type ConnectionStatus = {
  lastPing: number;
  timeout: NodeJS.Timeout;
};

export default class CollectorClient {
  private readonly _port: number;

  private _connected: boolean = false;
  private _connecting: boolean = true;
  private _connections: Map<string, ConnectionStatus> = new Map();
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
    return [...this._connections.keys()];
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
        case 'trace': {
          this.addEvent(payload.value.data);
          break;
        }
        case 'ping' as any:
          this._registerConnection(payload.value.data as any);
          break;
      }
    });
  }

  private _registerConnection(identifier: string) {
    const thisPing = Date.now();

    // if we already have a timeout for this connection, clear it
    const status = this._connections.get(identifier);
    if (status?.timeout) {
      clearTimeout(status.timeout);
    }

    // set timer to assume this connection is closed after 6s if the most recent ping hasn't updated
    const timeout = setTimeout(() => {
      const status = this._connections.get(identifier);
      if (status?.lastPing === thisPing) {
        this._connections.delete(identifier);
        this._signalChange();
      }
    }, 6_000);

    // set time of most recent ping
    this._connections.set(identifier, {
      lastPing: thisPing,
      timeout,
    });

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
