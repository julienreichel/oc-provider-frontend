import { describe, it, expect } from 'vitest';
import {
  assertDocument,
  isCursorPage,
  isDocument,
  isHealth,
  isReady,
  isSendResult,
  type CursorPage,
  type Document,
  type SendResult,
} from './Document';

describe('Document domain models', () => {
  const sampleDocument: Document = {
    id: 'doc-123',
    title: 'Sample Draft',
    content: 'Document body...',
    status: 'draft',
    accessCode: null,
    createdAt: '2025-11-07T13:45:12.000Z',
  };

  it('validates document payloads from /api', () => {
    expect(isDocument(sampleDocument)).toBe(true);
    expect(assertDocument(sampleDocument)).toEqual(sampleDocument);
  });

  it('rejects invalid document payloads', () => {
    expect(() =>
      assertDocument({
        ...sampleDocument,
        status: 'unknown',
      }),
    ).toThrow('Invalid Document payload');
  });

  it('validates cursor pages for documents', () => {
    const payload: CursorPage<Document> = {
      items: [sampleDocument],
      nextCursor: 'YmFzZTY0',
    };

    expect(isCursorPage(payload, isDocument)).toBe(true);
  });

  it('accepts null cursor when no more pages exist', () => {
    const payload: CursorPage<Document> = {
      items: [],
      nextCursor: null,
    };

    expect(isCursorPage(payload, isDocument)).toBe(true);
  });

  it('validates send results', () => {
    const sendPayload: SendResult = {
      accessCode: 'ABC12345',
    };

    expect(isSendResult(sendPayload)).toBe(true);
  });

  it('validates health responses', () => {
    expect(
      isHealth({
        status: 'ok',
        timestamp: '2025-11-07T13:45:12.000Z',
      }),
    ).toBe(true);
  });

  it('validates readiness responses', () => {
    expect(
      isReady({
        status: 'ready',
        database: 'connected',
      }),
    ).toBe(true);
  });
});
