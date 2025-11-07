import type { PublicDocument } from '../models';

/**
 * Interface for document retrieval providers
 *
 * This interface abstracts the document data source, allowing different
 * implementations (mock, HTTP API, cache, etc.) to be used interchangeably.
 */
export interface DocumentProvider {
  /**
   * Retrieves a document by its access code
   *
   * @param code - The unique access code for the document
   * @returns Promise that resolves to the PublicDocument
   * @throws ApiErrorException for various error conditions:
   *   - NOT_FOUND: Document doesn't exist for the given code
   *   - EXPIRED: Access code has expired
   *   - INVALID: Malformed or invalid access code
   *   - UNAVAILABLE: Service temporarily unavailable
   *   - UNKNOWN: Unexpected error occurred
   */
  getByCode(code: string): Promise<PublicDocument>;
}
