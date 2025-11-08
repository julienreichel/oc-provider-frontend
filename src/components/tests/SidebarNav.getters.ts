/**
 * Cypress getter utilities for SidebarNav
 * Uses aria-label selectors to mirror screen reader behavior.
 * Note: q-item with :to renders as router-link, so we target the focusable elements.
 */
/// <reference types="cypress" />

const getByAriaLabel = (label: string): Cypress.Chainable<JQuery<HTMLElement>> =>
  cy.get(`[aria-label="${label}"]`);

export const SidebarNavGetters = {
  // Navigation links - q-items are now focusable with tabindex="0"
  getDashboardLink: () => getByAriaLabel('Go to dashboard'),
  getSettingsLink: () => getByAriaLabel('Go to settings'),

  // Helper to get any nav link by visible text (fallback)
  getNavLinkByText: (text: string) => cy.contains('[aria-label]', text),
} as const;
export type SidebarNavElements = {
  [K in keyof typeof SidebarNavGetters]: ReturnType<(typeof SidebarNavGetters)[K]>;
};
