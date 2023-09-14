import { Event, EventType, HttpRequest } from '@envy/core';

import { Traces } from '@/types';
import { safeParseJson } from '@/utils';

type WebSocketClientOptions = {
  port: number;
  changeHandler?: () => void;
};

export default class CollectorClient {
  private readonly _port: number;

  private _connected: boolean = true;
  private _connecting: boolean = false;
  private _shouldRetry: boolean = true;
  private _retryCount: number = 0;
  private _traces: Traces = new Map();
  private _changeHandler?: () => void;

  constructor({ port, changeHandler }: WebSocketClientOptions) {
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
    const socket = new WebSocket(`ws://localhost:${this._port}/viewer`);

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
      const payload = safeParseJson<Event>(data.toString());
      switch (payload?.type) {
        case EventType.HttpRequest: {
          this.addHttpRequest(payload as HttpRequest);
          break;
        }
      }
    };
  }

  start() {
    this._connect();
  }

  addHttpRequest(httpRequest: HttpRequest) {
    const trace = { ...httpRequest };

    if (trace.responseHeaders?.['content-encoding'] === 'gzip') {
      trace.responseBody = '';
    }

    this._traces.set(httpRequest.id, httpRequest);
    this._signalChange();
  }

  clearTraces() {
    this._traces.clear();
    this._signalChange();
  }
}
