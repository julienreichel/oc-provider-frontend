/**
 * Cypress component test getter utilities for DocumentViewPage
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
 * DocumentViewPage component getters
 * Uses aria-label selectors for accessibility-first testing approach
 */
export const DocumentViewPageGetters = {
  /**
   * Main page container
   */
  getPage: () => getByAriaLabel('Document view page'),

  /**
   * Skip to main content link
   */
  getSkipToMainContent: () => getByAriaLabel('Skip to main content'),

  /**
   * Document title display
   */
  getDocumentTitle: () => getByAriaLabel('Document title'),

  /**
   * Document metadata information
   */
  getDocumentMetadata: () => getByAriaLabel('Document metadata'),

  /**
   * Document content area
   */
  getDocumentContent: () => getByAriaLabel('Document content'),

  /**
   * Empty document state display
   */
  getEmptyDocumentState: () => getByAriaLabel('Empty document state'),

  /**
   * Error message text
   */
  getErrorMessage: () => getByAriaLabel('Error message'),

  /**
   * Retry/try again button
   */
  getTryAgainButton: () => getByAriaLabel('Try Again'),

  /**
   * Loading message text
   */
  getLoadingMessage: () => getByAriaLabel('Loading message'),

  /**
   * Loading spinner indicator
   */
  getLoadingSpinner: () => getByAriaLabel('Loading spinner'),

  /**
   * Enter new code button (navigation)
   */
  getEnterNewCodeButton: () => getByAriaLabel('Enter New Code'),

  /**
   * Back to home button (alias for enter new code button)
   */
  getBackToHomeButton: () => getByAriaLabel('Enter New Code'),
} as const;

/**
 * Type definitions for getter return values
 */
export type DocumentViewPageElements = {
  [K in keyof typeof DocumentViewPageGetters]: ReturnType<(typeof DocumentViewPageGetters)[K]>;
};
