import { twMerge } from 'tailwind-merge';

import { ConnectionData } from '@/types';

export function pathAndQuery(connection: ConnectionData, decodeQs = false) {
  const [path, qs] = connection.req.path.split('?');
  return [path, decodeQs ? decodeURIComponent(qs) : qs];
}

export function timeFormat(time: number) {
  return Intl.NumberFormat('en-GB').format(time);
}

export function cloneHeaders(
  headers: Record<string, any> | undefined,
  lowercase = true,
) {
  if (!headers) return {};

  return Object.entries(headers).reduce<Record<string, any>>((a, [k, v]) => {
    const newKey = lowercase ? k.toLowerCase() : k;
    a[newKey] = v;
    return a;
  }, {});
}

export function getHeader(
  headers: Record<string, unknown> | undefined,
  name: string,
): string | null {
  if (!headers) return null;

  const allLowercaseHeaders = cloneHeaders(headers, true);
  return allLowercaseHeaders[name.toLowerCase()];
}

export function prettyFormat(code: string) {
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

export function tw(...classLists: (string | false | undefined | null)[]) {
  return twMerge(...classLists);
}
