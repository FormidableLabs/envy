import { Event } from './event';
import { EventType } from './eventType';

/**
 * @private This is an internal type and should not be used by consumers
 */
interface HttpMessage extends Event {
  /**
   * The http request or response body
   */
  body?: string;

  /**
   * The normalized http headers (lowercase)
   */
  headers: Record<string, undefined | string | string[]>;
}

/**
 * @private This is an internal type and should not be used by consumers
 */
export interface HttpRequestBase extends HttpMessage {
  /**
   * The host name
   */
  host: string;

  /**
   * The canonical HTTP version of the request
   */
  httpVersion: string;

  /**
   * The url path after the hostname
   */
  path: string | null;

  /**
   * The network port
   */
  port: number;

  /**
   * The HTTP method
   */
  method: 'GET' | 'POST';

  /**
   * The full url of the request
   */
  url: string;
}

/**
 * @private This is an internal type and should not be used by consumers
 */
export interface HttpResponseBase extends HttpMessage {
  /**
   * The HTTP status code
   */
  statusCode: number;

  /**
   * The HTTP response text
   */
  statusMessage: string;
}

/**
 * An HTTP Request
 */
export interface HttpRequest extends HttpRequestBase {
  type: EventType.HttpRequest;
}

/**
 * An HTTP Response
 */
export interface HttpResponse extends HttpResponseBase {
  type: EventType.HttpResponse;
}
