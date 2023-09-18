import { GraphqlRequest } from './graphql';
import { HttpRequest } from './http';
import { SanityRequest } from './sanity';

/**
 * An event that can be emitted through the websocket
 * @private This is an internal type and should not be used by consumers
 */
export interface Event {
  /**
   * A unique identifier for this span
   */
  id: string;

  /**
   * UNIX Epoch time in seconds since 00:00:00 UTC on 1 January 1970
   */
  timestamp: number;

  /**
   * A unique identifier used for grouping
   * multiple events
   */
  parentId?: string;

  /**
   * Optional service name identifier
   */
  serviceName?: string;

  /**
   * Graphql request data
   */
  graphql?: GraphqlRequest;

  /**
   * Http request data
   */
  http?: HttpRequest;

  /**
   * Sanity request data
   */
  sanity?: SanityRequest;
}
