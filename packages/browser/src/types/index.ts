export type Response = {
  connectionID: string;
  time: number;
  httpVersion: string;
  statusCode: number;
  statusMessage: string;
  headers: { [key: string]: any };
  body?: object | string;
  error?: Error;
};

export type Request = {
  connectionID: string;
  time: number;
  method: string;
  host: string;
  port: string;
  path: string;
  headers: { [key: string]: any };
  body?: string | Record<string, any>;
  [key: string]: any;
};

export type ConnectionData = {
  req: Request;
  res: Response | null;
  duration?: number;
};

export type Traces = Record<string, ConnectionData>;
