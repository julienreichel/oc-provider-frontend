import type { ApiError } from '../models/ApiError';
import { ApiErrorException } from '../models/ApiError';

export const normalizeError = (err: unknown): ApiError => {
  if (err instanceof ApiErrorException) {
    return err.toApiError();
  }

  if (err instanceof Error) {
    return {
      message: err.message,
    };
  }

  return {
    message: 'Unknown error',
  };
};
