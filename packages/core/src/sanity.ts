/**
 * A Sanity Request
 */
export interface SanityRequest {
  /**
   * The full request query
   */
  query?: string | null;

  /**
   * The sanity type used in the query
   */
  queryType?: string | null;
}
