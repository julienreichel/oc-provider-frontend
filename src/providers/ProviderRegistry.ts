import type { DocumentProvider } from './DocumentProvider';
import { MockDocumentProvider } from './MockDocumentProvider';
import { HttpDocumentProvider } from './HttpDocumentProvider';

/**
 * Registry for document providers
 *
 * This module provides a central place to manage the active document provider.
 * Provider selection logic:
 * - MockProvider: localhost with port numbers (e.g., localhost:9000, localhost:3000)
 * - HttpProvider: production domains and custom local domains (e.g., client.localhost)
 * - Override: VUE_APP_USE_MOCK_PROVIDER=true/false to force specific provider
 */

/**
 * Determines if the current environment should use mock provider
 * Based on hostname and explicit configuration
 */
const shouldUseMockProvider = (): boolean => {
  // Explicit override via environment variable
  if (process.env?.VUE_APP_USE_MOCK_PROVIDER === 'true') {
    return true;
  }

  // Force HTTP provider via environment variable
  if (process.env?.VUE_APP_USE_MOCK_PROVIDER === 'false') {
    return false;
  }

  // In browser environment, check hostname
  if (typeof window !== 'undefined' && window.location) {
    const { hostname, port } = window.location;

    // Use mock for localhost with port numbers (e.g., localhost:9000, localhost:3000)
    // But allow HTTP for custom local domains (e.g., client.localhost)
    if (hostname === 'localhost' && port) {
      return true;
    }
  }

  // Default to HTTP provider for all other cases
  return false;
};

// Initialize the active provider based on environment
const getDefaultProvider = (): DocumentProvider => {
  if (shouldUseMockProvider()) {
    return configureProvider({ mode: 'development' });
  }

  // Default to HTTP provider with same-origin /api path
  const baseUrl = process.env.VUE_APP_API_BASE_URL ?? '/api';

  return configureProvider({
    mode: 'production',
    baseUrl,
  });
};

const activeProvider = getDefaultProvider();

/**
 * The currently active document provider instance
 *
 * Use this throughout the application to retrieve documents.
 * The implementation can be swapped without changing consumer code.
 */
export const documentProvider: DocumentProvider = activeProvider;

/**
 * Configuration options for the provider registry
 */
export interface ProviderConfig {
  /** Environment mode - determines which provider to use */
  mode: 'development' | 'production' | 'test';
  /** Base URL for HTTP providers (required for production mode) */
  baseUrl?: string;
  /** Optional timeout in milliseconds for provider operations */
  timeout?: number;
  /** Optional headers for HTTP providers */
  headers?: Record<string, string>;
}

/**
 * Sets up the document provider based on configuration
 */
export function configureProvider(config: ProviderConfig): DocumentProvider {
  switch (config.mode) {
    case 'development':
    case 'test':
      return new MockDocumentProvider();

    case 'production': {
      if (!config.baseUrl) {
        throw new Error('baseUrl is required for production mode with HTTP provider');
      }
      const httpConfig: { baseUrl: string; timeout?: number; headers?: Record<string, string> } = {
        baseUrl: config.baseUrl,
      };
      if (config.timeout !== undefined) {
        httpConfig.timeout = config.timeout;
      }
      if (config.headers !== undefined) {
        httpConfig.headers = config.headers;
      }
      return new HttpDocumentProvider(httpConfig);
    }

    default:
      return new MockDocumentProvider();
  }
}

/**
 * Gets the current provider configuration
 * Useful for debugging and testing
 */
export function getCurrentProvider(): DocumentProvider {
  return documentProvider;
}

/**
 * Type guard to check if a provider is the mock implementation
 * Useful for testing and conditional logic
 */
export function isMockProvider(provider: DocumentProvider): provider is MockDocumentProvider {
  return provider instanceof MockDocumentProvider;
}

/**
 * Type guard to check if a provider is the HTTP implementation
 * Useful for testing and conditional logic
 */
export function isHttpProvider(provider: DocumentProvider): provider is HttpDocumentProvider {
  return provider instanceof HttpDocumentProvider;
}
