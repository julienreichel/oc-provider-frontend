/**
 * Cypress component test getter utilities for AccessPage
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
 * AccessPage component getters
 * Uses aria-label selectors for accessibility-first testing approach
 */
export const AccessPageGetters = {
  /**
   * Main page container
   */
  getPage: () => getByAriaLabel('Document access page'),

  /**
   * Page title/heading
   */
  getTitle: () => getByAriaLabel('Enter access code'),

  /**
   * Access code form
   */
  getForm: () => getByAriaLabel('Document access form'),

  /**
   * Submit button for access code
   */
  getSubmitButton: () => getByAriaLabel('Submit access code'),
} as const;

/**
 * Type definitions for getter return values
 */
export type AccessPageElements = {
  [K in keyof typeof AccessPageGetters]: ReturnType<(typeof AccessPageGetters)[K]>;
};
