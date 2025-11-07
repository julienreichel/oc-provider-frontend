/**
 * Cypress component test getter utilities for ErrorState
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
 * ErrorState component getters
 * Uses aria-label selectors for accessibility-first testing approach
 */
export const ErrorStateGetters = {
  /**
   * Main error container
   */
  getContainer: () => getByAriaLabel('Error State'),

  /**
   * Error message text
   */
  getMessage: () => getByAriaLabel('Error Message'),

  /**
   * Retry/action button
   */
  getRetryButton: () => getByAriaLabel('Try Again'),
} as const;

/**
 * Type definitions for getter return values
 */
export type ErrorStateElements = {
  [K in keyof typeof ErrorStateGetters]: ReturnType<(typeof ErrorStateGetters)[K]>;
};
