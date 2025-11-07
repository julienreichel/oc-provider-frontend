import { describe, it, expect } from 'vitest';
import { type PublicDocument, isPublicDocument, createPublicDocument } from './PublicDocument';

describe('PublicDocument Model', () => {
  describe('PublicDocument interface', () => {
    it('should compile with all required fields', () => {
      const doc: PublicDocument = {
        id: 'test-id',
        title: 'Test Document',
        content: 'This is test content',
        createdAt: '2023-01-01T00:00:00Z',
      };

      // TypeScript compilation test - if this compiles, the interface is correct
      expect(doc.id).toBe('test-id');
      expect(doc.title).toBe('Test Document');
      expect(doc.content).toBe('This is test content');
      expect(doc.createdAt).toBe('2023-01-01T00:00:00Z');
    });

    it('should compile with optional meta field', () => {
      const doc: PublicDocument = {
        id: 'test-id',
        title: 'Test Document',
        content: 'Content',
        createdAt: '2023-01-01T00:00:00Z',
        meta: {
          author: 'John Doe',
          version: 1,
          published: true,
        },
      };

      expect(doc.meta).toBeDefined();
      expect(doc.meta?.author).toBe('John Doe');
      expect(doc.meta?.version).toBe(1);
      expect(doc.meta?.published).toBe(true);
    });
  });

  describe('isPublicDocument type guard', () => {
    it('should return true for valid PublicDocument', () => {
      const validDoc = {
        id: 'doc-123',
        title: 'Valid Document',
        content: 'Some content',
        createdAt: '2023-01-01T00:00:00Z',
      };

      expect(isPublicDocument(validDoc)).toBe(true);
    });

    it('should return true for valid PublicDocument with meta', () => {
      const validDocWithMeta = {
        id: 'doc-456',
        title: 'Document with Meta',
        content: 'Content here',
        createdAt: '2023-01-01T00:00:00Z',
        meta: {
          category: 'report',
          priority: 5,
          draft: false,
        },
      };

      expect(isPublicDocument(validDocWithMeta)).toBe(true);
    });

    it('should return false for null or undefined', () => {
      expect(isPublicDocument(null)).toBe(false);
      expect(isPublicDocument(undefined)).toBe(false);
    });

    it('should return false for non-objects', () => {
      expect(isPublicDocument('string')).toBe(false);
      expect(isPublicDocument(123)).toBe(false);
      expect(isPublicDocument(true)).toBe(false);
      expect(isPublicDocument([])).toBe(false);
    });

    it('should return false when required fields are missing', () => {
      const missingId = { title: 'Test', content: 'Test', createdAt: '2023-01-01T00:00:00Z' };
      const missingTitle = { id: '123', content: 'Test', createdAt: '2023-01-01T00:00:00Z' };
      const missingContent = { id: '123', title: 'Test', createdAt: '2023-01-01T00:00:00Z' };
      const missingCreatedAt = { id: '123', title: 'Test', content: 'Test' };

      expect(isPublicDocument(missingId)).toBe(false);
      expect(isPublicDocument(missingTitle)).toBe(false);
      expect(isPublicDocument(missingContent)).toBe(false);
      expect(isPublicDocument(missingCreatedAt)).toBe(false);
    });

    it('should return false when required fields have wrong types', () => {
      const wrongTypes = {
        id: 123, // should be string
        title: true, // should be string
        content: null, // should be string
        createdAt: new Date(), // should be string
      };

      expect(isPublicDocument(wrongTypes)).toBe(false);
    });

    it('should return false when meta has invalid value types', () => {
      const invalidMeta = {
        id: 'doc-123',
        title: 'Test',
        content: 'Content',
        createdAt: '2023-01-01T00:00:00Z',
        meta: {
          validString: 'ok',
          validNumber: 42,
          validBoolean: true,
          invalidArray: [], // arrays not allowed
          invalidObject: {}, // nested objects not allowed
          invalidNull: null, // null not allowed
        },
      };

      expect(isPublicDocument(invalidMeta)).toBe(false);
    });

    it('should return false when meta is not an object', () => {
      const invalidMetaType = {
        id: 'doc-123',
        title: 'Test',
        content: 'Content',
        createdAt: '2023-01-01T00:00:00Z',
        meta: 'not an object',
      };

      expect(isPublicDocument(invalidMetaType)).toBe(false);
    });
  });

  describe('createPublicDocument factory', () => {
    it('should create a document with default values', () => {
      const doc = createPublicDocument();

      expect(doc.id).toBe('');
      expect(doc.title).toBe('');
      expect(doc.content).toBe('');
      expect(doc.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/); // ISO format
      expect(doc.meta).toBeUndefined();
    });

    it('should create a document with provided overrides', () => {
      const overrides = {
        id: 'custom-id',
        title: 'Custom Title',
        meta: { category: 'test' },
      };

      const doc = createPublicDocument(overrides);

      expect(doc.id).toBe('custom-id');
      expect(doc.title).toBe('Custom Title');
      expect(doc.content).toBe(''); // default value
      expect(doc.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/); // default ISO format
      expect(doc.meta).toEqual({ category: 'test' });
    });

    it('should allow overriding all fields including createdAt', () => {
      const customDate = '2023-06-15T10:30:00Z';
      const overrides: Partial<PublicDocument> = {
        id: 'full-override',
        title: 'Full Override Document',
        content: 'All fields customized',
        createdAt: customDate,
        meta: {
          author: 'Test Author',
          version: 2,
          final: true,
        },
      };

      const doc = createPublicDocument(overrides);

      expect(doc.id).toBe('full-override');
      expect(doc.title).toBe('Full Override Document');
      expect(doc.content).toBe('All fields customized');
      expect(doc.createdAt).toBe(customDate);
      expect(doc.meta).toEqual({
        author: 'Test Author',
        version: 2,
        final: true,
      });
    });
  });
});
