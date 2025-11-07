// Export provider interfaces and implementations
export type { DocumentProvider } from './DocumentProvider';
export { MockDocumentProvider } from './MockDocumentProvider';
export {
  documentProvider,
  configureProvider,
  getCurrentProvider,
  isMockProvider,
  type ProviderConfig,
} from './ProviderRegistry';
