export interface ApiError {
  code?: string;
  message: string;
  details?: unknown;
}

export class ApiErrorException extends Error {
  public readonly code: string | undefined;
  public readonly details: unknown;

  constructor(apiError: ApiError) {
    super(apiError.message);
    this.code = apiError.code;
    this.details = apiError.details;
    this.name = 'ApiErrorException';
  }

  static fromApiError(apiError: ApiError): ApiErrorException {
    return new ApiErrorException(apiError);
  }

  toApiError(): ApiError {
    const payload: ApiError = {
      message: this.message,
    };

    if (this.code !== undefined) {
      payload.code = this.code;
    }

    if (this.details !== undefined) {
      payload.details = this.details;
    }

    return payload;
  }
}

export function isApiError(obj: unknown): obj is ApiError {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const candidate = obj as Record<string, unknown>;

  if ('code' in candidate && candidate.code !== undefined && typeof candidate.code !== 'string') {
    return false;
  }

  if (typeof candidate.message !== 'string') {
    return false;
  }

  return true;
}

export const ApiErrors = {
  notFound: (message = 'Resource not found'): ApiError => ({
    code: 'NOT_FOUND',
    message,
  }),
  expired: (message = 'Access code expired'): ApiError => ({
    code: 'EXPIRED',
    message,
  }),
  unavailable: (message = 'Service temporarily unavailable'): ApiError => ({
    code: 'UNAVAILABLE',
    message,
  }),
  invalid: (message = 'Invalid request'): ApiError => ({
    code: 'INVALID',
    message,
  }),
  unknown: (message = 'An unexpected error occurred'): ApiError => ({
    code: 'UNKNOWN',
    message,
  }),
};
