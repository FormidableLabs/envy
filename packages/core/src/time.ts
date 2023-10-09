const DEFAULT_RETRY_DELAY = 250;
const DEFAULT_RETRY_FACTOR = 2; // how sharply the retry delay rises
const DEFAULT_RETRY_FLATTEN = 6; // how slowly the retry delay rises
const DEFAULT_RETRY_MAX_ATTEMPTS = 30;

/**
 * Tracks expoonential time delay for retries
 */
export class Retry {
  private retryDelay = DEFAULT_RETRY_DELAY;
  private retryAttempts = 0;

  /**
   * The number of attempts
   */
  get attempts() {
    return this.retryAttempts;
  }

  /**
   * The current delay in ms
   */
  get delay() {
    return this.retryDelay;
  }

  /**
   * Returns true if the max attempts has not been exceeded
   */
  get shouldRetry() {
    return this.retryAttempts >= DEFAULT_RETRY_MAX_ATTEMPTS;
  }

  /**
   * Increments the attempts and returns a new delay in ms
   * @returns the delay in ms
   */
  getNextDelay() {
    const jitter = Math.random() * 1000;
    const exp = Math.pow(this.retryAttempts++ / DEFAULT_RETRY_FLATTEN, DEFAULT_RETRY_FACTOR) * 1000;
    this.retryDelay = jitter + exp;
    return this.retryDelay;
  }

  /**
   * Reset the attempts and delay to defaults
   */
  reset() {
    this.retryDelay = DEFAULT_RETRY_DELAY;
    this.retryAttempts = 0;
  }
}
