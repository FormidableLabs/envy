export type CryptoModule = {
  getRandomValues<T extends ArrayBufferView | null>(array: T): T;
};

// cross compatible nanoid implementation from
// https://github.com/ai/nanoid
export const nanoid =
  (crypto: CryptoModule) =>
  (t = 21) =>
    crypto
      .getRandomValues(new Uint8Array(t))
      .reduce(
        (t: any, e: any) =>
          (t += (e &= 63) < 36 ? e.toString(36) : e < 62 ? (e - 26).toString(36).toUpperCase() : e < 63 ? '_' : '-'),
        '',
      );
