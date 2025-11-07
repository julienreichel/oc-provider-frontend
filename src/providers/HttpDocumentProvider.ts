import type { DocumentProvider } from './DocumentProvider';
import type { PublicDocument } from '../models/PublicDocument';
import { HttpClient, HttpError } from './HttpClient';
import { ApiErrorException, ApiErrors } from '../models/ApiError';

export interface HttpDocumentProviderConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class HttpDocumentProvider implements DocumentProvider {
  private readonly httpClient: HttpClient;

  constructor(config: HttpDocumentProviderConfig) {
    this.httpClient = new HttpClient(config);
  }

  async getByCode(code: string): Promise<PublicDocument> {
    // Validate access code
    const trimmedCode = code.trim();
    if (!trimmedCode) {
      throw ApiErrorException.fromApiError(ApiErrors.invalid('Access code cannot be empty'));
    }

    try {
      const response = await this.httpClient.get<PublicDocument>(`/public/${trimmedCode}`);
      return response.data;
    } catch (error) {
      throw this.mapErrorToApiException(error);
    }
  }

  private mapErrorToApiException(error: unknown): ApiErrorException {
    // Handle HTTP timeout errors
    if (error instanceof Error && error.name === 'HttpTimeoutError') {
      return ApiErrorException.fromApiError(
        ApiErrors.unavailable('Request timed out. Please try again later.'),
      );
    }

    // Handle HTTP errors
    if (error instanceof HttpError) {
      switch (error.status) {
        case 404:
          return ApiErrorException.fromApiError(
            ApiErrors.notFound('Document not found for the provided access code'),
          );
        case 410:
          return ApiErrorException.fromApiError(
            ApiErrors.expired('Document has expired and is no longer accessible'),
          );
        case 400:
          return ApiErrorException.fromApiError(ApiErrors.invalid('Invalid access code format'));
        case 503:
          return ApiErrorException.fromApiError(
            ApiErrors.unavailable('Service temporarily unavailable. Please try again later.'),
          );
        default:
          return ApiErrorException.fromApiError(
            ApiErrors.unknown(`An unexpected error occurred (HTTP ${error.status})`),
          );
      }
    }

    // Handle all other errors
    return ApiErrorException.fromApiError(ApiErrors.unknown('An unexpected error occurred'));
  }
}
