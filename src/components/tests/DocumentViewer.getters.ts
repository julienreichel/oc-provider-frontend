/**
 * Cypress component test getter utilities for DocumentViewer
 *
 * Provides semantic, accessibility-first element getters using aria-label selectors.
 * Follows minimal abstraction pattern with only getters for elements that exist.
 *
 * @see https://docs.cypress.io/guides/component-testing/introduction
 * @see https://testing-library.com/docs/queries/byrole/
 */

/// <reference types="cypress" />

// Base utility for aria-label based selection
const getByAriaLabel = (label: string): Cypress.Chainable<JQuery<HTMLElement>> =>
  cy.get(`[aria-label="${label}"]`);

/**
 * DocumentViewer component getters
 * Uses aria-label selectors for accessibility-first testing approach
 */
export const DocumentViewerGetters = {
  /**
   * Document title display
   */
  getTitle: () => getByAriaLabel('Document title'),

  /**
   * Document metadata (creation date, etc.)
   */
  getMetadata: () => getByAriaLabel('Document metadata'),

  /**
   * Document content area
   */
  getContent: () => getByAriaLabel('Document content'),
} as const;

/**
 * Type definitions for getter return values
 */
export type DocumentViewerElements = {
  [K in keyof typeof DocumentViewerGetters]: ReturnType<(typeof DocumentViewerGetters)[K]>;
};
