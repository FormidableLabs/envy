import { EventType } from './eventType';
import { HttpRequestBase } from './http';

/**
 * A Sanity Request
 */
export interface SanityRequest extends HttpRequestBase {
  /**
   * The full request query
   */
  query?: string | null;

  /**
   * The sanity type used in the query
   */
  queryType?: string | null;

  /**
   * The event type
   */
  type: EventType.SanityRequest;
}
