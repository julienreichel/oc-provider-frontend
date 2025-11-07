/**
 * Error codes for API operations
 */
export type ApiErrorCode =
  | 'NOT_FOUND' // Document not found for the given code
  | 'EXPIRED' // Document access code has expired
  | 'UNAVAILABLE' // Service temporarily unavailable
  | 'INVALID' // Invalid access code format or request
  | 'UNKNOWN'; // Unknown or unexpected error

/**
 * Represents an API error with a specific code and message
 */
export interface ApiError {
  /** Specific error code indicating the type of error */
  code: ApiErrorCode;
  /** Human-readable error message */
  message: string;
}

/**
 * Custom error class for API-related errors
 */
export class ApiErrorException extends Error {
  public readonly code: ApiErrorCode;

  constructor(apiError: ApiError) {
    super(apiError.message);
    this.code = apiError.code;
    this.name = 'ApiErrorException';
  }

  /**
   * Create an ApiErrorException from an ApiError object
   */
  static fromApiError(apiError: ApiError): ApiErrorException {
    return new ApiErrorException(apiError);
  }

  /**
   * Convert this exception back to an ApiError object
   */
  toApiError(): ApiError {
    return {
      code: this.code,
      message: this.message,
    };
  }
}

/**
 * Type guard to check if an object is a valid ApiError
 */
export function isApiError(obj: unknown): obj is ApiError {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const error = obj as Record<string, unknown>;

  // Check code field
  const validCodes: ApiErrorCode[] = ['NOT_FOUND', 'EXPIRED', 'UNAVAILABLE', 'INVALID', 'UNKNOWN'];
  if (typeof error.code !== 'string' || !validCodes.includes(error.code as ApiErrorCode)) {
    return false;
  }

  // Check message field
  if (typeof error.message !== 'string') {
    return false;
  }

  return true;
}

/**
 * Helper functions to create common API errors
 */
export const ApiErrors = {
  notFound: (message = 'Document not found'): ApiError => ({
    code: 'NOT_FOUND',
    message,
  }),

  expired: (message = 'Access code has expired'): ApiError => ({
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
