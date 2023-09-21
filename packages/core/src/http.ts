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
   * HAR formatted timing information
   *
   * http://www.softwareishard.com/blog/har-12-spec/#timings
   */
  timings?: {
    /**
     * Time spent in a queue waiting for a network connection.
     * -1 if the timing does not apply to the current request.
     */
    blocked: number;

    /**
     * DNS resolution time. The time required to resolve a host name.
     * -1 if the timing does not apply to the current request.
     */
    dns: number;

    /**
     * Time required for SSL/TLS negotiation.
     * If this field is defined then the time is also included in the connect field (to ensure backward compatibility with HAR 1.1).
     * -1 if the timing does not apply to the current request.
     */
    ssl: number;

    /**
     * Time required to create TCP connection.
     * -1 if the timing does not apply to the current request.
     */
    connect: number;

    /**
     * Time required to send HTTP request to the server.
     */
    send: number;

    /**
     * Waiting for a response from the server.
     */
    wait: number;

    /**
     * Time required to read entire response from the server (or cache).
     */
    receive: number;
  };

  /**
   * The full url of the request
   */
  url: string;
}
