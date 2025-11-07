import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DocumentsHttpProvider } from './DocumentsHttpProvider';
import type { HttpClient } from './HttpClient';
import { ApiErrorException, ApiErrors } from '../models/ApiError';

const createMockHttpClient = (): {
  client: HttpClient;
  post: ReturnType<typeof vi.fn>;
  get: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
} => {
  const post = vi.fn();
  const get = vi.fn();
  const put = vi.fn();

  return {
    client: {
      post,
      get,
      put,
    } as unknown as HttpClient,
    post,
    get,
    put,
  };
};

const sampleDocument = {
  id: 'doc-123',
  title: 'Sample Draft',
  content: 'Document body...',
  status: 'draft',
  accessCode: null,
  createdAt: '2025-11-07T13:45:12.000Z',
} as const;

const samplePage = {
  items: [sampleDocument],
  nextCursor: 'base64-string-or-null',
};

describe('DocumentsHttpProvider', () => {
  let mockHttp: ReturnType<typeof createMockHttpClient>;
  let provider: DocumentsHttpProvider;

  beforeEach(() => {
    mockHttp = createMockHttpClient();
    provider = new DocumentsHttpProvider(mockHttp.client);
  });

  describe('create', () => {
    it('posts to /documents and returns document id', async () => {
      mockHttp.post.mockResolvedValue({ id: 'doc-123' });

      const payload = { title: 'Sample Draft', content: 'Document body...' };
      const result = await provider.create(payload);

      expect(mockHttp.post).toHaveBeenCalledWith('/documents', payload);
      expect(result).toEqual({ id: 'doc-123' });
    });

    it('throws when server responds with invalid payload', async () => {
      mockHttp.post.mockResolvedValue({});
      await expect(provider.create({ title: 'Test', content: 'Content' })).rejects.toThrow(
        ApiErrorException,
      );
    });
  });

  describe('get', () => {
    it('fetches a document from /documents/:id', async () => {
      mockHttp.get.mockResolvedValue(sampleDocument);

      const result = await provider.get('doc-123');

      expect(mockHttp.get).toHaveBeenCalledWith('/documents/doc-123');
      expect(result).toEqual(sampleDocument);
    });

    it('throws when payload is invalid', async () => {
      mockHttp.get.mockResolvedValue({});
      await expect(provider.get('doc-123')).rejects.toThrow(ApiErrorException);
    });
  });

  describe('update', () => {
    it('sends document patch via PUT', async () => {
      mockHttp.put.mockResolvedValue(sampleDocument);

      const patch = { title: 'Updated Title' };
      const result = await provider.update('doc-123', patch);

      expect(mockHttp.put).toHaveBeenCalledWith('/documents/doc-123', patch);
      expect(result).toEqual(sampleDocument);
    });
  });

  describe('list', () => {
    it('lists documents with default limit', async () => {
      mockHttp.get.mockResolvedValue(samplePage);

      const result = await provider.list();

      expect(mockHttp.get).toHaveBeenCalledWith('/documents?limit=20');
      expect(result).toEqual(samplePage);
    });

    it('lists documents with cursor and custom limit', async () => {
      mockHttp.get.mockResolvedValue(samplePage);

      await provider.list('cursor-123', 10);

      expect(mockHttp.get).toHaveBeenCalledWith('/documents?limit=10&cursor=cursor-123');
    });

    it('throws when cursor payload is invalid', async () => {
      mockHttp.get.mockResolvedValue({});
      await expect(provider.list()).rejects.toThrow(ApiErrorException);
    });
  });

  it('propagates ApiErrorException from HttpClient', async () => {
    const apiError = ApiErrorException.fromApiError(ApiErrors.notFound('Missing'));
    mockHttp.get.mockRejectedValue(apiError);

    await expect(provider.get('missing')).rejects.toBe(apiError);
  });
});
