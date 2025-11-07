/**
 * Cypress component test getter utilities for LoadingState
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
 * LoadingState component getters
 * Uses aria-label selectors for accessibility-first testing approach
 */
export const LoadingStateGetters = {
  /**
   * Main loading container
   */
  getContainer: () => getByAriaLabel('Loading State'),

  /**
   * Loading message text
   */
  getMessage: () => getByAriaLabel('Loading Message'),
} as const;

/**
 * Type definitions for getter return values
 */
export type LoadingStateElements = {
  [K in keyof typeof LoadingStateGetters]: ReturnType<(typeof LoadingStateGetters)[K]>;
};
