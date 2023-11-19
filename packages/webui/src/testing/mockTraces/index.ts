import { Trace } from '@/types';

import gql from './gql';
import largeGql from './large-gql';
import rest from './rest';
import sanity from './sanity';
import xml from './xml';

const withSequentialIds = (traces: Trace[]) =>
  traces.map((trace, idx) => ({
    ...trace,
    id: (idx + 1).toString(),
  }));

// given that mock traces are split into separate files, we need to be able to have the ids for each trace sequential
// so that certain tests which expect a certain sequence of IDs will pass
const mockTraces: Trace[] = withSequentialIds([...gql, ...largeGql, ...sanity, ...rest, ...xml]);

export default mockTraces;

export function mockTraceCollection(): Map<string, Trace> {
  return mockTraces.reduce((acc, curr) => {
    acc.set(curr.id, curr);
    return acc;
  }, new Map());
}
