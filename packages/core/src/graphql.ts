import { EventType } from './eventType';
import { HttpRequestBase, HttpResponseBase } from './http';

/**
 * A Graphql Request
 */
export interface GraphqlRequest extends HttpRequestBase {
  /**
   * The full request query
   */
  query: string;

  /**
   * The parsed operation name
   */
  operationName?: string;

  /**
   * The query variables
   */
  variables?: Record<any, any>;

  /**
   * The event type
   */
  type: EventType.GraphqlRequest;
}

export interface GraphqlResponse extends HttpResponseBase {
  /**
   * The event type
   */
  type: EventType.GraphqlResponse;
}
