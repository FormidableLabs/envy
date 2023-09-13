import { Event, EventType, HttpRequest, HttpResponse } from '@envy/core';

import { Traces } from '@/types';

type ConnectionManagerOptions = {
  port: number;
  changeHandler?: () => void;
};

export default class ConnectionManager {
  private readonly _port: number;

  private _connected: boolean = true;
  private _connecting: boolean = false;
  private _shouldRetry: boolean = true;
  private _retryCount: number = 0;
  private _traces: Traces = {};
  private _changeHandler?: () => void;

  constructor({ port, changeHandler }: ConnectionManagerOptions) {
    this._port = port;
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
    const socket = new WebSocket(`ws://localhost:${this._port}`, 'viewer');

    socket.onopen = () => {
      this._connecting = false;
      this._connected = true;
      this._retryCount = 0;
      this._signalChange();
    };

    socket.onclose = () => {
      this._connected = false;
      this._connecting = true;
      this._signalChange();
      this._retryCount += 1;
      if (this._shouldRetry && this._retryCount < 3) {
        // TODO: implement incremental back-off?
        setTimeout(this._connect, 3000);
      } else {
        this._shouldRetry = false;
        this._connecting = false;
        this._signalChange();
      }
    };

    socket.onmessage = ({ data }) => {
      const payload = JSON.parse(data.toString()) as Event;
      switch (payload?.type) {
        case EventType.HttpRequest:
          this.addRequest(payload as HttpRequest);
          break;
        case EventType.HttpResponse:
          this.addResponse(payload as HttpResponse);
          break;
      }
    };
  }

  start() {
    this._connect();
  }

  addRequest(payload: HttpRequest) {
    this._traces = {
      ...this._traces,
      [payload.traceId]: { req: payload, res: null },
    };

    this._signalChange();
  }

  addResponse(payload: HttpResponse) {
    const updatedTraces = { ...this._traces };
    const trace = updatedTraces[payload.traceId];
    if (!trace) return;

    trace.res = payload;
    trace.duration = payload.timestamp - trace.req.timestamp;
    this._traces = updatedTraces;
    this._signalChange();
  }

  clearTraces() {
    this._traces = {};
    this._signalChange();
  }
}
