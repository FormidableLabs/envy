/**
 * A Graphql Request
 */
export interface GraphqlRequest {
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
}
