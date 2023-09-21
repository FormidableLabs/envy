// HAR timing Data adapted from
// https://github.com/exogen/node-fetch-har/blob/master/index.js

import { HttpRequest } from '@envyjs/core';

export type Slice = [number, number];

export type Timestamps = {
  firstByte: Slice;
  start: Slice;
  socket: Slice;
  lookup: Slice;
  connect: Slice;
  received: Slice;
  secureConnect?: Slice;
  sent: Slice;
};

export function calculateTiming(time: Timestamps): HttpRequest['timings'] {
  // For backwards compatibility with HAR 1.1, the `connect` timing
  // includes `ssl` instead of being mutually exclusive.
  const legacyConnnect = time.secureConnect || time.connect;

  const blocked = getDuration(time.start, time.socket);
  const dns = getDuration(time.socket, time.lookup);
  const connect = getDuration(time.lookup, legacyConnnect);

  let ssl = -1;
  if (time.secureConnect) {
    ssl = getDuration(time.connect, time.secureConnect);
  }

  const send = getDuration(legacyConnnect, time.sent);
  const wait = Math.max(getDuration(time.sent, time.firstByte), 0);
  const receive = getDuration(time.firstByte, time.received);

  return {
    blocked,
    dns,
    connect,
    send,
    wait,
    receive,
    ssl,
  };
}

export function getDuration(a: Slice, b: Slice): number {
  const seconds = b[0] - a[0];
  const nanoseconds = b[1] - a[1];
  return seconds * 1000 + nanoseconds / 1e6;
}
