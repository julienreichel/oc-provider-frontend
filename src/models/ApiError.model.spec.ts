import { describe, it, expect } from 'vitest';
import {
  type ApiError,
  type ApiErrorCode,
  ApiErrorException,
  isApiError,
  ApiErrors,
} from './ApiError';

describe('ApiError Model', () => {
  describe('ApiError interface', () => {
    it('should compile with valid error codes', () => {
      const notFoundError: ApiError = {
        code: 'NOT_FOUND',
        message: 'Document not found',
      };

      const expiredError: ApiError = {
        code: 'EXPIRED',
        message: 'Access code expired',
      };

      expect(notFoundError.code).toBe('NOT_FOUND');
      expect(expiredError.code).toBe('EXPIRED');
    });

    it('should support all defined error codes', () => {
      const codes: ApiErrorCode[] = ['NOT_FOUND', 'EXPIRED', 'UNAVAILABLE', 'INVALID', 'UNKNOWN'];

      codes.forEach((code) => {
        const error: ApiError = {
          code,
          message: `Test error for ${code}`,
        };

        expect(error.code).toBe(code);
        expect(typeof error.message).toBe('string');
      });
    });
  });

  describe('ApiErrorException class', () => {
    it('should create exception from ApiError object', () => {
      const apiError: ApiError = {
        code: 'NOT_FOUND',
        message: 'Document not found for code ABC123',
      };

      const exception = new ApiErrorException(apiError);

      expect(exception).toBeInstanceOf(Error);
      expect(exception).toBeInstanceOf(ApiErrorException);
      expect(exception.code).toBe('NOT_FOUND');
      expect(exception.message).toBe('Document not found for code ABC123');
      expect(exception.name).toBe('ApiErrorException');
    });

    it('should create exception using fromApiError static method', () => {
      const apiError: ApiError = {
        code: 'EXPIRED',
        message: 'Code expired 2 days ago',
      };

      const exception = ApiErrorException.fromApiError(apiError);

      expect(exception.code).toBe('EXPIRED');
      expect(exception.message).toBe('Code expired 2 days ago');
    });

    it('should convert back to ApiError object', () => {
      const originalError: ApiError = {
        code: 'UNAVAILABLE',
        message: 'Service maintenance in progress',
      };

      const exception = new ApiErrorException(originalError);
      const convertedBack = exception.toApiError();

      expect(convertedBack).toEqual(originalError);
      expect(convertedBack.code).toBe('UNAVAILABLE');
      expect(convertedBack.message).toBe('Service maintenance in progress');
    });
  });

  describe('isApiError type guard', () => {
    it('should return true for valid ApiError objects', () => {
      const validErrors = [
        { code: 'NOT_FOUND', message: 'Not found' },
        { code: 'EXPIRED', message: 'Expired' },
        { code: 'UNAVAILABLE', message: 'Unavailable' },
        { code: 'INVALID', message: 'Invalid' },
        { code: 'UNKNOWN', message: 'Unknown error' },
      ];

      validErrors.forEach((error) => {
        expect(isApiError(error)).toBe(true);
      });
    });

    it('should return false for null or undefined', () => {
      expect(isApiError(null)).toBe(false);
      expect(isApiError(undefined)).toBe(false);
    });

    it('should return false for non-objects', () => {
      expect(isApiError('string')).toBe(false);
      expect(isApiError(123)).toBe(false);
      expect(isApiError(true)).toBe(false);
      expect(isApiError([])).toBe(false);
    });

    it('should return false for objects missing required fields', () => {
      const missingCode = { message: 'Error message' };
      const missingMessage = { code: 'NOT_FOUND' };

      expect(isApiError(missingCode)).toBe(false);
      expect(isApiError(missingMessage)).toBe(false);
    });

    it('should return false for objects with invalid field types', () => {
      const invalidCode = { code: 123, message: 'Error' };
      const invalidMessage = { code: 'NOT_FOUND', message: true };

      expect(isApiError(invalidCode)).toBe(false);
      expect(isApiError(invalidMessage)).toBe(false);
    });

    it('should return false for objects with invalid error codes', () => {
      const invalidErrorCode = { code: 'INVALID_CODE', message: 'Error' };
      const emptyCode = { code: '', message: 'Error' };

      expect(isApiError(invalidErrorCode)).toBe(false);
      expect(isApiError(emptyCode)).toBe(false);
    });
  });

  describe('ApiErrors helper functions', () => {
    it('should create NOT_FOUND error with default message', () => {
      const error = ApiErrors.notFound();

      expect(error.code).toBe('NOT_FOUND');
      expect(error.message).toBe('Document not found');
    });

    it('should create NOT_FOUND error with custom message', () => {
      const customMessage = 'Document with code XYZ not found';
      const error = ApiErrors.notFound(customMessage);

      expect(error.code).toBe('NOT_FOUND');
      expect(error.message).toBe(customMessage);
    });

    it('should create EXPIRED error', () => {
      const error = ApiErrors.expired('Custom expiry message');

      expect(error.code).toBe('EXPIRED');
      expect(error.message).toBe('Custom expiry message');
    });

    it('should create UNAVAILABLE error', () => {
      const error = ApiErrors.unavailable();

      expect(error.code).toBe('UNAVAILABLE');
      expect(error.message).toBe('Service temporarily unavailable');
    });

    it('should create INVALID error', () => {
      const error = ApiErrors.invalid('Invalid access code format');

      expect(error.code).toBe('INVALID');
      expect(error.message).toBe('Invalid access code format');
    });

    it('should create UNKNOWN error', () => {
      const error = ApiErrors.unknown();

      expect(error.code).toBe('UNKNOWN');
      expect(error.message).toBe('An unexpected error occurred');
    });

    it('should create all error types with default messages', () => {
      const errors = {
        notFound: ApiErrors.notFound(),
        expired: ApiErrors.expired(),
        unavailable: ApiErrors.unavailable(),
        invalid: ApiErrors.invalid(),
        unknown: ApiErrors.unknown(),
      };

      expect(errors.notFound.code).toBe('NOT_FOUND');
      expect(errors.expired.code).toBe('EXPIRED');
      expect(errors.unavailable.code).toBe('UNAVAILABLE');
      expect(errors.invalid.code).toBe('INVALID');
      expect(errors.unknown.code).toBe('UNKNOWN');

      // All should have non-empty messages
      Object.values(errors).forEach((error) => {
        expect(error.message.length).toBeGreaterThan(0);
      });
    });
  });
});
