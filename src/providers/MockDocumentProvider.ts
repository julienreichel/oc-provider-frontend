import type { DocumentProvider } from './DocumentProvider';
import type { PublicDocument } from '../models/PublicDocument';
import { ApiErrorException, ApiErrors } from '../models/ApiError';

/**
 * Mock implementation of DocumentProvider for testing and development
 *
 * Simulates various scenarios including successful document retrieval
 * and different types of errors based on the access code provided.
 */
export class MockDocumentProvider implements DocumentProvider {
  private readonly documents: Map<string, PublicDocument>;

  constructor() {
    this.documents = new Map();
    this.initializeMockData();
  }

  /**
   * Initialize the mock data with sample documents
   */
  private initializeMockData(): void {
    // Sample document 1
    this.documents.set('valid123', {
      id: 'doc-001',
      title: 'Sample Document 1',
      content:
        'This is the content of the first sample document. It contains important information that was shared with you.',
      createdAt: '2023-10-01T10:30:00.000Z',
      meta: {
        author: 'John Doe',
        category: 'report',
        version: 1,
      },
    });

    // Sample document 2
    this.documents.set('test456', {
      id: 'doc-002',
      title: 'Test Document',
      content:
        'This is a test document used for validation purposes. It demonstrates the document sharing functionality.',
      createdAt: '2023-10-15T14:20:00.000Z',
      meta: {
        author: 'Jane Smith',
        category: 'test',
        confidential: true,
      },
    });

    // Document with meta data
    this.documents.set('withmeta789', {
      id: 'doc-003',
      title: 'Document with Rich Metadata',
      content:
        'This document showcases various metadata types including strings, numbers, and booleans.',
      createdAt: '2023-11-01T09:15:00.000Z',
      meta: {
        department: 'Engineering',
        priority: 5,
        reviewed: false,
        tags: 'important,review-needed',
        size: 1024,
        version: 2.1,
      },
    });

    // Document without meta
    this.documents.set('nometa456', {
      id: 'doc-004',
      title: 'Simple Document',
      content: 'This is a simple document without any metadata attached.',
      createdAt: '2023-11-07T16:45:00.000Z',
    });

    // Special code for longer documents
    this.documents.set('special-code_123', {
      id: 'doc-005',
      title: 'Special Characters Test Document',
      content:
        'This document tests handling of special characters in access codes and demonstrates that the system can handle various code formats.',
      createdAt: '2023-11-05T11:30:00.000Z',
      meta: {
        specialCharacters: true,
        codeType: 'extended',
      },
    });
  }

  /**
   * Retrieves a document by access code with simulated network delay
   */
  async getByCode(code: string): Promise<PublicDocument> {
    // Simulate network delay
    await this.simulateDelay();

    // Check for special error simulation codes first (before validation)
    this.checkForErrorSimulation(code);

    // Validate input format
    if (!this.isValidCode(code)) {
      throw ApiErrorException.fromApiError(
        ApiErrors.invalid(`Invalid access code format: ${code}`),
      );
    }

    // Try to find the document
    const document = this.documents.get(code);
    if (!document) {
      throw ApiErrorException.fromApiError(
        ApiErrors.notFound(`Document not found for access code: ${code}`),
      );
    }

    // Return a copy to prevent external modification
    return { ...document };
  }

  /**
   * Validates the access code format
   */
  private isValidCode(code: string): boolean {
    // Empty or whitespace-only codes are invalid
    if (!code || code.trim().length === 0) {
      return false;
    }

    // Codes that are too short
    if (code.trim().length < 3) {
      return false;
    }

    // Codes with certain invalid characters
    if (code.includes('@') || code.includes('#')) {
      return false;
    }

    return true;
  }

  /**
   * Checks for special codes that should trigger error simulations
   */
  private checkForErrorSimulation(code: string): void {
    switch (code.toLowerCase()) {
      case 'expired':
        throw ApiErrorException.fromApiError(
          ApiErrors.expired('This access code has expired and is no longer valid'),
        );

      case 'unavailable':
        throw ApiErrorException.fromApiError(
          ApiErrors.unavailable(
            'Document service is temporarily unavailable. Please try again later',
          ),
        );

      case 'unknown-error':
        throw ApiErrorException.fromApiError(
          ApiErrors.unknown('An unexpected error occurred while retrieving the document'),
        );
    }
  }

  /**
   * Simulates network delay for realistic async behavior
   */
  private async simulateDelay(): Promise<void> {
    const delayMs = Math.random() * 100 + 50; // 50-150ms delay
    return new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  /**
   * Utility method to add new mock documents (useful for testing)
   */
  public addMockDocument(code: string, document: PublicDocument): void {
    this.documents.set(code, { ...document });
  }

  /**
   * Utility method to remove mock documents (useful for testing)
   */
  public removeMockDocument(code: string): boolean {
    return this.documents.delete(code);
  }

  /**
   * Utility method to clear all mock documents (useful for testing)
   */
  public clearMockDocuments(): void {
    this.documents.clear();
  }

  /**
   * Utility method to get all available codes (useful for debugging)
   */
  public getAvailableCodes(): string[] {
    return Array.from(this.documents.keys());
  }
}
