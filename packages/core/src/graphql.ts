export type GraphqlOperationType = 'Query' | 'Mutation';

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
   * The operation type
   */
  operationType: GraphqlOperationType;

  /**
   * The query variables
   */
  variables?: Record<any, any>;
}
