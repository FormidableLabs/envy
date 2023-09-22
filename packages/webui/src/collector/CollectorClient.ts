import { DEFAULT_WEB_SOCKET_PORT, Event } from '@envyjs/core';

import { Traces } from '@/types';
import { safeParseJson } from '@/utils';

type WebSocketClientOptions = {
  port?: number;
  changeHandler?: () => void;
};

export default class CollectorClient {
  private readonly _port: number;

  private _connected: boolean = false;
  private _connecting: boolean = true;
  private _traces: Traces = new Map();
  private _changeHandler?: () => void;

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

  private _signalChange() {
    this._changeHandler?.();
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
      const payload = safeParseJson<Event>(data.toString());
      if (payload) {
        this.addEvent(payload);
      }
    });
  }

  start() {
    this._connect();
  }

  addEvent(event: Event) {
    const trace = { ...event };
    this._traces.set(trace.id, trace);
    this._signalChange();
  }

  clearTraces() {
    this._traces.clear();
    this._signalChange();
  }
}
