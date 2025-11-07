/**
 * Cypress component test getter utilities for AccessInput
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
 * AccessInput component getters
 * Uses aria-label selectors for accessibility-first testing approach
 */
export const AccessInputGetters = {
  /**
   * Main input field for access code
   */
  getInputField: () => getByAriaLabel('Access code input'),

  /**
   * Error message display
   */
  getErrorMessage: () => getByAriaLabel('Access code error'),

  /**
   * Input label element
   */
  getLabel: () => getByAriaLabel('Access code label'),
} as const;

/**
 * Type definitions for getter return values
 */
export type AccessInputElements = {
  [K in keyof typeof AccessInputGetters]: ReturnType<(typeof AccessInputGetters)[K]>;
};
