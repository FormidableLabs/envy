import { HttpRequest } from '.';

export type FilterableHttpRequest = Pick<HttpRequest, 'host' | 'method'>;

export interface Options {
  /**
   * A unique identifier for the application
   */
  serviceName: string;

  /**
   * Set to true to enable debugging of exported messages
   * @default false
   */
  debug?: boolean;

  /**
   * Define a function to filter http requests
   * @default undefined
   */
  filter?: (request: FilterableHttpRequest) => boolean;
}
