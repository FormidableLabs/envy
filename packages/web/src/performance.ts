import { HttpRequest } from '@envyjs/core';

/**
 * Calculate timing data from performance API data
 * @see https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming
 */
export function calculateTiming(time: PerformanceResourceTiming | undefined): {
  duration?: number;
  timings?: HttpRequest['timings'];
} {
  // Some data is not available if the resource is a cross-origin request
  // and no Timing-Allow-Origin HTTP response header is used
  //
  // Check if we have this data available, and if we do, we can
  // improve the timing data with it
  if (!time?.requestStart) return {};

  const timings: HttpRequest['timings'] = {
    blocked: time.fetchStart - time.startTime,
    dns: time.domainLookupEnd - time.domainLookupStart,
    connect: time.connectEnd - time.connectStart,
    send: 0, // there is no data available for this in native fetch
    wait: time.responseStart - time.requestStart,
    receive: time.responseEnd - time.responseStart,
    ssl: -1,
  };

  if (time.secureConnectionStart) {
    timings.ssl = time.connectEnd - time.secureConnectionStart;
  }

  return {
    duration: time.duration,
    timings,
  };
}
