// These types are subsets of the libDom,
// for cross-compatibility with Node 17+ and browser
interface Headers {
  entries(): IterableIterator<[string, string]>;
}

export type HeadersInit = [string, string][] | Record<string, string> | Headers;

interface Request {
  readonly headers: Headers;
  readonly method: string;
  readonly url: string;
}

export type RequestInfo = Request | string;

type BodyInit = ReadableStream | XMLHttpRequestBodyInit;

export interface RequestInit {
  body?: BodyInit | null;
  headers?: HeadersInit;
  method?: string;
}

export interface Response {
  readonly headers: Headers;
  readonly status: number;
  readonly statusText: string;
  readonly type: ResponseType;
  text: () => Promise<string>;
}
