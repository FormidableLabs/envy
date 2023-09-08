import { Traces, Request, Response } from '@/types';

type ConnectionManagerOptions = {
  changeHandler?: () => void;
};

export default class ConnectionManager {
  // TODO: implement fully

  private _port: number = 123456;
  private _connected: boolean = true;
  private _connecting: boolean = false;
  private _traces: Traces = {};
  private _changeHandler?: () => void;

  constructor({ changeHandler }: ConnectionManagerOptions) {
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

  start() {
    // TODO: initialise web socket connection to read incoming data
  }

  addRequest(payload: Request) {
    this._traces = {
      ...this._traces,
      [payload.connectionID]: { req: payload, res: null },
    };

    this._signalChange();
  }

  addResponse(payload: Response) {
    const updatedTraces = { ...this._traces };
    const connection = updatedTraces[payload.connectionID];
    connection.res = payload;
    connection.duration = payload.time - connection.req.time;
    this._traces = updatedTraces;

    this._signalChange();
  }

  clearTraces() {
    this._traces = {};

    this._signalChange();
  }
}
