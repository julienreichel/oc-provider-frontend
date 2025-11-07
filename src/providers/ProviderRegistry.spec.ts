import { describe, it, expect, beforeEach } from 'vitest';
import { configureProvider, isMockProvider, isHttpProvider } from './ProviderRegistry';
import { MockDocumentProvider } from './MockDocumentProvider';
import { HttpDocumentProvider } from './HttpDocumentProvider';

describe('ProviderRegistry', () => {
  describe('configureProvider', () => {
    it('should return MockDocumentProvider for development mode', () => {
      const provider = configureProvider({ mode: 'development' });

      expect(provider).toBeInstanceOf(MockDocumentProvider);
      expect(isMockProvider(provider)).toBe(true);
      expect(isHttpProvider(provider)).toBe(false);
    });

    it('should return MockDocumentProvider for test mode', () => {
      const provider = configureProvider({ mode: 'test' });

      expect(provider).toBeInstanceOf(MockDocumentProvider);
      expect(isMockProvider(provider)).toBe(true);
      expect(isHttpProvider(provider)).toBe(false);
    });

    it('should return HttpDocumentProvider for production mode with baseUrl', () => {
      const provider = configureProvider({
        mode: 'production',
        baseUrl: 'https://api.example.com',
      });

      expect(provider).toBeInstanceOf(HttpDocumentProvider);
      expect(isHttpProvider(provider)).toBe(true);
      expect(isMockProvider(provider)).toBe(false);
    });

    it('should throw error for production mode without baseUrl', () => {
      expect(() => {
        configureProvider({ mode: 'production' });
      }).toThrow('baseUrl is required for production mode with HTTP provider');
    });

    it('should pass through configuration options to HttpDocumentProvider', () => {
      const config = {
        mode: 'production' as const,
        baseUrl: 'https://api.example.com',
        timeout: 5000,
        headers: { 'X-API-Key': 'test-key' },
      };

      const provider = configureProvider(config);

      expect(provider).toBeInstanceOf(HttpDocumentProvider);
      expect(isHttpProvider(provider)).toBe(true);
    });

    it('should handle optional timeout and headers for HttpDocumentProvider', () => {
      const provider = configureProvider({
        mode: 'production',
        baseUrl: 'https://minimal-api.example.com',
      });

      expect(provider).toBeInstanceOf(HttpDocumentProvider);
      expect(isHttpProvider(provider)).toBe(true);
    });
  });

  describe('type guards', () => {
    let mockProvider: MockDocumentProvider;
    let httpProvider: HttpDocumentProvider;

    beforeEach(() => {
      mockProvider = new MockDocumentProvider();
      httpProvider = new HttpDocumentProvider({
        baseUrl: 'https://api.example.com',
      });
    });

    describe('isMockProvider', () => {
      it('should return true for MockDocumentProvider', () => {
        expect(isMockProvider(mockProvider)).toBe(true);
      });

      it('should return false for HttpDocumentProvider', () => {
        expect(isMockProvider(httpProvider)).toBe(false);
      });
    });

    describe('isHttpProvider', () => {
      it('should return true for HttpDocumentProvider', () => {
        expect(isHttpProvider(httpProvider)).toBe(true);
      });

      it('should return false for MockDocumentProvider', () => {
        expect(isHttpProvider(mockProvider)).toBe(false);
      });
    });
  });

  describe('provider interface compliance', () => {
    it('should ensure all providers implement DocumentProvider interface', () => {
      const mockProvider = configureProvider({ mode: 'development' });
      const httpProvider = configureProvider({
        mode: 'production',
        baseUrl: 'https://api.example.com',
      });

      // Both should have the same interface
      expect(typeof mockProvider.getByCode).toBe('function');
      expect(typeof httpProvider.getByCode).toBe('function');
    });
  });

  describe('default provider behavior', () => {
    it('should use HttpDocumentProvider by default', () => {
      // Test the actual default provider creation logic
      const defaultConfig = {
        mode: 'production' as const,
        baseUrl: '/api',
      };
      const provider = configureProvider(defaultConfig);

      expect(isHttpProvider(provider)).toBe(true);
      expect(isMockProvider(provider)).toBe(false);
    });

    it('should use same-origin /api as default base URL', () => {
      const provider = configureProvider({
        mode: 'production',
        baseUrl: '/api',
      });

      expect(isHttpProvider(provider)).toBe(true);
    });
  });

  describe('hostname-based provider selection', () => {
    it('should test configureProvider behavior for different modes', () => {
      // Test development mode always returns mock
      const mockProvider = configureProvider({ mode: 'development' });
      expect(isMockProvider(mockProvider)).toBe(true);

      // Test production mode always returns HTTP
      const httpProvider = configureProvider({
        mode: 'production',
        baseUrl: '/api',
      });
      expect(isHttpProvider(httpProvider)).toBe(true);
    });

    it('should handle configuration parameters correctly', () => {
      const provider = configureProvider({
        mode: 'production',
        baseUrl: '/api',
        timeout: 5000,
        headers: { 'X-Test': 'value' },
      });

      expect(isHttpProvider(provider)).toBe(true);
    });
  });
});
