import { Trace } from '@/types';

import gql from './gql';
import largeGql from './large-gql';
import rest from './rest';
import sanity from './sanity';
import xml from './xml';

const mockTraces: Trace[] = [...gql, ...largeGql, ...sanity, ...rest, ...xml];

export default mockTraces;

export function mockTraceCollection(): Map<string, Trace> {
  return mockTraces.reduce((acc, curr) => {
    acc.set(curr.id, curr);
    return acc;
  }, new Map());
}
