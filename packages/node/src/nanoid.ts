// https://github.com/ai/nanoid
// Currently does not support commonjs imports, so we copypasta this file here
import crypto from 'crypto';

export const nanoid = (t = 21) =>
  crypto
    .getRandomValues(new Uint8Array(t))
    .reduce(
      (t, e) =>
        (t += (e &= 63) < 36 ? e.toString(36) : e < 62 ? (e - 26).toString(36).toUpperCase() : e < 63 ? '_' : '-'),
      '',
    );
