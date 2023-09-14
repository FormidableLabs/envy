import { HttpRequest } from '@envy/core';

// TODO: support additional trace types such as GraphqlRequest, etc
export type Trace = HttpRequest;

export type Traces = Map<string, Trace>;
