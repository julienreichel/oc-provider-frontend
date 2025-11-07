/**
 * HTTP Client - Thin wrapper over fetch with base URL, timeout, and error normalization
 */

export interface HttpClientConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message?: string,
  ) {
    super(message ?? `HTTP ${status}: ${statusText}`);
    this.name = 'HttpError';
  }
}

export class HttpTimeoutError extends Error {
  constructor(timeout: number) {
    super(`Request timed out after ${timeout}ms`);
    this.name = 'HttpTimeoutError';
  }
}

export class HttpClient {
  private config: Required<HttpClientConfig>;

  constructor(config: HttpClientConfig) {
    this.config = {
      baseUrl: config.baseUrl.replace(/\/$/, ''), // Remove trailing slash
      timeout: config.timeout ?? 10000, // 10s default
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    };
  }

  /**
   * Performs a GET request
   */
  async get<T>(path: string, options?: RequestInit): Promise<HttpResponse<T>> {
    return this.request<T>('GET', path, undefined, options);
  }

  /**
   * Performs a POST request
   */
  async post<T>(path: string, data?: unknown, options?: RequestInit): Promise<HttpResponse<T>> {
    return this.request<T>('POST', path, data, options);
  }

  /**
   * Performs a PUT request
   */
  async put<T>(path: string, data?: unknown, options?: RequestInit): Promise<HttpResponse<T>> {
    return this.request<T>('PUT', path, data, options);
  }

  /**
   * Performs a DELETE request
   */
  async delete<T>(path: string, options?: RequestInit): Promise<HttpResponse<T>> {
    return this.request<T>('DELETE', path, undefined, options);
  }

  /**
   * Core request method with timeout and error normalization
   */
  private async request<T>(
    method: string,
    path: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<HttpResponse<T>> {
    const url = `${this.config.baseUrl}${path}`;

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const requestInit: RequestInit = {
        method,
        headers: this.config.headers,
        signal: controller.signal,
        ...options,
      };

      if (data) {
        requestInit.body = JSON.stringify(data);
      }

      const response = await fetch(url, requestInit);

      clearTimeout(timeoutId);

      // Parse response headers
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      // Parse response body
      let responseData: T;
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = (await response.text()) as unknown as T;
      }

      // Throw HttpError for non-2xx responses
      if (!response.ok) {
        throw new HttpError(response.status, response.statusText);
      }

      return {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle timeout errors
      if (error instanceof Error && error.name === 'AbortError') {
        throw new HttpTimeoutError(this.config.timeout);
      }

      // Re-throw HttpError as-is
      if (error instanceof HttpError) {
        throw error;
      }

      // Wrap other errors
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
