import { describe, it, expect } from 'vitest';
import { i18n } from './index';

describe('i18n configuration', () => {
  it('should create i18n instance', () => {
    expect(i18n).toBeDefined();
    expect(i18n.global).toBeDefined();
  });

  it('should have correct locale configuration', () => {
    expect(i18n.global.locale).toBe('en-US');
    expect(i18n.global.fallbackLocale).toBe('en-US');
  });

  it('should resolve app.title translation key', () => {
    const translation = i18n.global.t('app.title');
    expect(translation).toBe('Document Viewer');
  });

  it('should resolve layout.title translation key', () => {
    const translation = i18n.global.t('layout.title');
    expect(translation).toBe('Client Portal');
  });

  it('should resolve access.title translation key', () => {
    const translation = i18n.global.t('access.title');
    expect(translation).toBe('Enter Access Code');
  });

  it('should resolve document.loading translation key', () => {
    const translation = i18n.global.t('document.loading');
    expect(translation).toBe('Loading your document');
  });

  it('should resolve document.backToHome translation key', () => {
    const translation = i18n.global.t('document.backToHome');
    expect(translation).toBe('Enter New Code');
  });

  it('should handle fallback for missing keys', () => {
    const translation = i18n.global.t('nonexistent.key');
    expect(translation).toBe('nonexistent.key');
  });

  it('should have English messages loaded', () => {
    const messages = i18n.global.messages;
    expect(messages['en-US']).toBeDefined();
    expect(messages['en-US'].app).toBeDefined();
    expect(messages['en-US'].layout).toBeDefined();
  });
});
