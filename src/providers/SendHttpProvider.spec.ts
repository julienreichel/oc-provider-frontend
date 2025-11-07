import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SendHttpProvider } from './SendHttpProvider';
import type { HttpClient } from './HttpClient';
import { ApiErrorException, ApiErrors } from '../models/ApiError';

const createMockHttpClient = (): { client: HttpClient; post: ReturnType<typeof vi.fn> } => {
  const post = vi.fn();
  return {
    client: { post } as unknown as HttpClient,
    post,
  };
};

const sampleSendResult = {
  accessCode: 'ABC12345',
};

describe('SendHttpProvider', () => {
  let mockHttp: ReturnType<typeof createMockHttpClient>;
  let provider: SendHttpProvider;

  beforeEach(() => {
    mockHttp = createMockHttpClient();
    provider = new SendHttpProvider(mockHttp.client);
  });

  it('sends documentId to /send endpoint', async () => {
    mockHttp.post.mockResolvedValue(sampleSendResult);

    const result = await provider.send('doc-123');

    expect(mockHttp.post).toHaveBeenCalledWith('/send', { documentId: 'doc-123' });
    expect(result).toEqual(sampleSendResult);
  });

  it('propagates ApiErrorException for invalid document state (400)', async () => {
    const apiError = ApiErrorException.fromApiError(ApiErrors.invalid('INVALID_DOCUMENT_STATE'));
    mockHttp.post.mockRejectedValue(apiError);

    await expect(provider.send('doc-123')).rejects.toBe(apiError);
  });

  it('propagates ApiErrorException for missing documents (404)', async () => {
    const apiError = ApiErrorException.fromApiError(ApiErrors.notFound());
    mockHttp.post.mockRejectedValue(apiError);

    await expect(provider.send('doc-404')).rejects.toBe(apiError);
  });

  it('propagates ApiErrorException for upstream failures (502)', async () => {
    const apiError = ApiErrorException.fromApiError(ApiErrors.unavailable('EXTERNAL_SERVICE_ERROR'));
    mockHttp.post.mockRejectedValue(apiError);

    await expect(provider.send('doc-123')).rejects.toBe(apiError);
  });

  it('throws when API returns invalid response shape', async () => {
    mockHttp.post.mockResolvedValue({});
    await expect(provider.send('doc-123')).rejects.toThrow(ApiErrorException);
  });
});
