/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useDocumentByCode } from './useDocumentByCode';
import * as ProviderRegistry from '../providers/ProviderRegistry';
import type { DocumentProvider } from '../providers/DocumentProvider';
import { ApiErrors, ApiErrorException } from '../models/ApiError';
import type { PublicDocument } from '../models/PublicDocument';

describe('useDocumentByCode', () => {
  let mockProvider: DocumentProvider;
  let composable: ReturnType<typeof useDocumentByCode>;

  const mockDocument: PublicDocument = {
    id: 'doc123',
    title: 'Test Document',
    content: 'This is test content',
    createdAt: '2024-01-15T10:30:00Z',
  };

  beforeEach(() => {
    // Create mock provider
    mockProvider = {
      getByCode: vi.fn(),
    };

    // Mock ProviderRegistry
    vi.spyOn(ProviderRegistry, 'getCurrentProvider').mockReturnValue(mockProvider);

    // Create fresh composable instance
    composable = useDocumentByCode();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with default state', () => {
      expect(composable.state.loading.value).toBe(false);
      expect(composable.state.data.value).toBeUndefined();
      expect(composable.state.error.value).toBeUndefined();
    });
  });

  describe('load function - success path', () => {
    it('should handle successful document loading', async () => {
      // Mock successful response
      vi.mocked(mockProvider.getByCode).mockResolvedValue(mockDocument);

      // Start loading
      const loadPromise = composable.load('ABC123');

      // Should set loading to true immediately
      expect(composable.state.loading.value).toBe(true);
      expect(composable.state.data.value).toBeUndefined();
      expect(composable.state.error.value).toBeUndefined();

      // Wait for completion
      await loadPromise;

      // Should set data and clear loading
      expect(composable.state.loading.value).toBe(false);
      expect(composable.state.data.value).toEqual(mockDocument);
      expect(composable.state.error.value).toBeUndefined();

      // Should have called provider with correct code
      expect(mockProvider.getByCode).toHaveBeenCalledWith('ABC123');
      expect(mockProvider.getByCode).toHaveBeenCalledTimes(1);
    });

    it('should clear previous error when loading new document', async () => {
      // First, set an error state
      const error = ApiErrors.notFound('Not found');
      vi.mocked(mockProvider.getByCode).mockRejectedValueOnce(new ApiErrorException(error));

      await composable.load('INVALID');
      expect(composable.state.error.value).toEqual(error);

      // Now load successfully
      vi.mocked(mockProvider.getByCode).mockResolvedValueOnce(mockDocument);
      await composable.load('ABC123');

      expect(composable.state.error.value).toBeUndefined();
      expect(composable.state.data.value).toEqual(mockDocument);
    });

    it('should clear previous data when loading new document', async () => {
      // First, load a document successfully
      vi.mocked(mockProvider.getByCode).mockResolvedValueOnce(mockDocument);
      await composable.load('ABC123');
      expect(composable.state.data.value).toEqual(mockDocument);

      // Now simulate loading a different document (that will fail)
      const error = ApiErrors.notFound('Not found');
      vi.mocked(mockProvider.getByCode).mockRejectedValueOnce(new ApiErrorException(error));
      await composable.load('INVALID');

      expect(composable.state.data.value).toBeUndefined();
      expect(composable.state.error.value).toEqual(error);
    });
  });

  describe('load function - error paths', () => {
    it('should handle NOT_FOUND error', async () => {
      const error = ApiErrors.notFound('Document not found');
      vi.mocked(mockProvider.getByCode).mockRejectedValue(new ApiErrorException(error));

      await composable.load('NOTFOUND');

      expect(composable.state.loading.value).toBe(false);
      expect(composable.state.data.value).toBeUndefined();
      expect(composable.state.error.value).toEqual(error);
      expect(composable.state.error.value?.code).toBe('NOT_FOUND');
    });

    it('should handle EXPIRED error', async () => {
      const error = ApiErrors.expired('Document has expired');
      vi.mocked(mockProvider.getByCode).mockRejectedValue(new ApiErrorException(error));

      await composable.load('EXPIRED123');

      expect(composable.state.loading.value).toBe(false);
      expect(composable.state.data.value).toBeUndefined();
      expect(composable.state.error.value).toEqual(error);
      expect(composable.state.error.value?.code).toBe('EXPIRED');
    });

    it('should handle INVALID error', async () => {
      const error = ApiErrors.invalid('Invalid access code format');
      vi.mocked(mockProvider.getByCode).mockRejectedValue(new ApiErrorException(error));

      await composable.load('INVALID!@#');

      expect(composable.state.loading.value).toBe(false);
      expect(composable.state.data.value).toBeUndefined();
      expect(composable.state.error.value).toEqual(error);
      expect(composable.state.error.value?.code).toBe('INVALID');
    });

    it('should handle generic errors as UNAVAILABLE', async () => {
      const genericError = new Error('Network error');
      vi.mocked(mockProvider.getByCode).mockRejectedValue(genericError);

      await composable.load('ABC123');

      expect(composable.state.loading.value).toBe(false);
      expect(composable.state.data.value).toBeUndefined();
      expect(composable.state.error.value?.code).toBe('UNAVAILABLE');
      expect(composable.state.error.value?.message).toContain('Network error');
    });
  });

  describe('reload function', () => {
    it('should reload with the same code when data exists', async () => {
      // First load
      vi.mocked(mockProvider.getByCode).mockResolvedValue(mockDocument);
      await composable.load('ABC123');

      expect(mockProvider.getByCode).toHaveBeenCalledWith('ABC123');
      expect(mockProvider.getByCode).toHaveBeenCalledTimes(1);

      // Reset mock to track reload call
      vi.clearAllMocks();

      // Mock the reload response
      const updatedDocument = { ...mockDocument, content: 'Updated content' };
      vi.mocked(mockProvider.getByCode).mockResolvedValue(updatedDocument);

      // Reload
      await composable.reload();

      expect(mockProvider.getByCode).toHaveBeenCalledWith('ABC123');
      expect(mockProvider.getByCode).toHaveBeenCalledTimes(1);
      expect(composable.state.data.value).toEqual(updatedDocument);
    });

    it('should not reload when no data exists', async () => {
      // Try to reload without loading first
      await composable.reload();

      expect(mockProvider.getByCode).not.toHaveBeenCalled();
      expect(composable.state.loading.value).toBe(false);
    });

    it('should reload even when in error state if code exists', async () => {
      // First load that fails
      const error = ApiErrors.notFound('Not found');
      vi.mocked(mockProvider.getByCode).mockRejectedValueOnce(new ApiErrorException(error));
      await composable.load('ABC123');

      expect(composable.state.error.value).toEqual(error);

      // Reset and setup success for reload
      vi.clearAllMocks();
      vi.mocked(mockProvider.getByCode).mockResolvedValue(mockDocument);

      // Reload should work
      await composable.reload();

      expect(mockProvider.getByCode).toHaveBeenCalledWith('ABC123');
      expect(composable.state.data.value).toEqual(mockDocument);
      expect(composable.state.error.value).toBeUndefined();
    });
  });
});
