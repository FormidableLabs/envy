import {
  ConnectionStatusData,
  DEFAULT_WEB_SOCKET_PORT,
  Event,
  HttpRequestState,
  WebSocketPayload,
  safeParseJson,
} from '@envyjs/core';

import { mockTraceCollection } from '@/testing/mockTraces';
import { Traces } from '@/types';

type WebSocketClientOptions = {
  port?: number;
  changeHandler?: () => void;
};

// set a timeout for http events if we don't receive
// a response. Since each client has different timeouts,
// we arbitrarily choose a timeout here and if a response
// still comes in after, the ui will update appropriately
const INTERNAL_HTTP_TIMEOUT = 120 * 1000;

const initialTraceMap = () => {
  // ignore coverage for this line since it's only used in dev
  // istanbul ignore next
  return process.env.DEMO === 'true' ? mockTraceCollection() : new Map();
};

export default class CollectorClient {
  private readonly _port: number;

  private _cleanup = new Map<string, any>();
  private _connected: boolean = false;
  private _connecting: boolean = true;
  private _connections: ConnectionStatusData = [];
  private _traces: Traces = initialTraceMap();
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

  // set a timeout on http trace status to cleanup any traces
  // where we don't receive a response in a timely manner
  private _setHttpTimeout(id: string) {
    const timeoutId = setTimeout(() => {
      const trace = this._traces.get(id);
      if (trace?.http?.state === 'sent') {
        trace.http.state = HttpRequestState.Timeout;
        trace.http.statusMessage = 'TIMEOUT';
        trace.http.statusCode = -1;
        trace.http.duration = INTERNAL_HTTP_TIMEOUT;
        trace.http.responseBody = 'TIMEOUT WAITING FOR RESPONSE';
        this.addEvent(trace);
      }
    }, INTERNAL_HTTP_TIMEOUT);

    this._cleanup.set(id, timeoutId);
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

    if (isNewTrace && !!trace.http) {
      this._setHttpTimeout(trace.id);
    } else if (this._cleanup.has(trace.id)) {
      clearTimeout(this._cleanup.get(trace.id));
    }

    this._traces.set(trace.id, trace);
    this._signalChange(isNewTrace ? trace.id : undefined);
  }

  clearTraces() {
    this._traces.clear();
    this._signalChange();
  }
}
