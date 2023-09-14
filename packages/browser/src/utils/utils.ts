import { HttpRequestBase } from '@envy/core/dist/http';
import { twMerge } from 'tailwind-merge';

import { Trace } from '@/types';

type Headers = HttpRequestBase['requestHeaders'] | HttpRequestBase['responseHeaders'] | undefined;

export function pathAndQuery(trace: Trace, decodeQs = false): [string, string] {
  const [path, qs] = (trace.path ?? '').split('?');
  return [path, decodeQs ? decodeURIComponent(qs) : qs];
}

export function numberFormat(num: number): string {
  return Intl.NumberFormat('en-US').format(num);
}

export function cloneHeaders(headers: Headers, lowercase = true): Record<string, string> {
  if (!headers) return {};

  return Object.entries(headers).reduce<Record<string, any>>((a, [k, v]) => {
    const newKey = lowercase ? k.toLowerCase() : k;
    a[newKey] = v;
    return a;
  }, {});
}

export function getHeader(headers: Headers, name: string): string | null {
  if (!headers) return null;

  const allLowercaseHeaders = cloneHeaders(headers, true);
  return allLowercaseHeaders[name.toLowerCase()];
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
