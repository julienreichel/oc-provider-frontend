/**
 * Cypress getter utilities for MainLayout
 * Uses aria-label selectors to mirror screen reader behavior.
 */
/// <reference types="cypress" />

const getByAriaLabel = (label: string): Cypress.Chainable<JQuery<HTMLElement>> =>
  cy.get(`[aria-label="${label}"]`);

export const MainLayoutGetters = {
  // Skip link for keyboard navigation
  getSkipLink: () => getByAriaLabel('Skip to workspace content'),

  // Main layout container
  getMainLayout: () => getByAriaLabel('Provider workspace layout'),

  // Header and navigation
  getHeaderBar: () => getByAriaLabel('Header toolbar'),
  getNavigation: () => getByAriaLabel('Workspace navigation'),

  // Content areas
  getPageContainer: () => getByAriaLabel('Main content area'),
  getMainContent: () => getByAriaLabel('Main workspace content'),

  // Interactive elements
  getToggleButton: () => getByAriaLabel('Toggle navigation menu'),
} as const;

export type MainLayoutElements = {
  [K in keyof typeof MainLayoutGetters]: ReturnType<(typeof MainLayoutGetters)[K]>;
};
