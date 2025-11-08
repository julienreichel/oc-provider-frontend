import { describe, it, expect } from 'vitest';
import { i18n } from './index';

describe('i18n configuration', () => {
  it('creates an English locale with fallback', () => {
    expect(i18n.global.locale).toBe('en-US');
    expect(i18n.global.fallbackLocale).toBe('en-US');
  });

  it('exposes workspace specific translation keys', () => {
    expect(i18n.global.t('app.title')).toBe('Provider Workspace');
    expect(i18n.global.t('layout.workspaceTitle')).toBe('Provider Workspace');
    expect(i18n.global.t('dashboard.title')).toBe('Dashboard');
    expect(i18n.global.t('documentEdit.title')).toBe('Edit document');
    expect(i18n.global.t('documents.filterLabel')).toBe('Filter documents');
    expect(i18n.global.t('settings.title')).toBe('Workspace settings');
  });

  it('falls back on missing keys', () => {
    expect(i18n.global.t('unknown.key')).toBe('unknown.key');
  });
});
