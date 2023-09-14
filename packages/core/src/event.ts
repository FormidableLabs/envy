import { EventType } from './eventType';

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
   * A unique identifier used for grouping
   * multiple events
   */
  parentId?: string;

  /**
   * UNIX Epoch time in seconds since 00:00:00 UTC on 1 January 1970
   */
  timestamp: number;

  /**
   * The type of event
   */
  type: EventType;
}
