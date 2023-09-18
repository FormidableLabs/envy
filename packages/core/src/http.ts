export interface HttpRequest {
  /**
   * Request duration in milliseconds
   */
  duration?: number;

  /**
   * The host name
   */
  host: string;

  /**
   * The canonical HTTP version of the request
   */
  httpVersion?: string;

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
  method: 'GET' | 'POST' | 'OPTIONS' | 'PUT' | 'DELETE';

  /**
   * The http response body
   */
  responseBody?: string;

  /**
   * The normalized http response headers (lowercase)
   */
  responseHeaders?: Record<string, undefined | string | string[]>;

  /**
   * The http request body
   */
  requestBody?: string;

  /**
   * The normalized http request headers (lowercase)
   */
  requestHeaders: Record<string, undefined | string | string[]>;

  /**
   * The HTTP status code
   */
  statusCode?: number;

  /**
   * The HTTP response text
   */
  statusMessage?: string;

  /**
   * The full url of the request
   */
  url: string;
}
