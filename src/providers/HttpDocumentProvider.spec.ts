import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HttpDocumentProvider } from './HttpDocumentProvider';
import { HttpError } from './HttpClient';

// Mock the entire HttpClient module
const mockGet = vi.fn();
vi.mock('./HttpClient', () => ({
  HttpClient: class {
    constructor() {}
    get = mockGet;
  },
  HttpError: class extends Error {
    constructor(
      public status: number,
      public statusText: string,
      message?: string,
    ) {
      super(message ?? `HTTP ${status}: ${statusText}`);
      this.name = 'HttpError';
    }
  },
}));

describe('HttpDocumentProvider', () => {
  let provider: HttpDocumentProvider;

  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();

    // Create new provider instance
    provider = new HttpDocumentProvider({
      baseUrl: 'https://api.example.com',
    });
  });

  describe('getByCode', () => {
    it('should return document when HTTP request succeeds', async () => {
      const mockDocument = {
        id: 'doc123',
        title: 'Test Document',
        content: 'This is a test document',
        createdAt: '2023-01-01T00:00:00Z',
      };

      mockGet.mockResolvedValue({
        status: 200,
        data: mockDocument,
      });

      const result = await provider.getByCode('ABC123');

      expect(mockGet).toHaveBeenCalledWith('/public/ABC123');
      expect(result).toEqual(mockDocument);
    });

    it('should throw NOT_FOUND error for 404 response', async () => {
      mockGet.mockRejectedValue(new HttpError(404, 'Not Found'));

      await expect(provider.getByCode('INVALID')).rejects.toThrow(
        expect.objectContaining({
          code: 'NOT_FOUND',
          message: expect.stringContaining('Document not found'),
        }),
      );
    });

    it('should throw EXPIRED error for 410 response', async () => {
      mockGet.mockRejectedValue(new HttpError(410, 'Gone'));

      await expect(provider.getByCode('EXPIRED')).rejects.toThrow(
        expect.objectContaining({
          code: 'EXPIRED',
          message: expect.stringContaining('Document has expired'),
        }),
      );
    });

    it('should throw UNAVAILABLE error for 503 response', async () => {
      mockGet.mockRejectedValue(new HttpError(503, 'Service Unavailable'));

      await expect(provider.getByCode('ABC123')).rejects.toThrow(
        expect.objectContaining({
          code: 'UNAVAILABLE',
          message: expect.stringContaining('Service temporarily unavailable'),
        }),
      );
    });

    it('should throw INVALID error for 400 response', async () => {
      mockGet.mockRejectedValue(new HttpError(400, 'Bad Request'));

      await expect(provider.getByCode('INVALID_FORMAT')).rejects.toThrow(
        expect.objectContaining({
          code: 'INVALID',
          message: expect.stringContaining('Invalid access code format'),
        }),
      );
    });

    it('should throw UNKNOWN error for other HTTP errors', async () => {
      mockGet.mockRejectedValue(new HttpError(500, 'Internal Server Error'));

      await expect(provider.getByCode('ABC123')).rejects.toThrow(
        expect.objectContaining({
          code: 'UNKNOWN',
          message: expect.stringContaining('An unexpected error occurred'),
        }),
      );
    });

    it('should throw UNKNOWN error for non-HTTP errors', async () => {
      mockGet.mockRejectedValue(new Error('Network error'));

      await expect(provider.getByCode('ABC123')).rejects.toThrow(
        expect.objectContaining({
          code: 'UNKNOWN',
          message: expect.stringContaining('An unexpected error occurred'),
        }),
      );
    });

    it('should validate access code format', async () => {
      await expect(provider.getByCode('')).rejects.toThrow(
        expect.objectContaining({
          code: 'INVALID',
          message: expect.stringContaining('Access code cannot be empty'),
        }),
      );

      await expect(provider.getByCode('   ')).rejects.toThrow(
        expect.objectContaining({
          code: 'INVALID',
          message: expect.stringContaining('Access code cannot be empty'),
        }),
      );
    });

    it('should pass through correct endpoint path', async () => {
      mockGet.mockResolvedValue({
        status: 200,
        data: { id: 'doc123', title: 'Test' },
      });

      await provider.getByCode('XYZ789');

      expect(mockGet).toHaveBeenCalledWith('/public/XYZ789');
    });

    it('should handle timeout errors appropriately', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'HttpTimeoutError';
      mockGet.mockRejectedValue(timeoutError);

      await expect(provider.getByCode('ABC123')).rejects.toThrow(
        expect.objectContaining({
          code: 'UNAVAILABLE',
          message: expect.stringContaining('Request timed out'),
        }),
      );
    });
  });

  describe('initialization', () => {
    it('should create provider instance successfully', () => {
      const provider = new HttpDocumentProvider({
        baseUrl: 'https://test-api.example.com',
        timeout: 5000,
        headers: { 'X-API-Key': 'test-key' },
      });

      expect(provider).toBeDefined();
      expect(typeof provider.getByCode).toBe('function');
    });

    it('should create provider with minimal config', () => {
      const provider = new HttpDocumentProvider({
        baseUrl: 'https://minimal.example.com',
      });

      expect(provider).toBeDefined();
      expect(typeof provider.getByCode).toBe('function');
    });
  });
});
