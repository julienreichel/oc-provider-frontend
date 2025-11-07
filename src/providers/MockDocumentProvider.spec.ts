import { describe, it, expect, beforeEach } from 'vitest';
import { MockDocumentProvider } from './MockDocumentProvider';
import { ApiErrorException } from '../models/ApiError';
import { isPublicDocument } from '../models/PublicDocument';
import type { DocumentProvider } from './DocumentProvider';

describe('MockDocumentProvider', () => {
  let provider: MockDocumentProvider;

  beforeEach(() => {
    provider = new MockDocumentProvider();
  });

  describe('interface compliance', () => {
    it('should implement DocumentProvider interface', () => {
      // TypeScript compilation test
      const documentProvider: DocumentProvider = provider;
      expect(documentProvider).toBeDefined();
      expect(typeof documentProvider.getByCode).toBe('function');
    });
  });

  describe('successful document retrieval', () => {
    it('should return a valid PublicDocument for existing code', async () => {
      const code = 'valid123';
      const document = await provider.getByCode(code);

      expect(isPublicDocument(document)).toBe(true);
      expect(document.id).toBeDefined();
      expect(document.title).toBeDefined();
      expect(document.content).toBeDefined();
      expect(document.createdAt).toBeDefined();
      expect(typeof document.id).toBe('string');
      expect(typeof document.title).toBe('string');
      expect(typeof document.content).toBe('string');
      expect(typeof document.createdAt).toBe('string');
    });

    it('should return documents with different content for different codes', async () => {
      const doc1 = await provider.getByCode('valid123');
      const doc2 = await provider.getByCode('test456');

      expect(doc1.id).not.toBe(doc2.id);
      expect(doc1.title).not.toBe(doc2.title);
    });

    it('should return consistent results for the same code', async () => {
      const code = 'valid123';
      const doc1 = await provider.getByCode(code);
      const doc2 = await provider.getByCode(code);

      expect(doc1).toEqual(doc2);
    });

    it('should return documents with valid ISO date format', async () => {
      const document = await provider.getByCode('valid123');

      // Test ISO 8601 format
      expect(document.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/);

      // Should be a valid date
      const date = new Date(document.createdAt);
      expect(date.toString()).not.toBe('Invalid Date');
    });

    it('should support documents with meta data', async () => {
      const document = await provider.getByCode('withmeta789');

      expect(document.meta).toBeDefined();
      if (document.meta) {
        // Meta should only contain string, number, or boolean values
        Object.values(document.meta).forEach((value) => {
          expect(['string', 'number', 'boolean']).toContain(typeof value);
        });
      }
    });
  });

  describe('error simulation', () => {
    it('should throw ApiErrorException with NOT_FOUND for unknown codes', async () => {
      await expect(provider.getByCode('unknown')).rejects.toThrow(ApiErrorException);

      try {
        await provider.getByCode('nonexistent');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiErrorException);
        if (error instanceof ApiErrorException) {
          expect(error.code).toBe('NOT_FOUND');
          expect(error.message).toContain('not found');
        }
      }
    });

    it('should throw ApiErrorException with EXPIRED for expired code', async () => {
      await expect(provider.getByCode('expired')).rejects.toThrow(ApiErrorException);

      try {
        await provider.getByCode('expired');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiErrorException);
        if (error instanceof ApiErrorException) {
          expect(error.code).toBe('EXPIRED');
          expect(error.message).toContain('expired');
        }
      }
    });

    it('should throw ApiErrorException with INVALID for invalid code format', async () => {
      const invalidCodes = ['', '   ', 'bad@code', 'xx', 'invalid#format'];

      for (const invalidCode of invalidCodes) {
        await expect(provider.getByCode(invalidCode)).rejects.toThrow(ApiErrorException);

        try {
          await provider.getByCode(invalidCode);
        } catch (error) {
          expect(error).toBeInstanceOf(ApiErrorException);
          if (error instanceof ApiErrorException) {
            expect(error.code).toBe('INVALID');
            expect(error.message.toLowerCase()).toContain('invalid');
          }
        }
      }
    });

    it('should throw ApiErrorException with UNAVAILABLE for service simulation', async () => {
      await expect(provider.getByCode('unavailable')).rejects.toThrow(ApiErrorException);

      try {
        await provider.getByCode('unavailable');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiErrorException);
        if (error instanceof ApiErrorException) {
          expect(error.code).toBe('UNAVAILABLE');
          expect(error.message).toContain('unavailable');
        }
      }
    });

    it('should throw ApiErrorException with UNKNOWN for unknown error simulation', async () => {
      await expect(provider.getByCode('unknown-error')).rejects.toThrow(ApiErrorException);

      try {
        await provider.getByCode('unknown-error');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiErrorException);
        if (error instanceof ApiErrorException) {
          expect(error.code).toBe('UNKNOWN');
        }
      }
    });
  });

  describe('edge cases', () => {
    it('should handle very long codes appropriately', async () => {
      const longCode = 'a'.repeat(1000);

      // Should either return a document or throw a specific error
      try {
        const result = await provider.getByCode(longCode);
        expect(isPublicDocument(result)).toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(ApiErrorException);
      }
    });

    it('should handle codes with special characters', async () => {
      const specialCode = 'special-code_123';

      // Should either return a document or throw a specific error
      try {
        const result = await provider.getByCode(specialCode);
        expect(isPublicDocument(result)).toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(ApiErrorException);
      }
    });
  });

  describe('async behavior', () => {
    it('should return promises that resolve asynchronously', async () => {
      let resolved = false;
      const promise = provider.getByCode('valid123').then(() => {
        resolved = true;
      });

      // Should not be resolved immediately
      expect(resolved).toBe(false);

      await promise;
      expect(resolved).toBe(true);
    });

    it('should handle concurrent requests correctly', async () => {
      const promises = [
        provider.getByCode('valid123'),
        provider.getByCode('test456'),
        provider.getByCode('valid123'), // duplicate
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      expect(results[0]).toEqual(results[2]); // duplicate requests should return same result
      expect(results[0]).not.toEqual(results[1]); // different codes should return different results
    });
  });
});
