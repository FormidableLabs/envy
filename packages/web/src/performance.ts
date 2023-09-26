import { HttpRequest } from '@envyjs/core';

/**
 * Calculate timing data from performance API data
 * @see https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming
 */
export function calculateTiming(time: PerformanceResourceTiming | undefined): {
  duration?: number;
  timings?: HttpRequest['timings'];
} {
  if (!time) return {};

  const timings: HttpRequest['timings'] = {
    blocked: time.fetchStart - time.startTime,
    dns: -1,
    connect: -1,
    send: 0, // there is no data available for this in native fetch
    wait: time.responseEnd - time.fetchStart,
    receive: 0,
    ssl: -1,
  };

  // Some data is not available if the resource is a cross-origin request
  // and no Timing-Allow-Origin HTTP response header is used
  //
  // Check if we have this data available, and if we do, we can
  // improve the timing data with it
  if (time.requestStart !== 0) {
    timings.dns = time.domainLookupEnd - time.domainLookupStart;
    timings.connect = time.connectEnd - time.connectStart;

    if (time.secureConnectionStart) {
      timings.ssl = time.connectEnd - time.secureConnectionStart;
    }

    timings.wait = time.responseStart - time.requestStart;
    timings.receive = time.responseEnd - time.responseStart;
  }

  return {
    duration: time.duration,
    timings,
  };
}
