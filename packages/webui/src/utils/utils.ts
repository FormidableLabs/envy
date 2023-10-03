import { HttpRequest } from '@envyjs/core';
import { twMerge } from 'tailwind-merge';

import { Trace } from '@/types';

type Headers = HttpRequest['requestHeaders'];
type HeadersOrUndefined = Headers | undefined;

export function pathAndQuery(trace: Trace, decodeQs = false): [string, string] {
  const [path, qs] = (trace.http?.path ?? '').split('?');
  return [path, decodeQs ? decodeURIComponent(qs) : qs];
}

export function numberFormat(num: number): string {
  return Intl.NumberFormat('en-US').format(num);
}

export function cloneHeaders(headers: HeadersOrUndefined, lowercase = true): Headers {
  if (!headers) return {};

  return Object.entries(headers).reduce<Headers>((a, [k, v]) => {
    const newKey = lowercase ? k.toLowerCase() : k;
    a[newKey] = v;
    return a;
  }, {});
}

export function flatMapHeaders(headers: HeadersOrUndefined): Record<string, string> {
  if (!headers) return {};

  return Object.entries(headers).reduce<Record<string, string>>((a, [k, v]) => {
    if (!!v) {
      a[k] = Array.isArray(v) ? v.join(',') : v;
    }
    return a;
  }, {});
}

export function getHeader(headers: HeadersOrUndefined, name: string): string | string[] | null {
  if (!headers) return null;

  const allLowercaseHeaders = cloneHeaders(headers, true);
  return allLowercaseHeaders[name.toLowerCase()] ?? null;
}

export function prettyFormat(code: string): string {
  if (!code) return code;

  const tabSize = 2;
  let indent = 0;
  const lines = code.replace(/  +/g, ' ').replace(/^ /gm, '').split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('}')) indent -= 1;
    lines[i] = ' '.repeat(indent * tabSize) + lines[i];
    if (lines[i].trim().endsWith('{')) indent += 1;
  }
  return lines.join('\n');
}

export function tw(...classLists: (string | false | undefined | null)[]): string {
  return twMerge(...classLists);
}
