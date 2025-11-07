import { ApiErrorException, ApiErrors, isApiError } from '../models/ApiError';

export interface HttpClientOptions {
  baseUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
  fetchFn?: typeof fetch;
}

const DEFAULT_BASE_URL = '/api';
const JSON_CONTENT_TYPE = 'application/json';

export class HttpClient {
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly headers: Record<string, string>;
  private readonly fetchImpl: typeof fetch;

  constructor(options: HttpClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, '');
    this.timeout = options.timeout ?? 10000;
    this.headers = {
      'Content-Type': JSON_CONTENT_TYPE,
      ...options.headers,
    };
    this.fetchImpl = options.fetchFn ?? fetch;
  }

  async get<T>(path: string, init?: RequestInit): Promise<T> {
    return this.request<T>('GET', path, undefined, init);
  }

  async post<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    return this.request<T>('POST', path, body, init);
  }

  async put<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    return this.request<T>('PUT', path, body, init);
  }

  async delete<T>(path: string, init?: RequestInit): Promise<T> {
    return this.request<T>('DELETE', path, undefined, init);
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    init?: RequestInit,
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const requestInit: RequestInit = {
        method,
        headers: this.headers,
        signal: controller.signal,
        ...init,
      };

      if (body !== undefined) {
        requestInit.body = JSON.stringify(body);
      }

      const response = await this.fetchImpl(url, requestInit);
      const parsedBody = await this.parseBody(response);

      if (!response.ok) {
        throw this.createHttpError(response.status, response.statusText, parsedBody);
      }

      return parsedBody as T;
    } catch (error) {
      if (error instanceof ApiErrorException) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw ApiErrorException.fromApiError(
          ApiErrors.unavailable(`Request timed out after ${this.timeout}ms`),
        );
      }

      throw ApiErrorException.fromApiError(
        ApiErrors.unknown(
          `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ),
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async parseBody(response: Response): Promise<unknown> {
    const contentType = response.headers.get('content-type') ?? '';

    if (contentType.includes(JSON_CONTENT_TYPE)) {
      try {
        return await response.json();
      } catch {
        return undefined;
      }
    }

    const text = await response.text();
    return text.length ? text : undefined;
  }

  private createHttpError(status: number, statusText: string, payload: unknown): ApiErrorException {
    if (isApiError(payload)) {
      return ApiErrorException.fromApiError({
        ...payload,
        details: payload.details ?? { status, statusText },
      });
    }

    const fallback = this.mapStatusToApiError(status, statusText, payload);
    return ApiErrorException.fromApiError(fallback);
  }

  private mapStatusToApiError(
    status: number,
    statusText: string,
    payload: unknown,
  ): ReturnType<typeof ApiErrors.invalid> {
    const details = payload ?? { status, statusText };

    switch (status) {
      case 400:
        return { ...ApiErrors.invalid('Invalid request'), details };
      case 404:
        return { ...ApiErrors.notFound('Resource not found'), details };
      case 502:
      case 503:
        return { ...ApiErrors.unavailable('Service temporarily unavailable'), details };
      default:
        return {
          ...ApiErrors.unknown(`HTTP ${status}: ${statusText || 'Unknown error'}`),
          details,
        };
    }
  }
}
