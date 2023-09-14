// @ts-nocheck
// https://github.com/ai/nanoid
// Currently does not support commonjs imports, so we copypasta this file here
import { webcrypto } from 'crypto';

export const nanoid = (t = 21) =>
  webcrypto
    .getRandomValues(new Uint8Array(t))
    .reduce(
      (t: any, e: any) =>
        (t += (e &= 63) < 36 ? e.toString(36) : e < 62 ? (e - 26).toString(36).toUpperCase() : e < 63 ? '_' : '-'),
      '',
    );
