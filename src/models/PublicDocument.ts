/**
 * Represents a document that can be publicly accessed via an access code
 */
export interface PublicDocument {
  /** Unique identifier for the document */
  id: string;
  /** Document title */
  title: string;
  /** Document content */
  content: string;
  /** ISO 8601 timestamp when the document was created */
  createdAt: string;
  /** Optional metadata key-value pairs */
  meta?: Record<string, string | number | boolean>;
}

/**
 * Type guard to check if an object is a valid PublicDocument
 */
export function isPublicDocument(obj: unknown): obj is PublicDocument {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const doc = obj as Record<string, unknown>;

  // Check required fields
  if (typeof doc.id !== 'string') return false;
  if (typeof doc.title !== 'string') return false;
  if (typeof doc.content !== 'string') return false;
  if (typeof doc.createdAt !== 'string') return false;

  // Check optional meta field
  if (doc.meta !== undefined) {
    if (typeof doc.meta !== 'object' || doc.meta === null) {
      return false;
    }

    // Validate meta values are only string, number, or boolean
    for (const value of Object.values(doc.meta)) {
      if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
        return false;
      }
    }
  }

  return true;
}

/**
 * Creates a PublicDocument with default values
 */
export function createPublicDocument(overrides: Partial<PublicDocument> = {}): PublicDocument {
  return {
    id: '',
    title: '',
    content: '',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}
