import { HttpRequest, HttpRequestState } from '@envyjs/core';

let now = Date.now();

export function elapseTime(seconds: number): number {
  now += seconds * 1000;
  return now;
}

export function requestData(
  method: HttpRequest['method'],
  host: HttpRequest['host'],
  port: HttpRequest['port'],
  path: HttpRequest['path'],
): Pick<HttpRequest, 'method' | 'host' | 'port' | 'path' | 'url' | 'state'> {
  const protocol = port === 433 ? 'https://' : 'http://';
  const hostString = port === 80 || port === 443 ? `${host}` : `${host}:${port.toString()}`;

  return {
    state: HttpRequestState.Sent,
    method,
    host,
    port,
    path,
    url: `${protocol}${hostString}${path}`,
  };
}
