/**
 * Accessibility-first Cypress selectors for DashboardPage
 * Following the accessibility-first testing guide
 */

export const getByAriaLabel = (label: string): string => `[aria-label="${label}"]`;

// Helper functions for common Cypress selections
export const getBody = (): Cypress.Chainable<JQuery<HTMLBodyElement>> => cy.get('body');
export const getFirstInput = (): Cypress.Chainable<JQuery<HTMLInputElement>> =>
  cy.get('input').first();

export const dashboardPageGetters = {
  // Main page structure
  dashboardSection: () => 'section.dashboard-page',
  dashboardHeading: () => '#dashboard-heading',

  // Filter functionality
  documentFilter: () => getByAriaLabel('Filter documents'),

  // Document list and cards
  documentList: () => getByAriaLabel('Documents list'),
  documentCards: () => '[role="article"]',

  // Load more functionality
  loadMoreButton: () => getByAriaLabel('Load more documents'),

  // States
  loadingState: () => getByAriaLabel('Loading indicator'),
  emptyState: () => getByAriaLabel('Empty state message'),
  errorState: () => getByAriaLabel('Error message'),
  retryButton: () => getByAriaLabel('Retry loading'),
} as const;

export type DashboardPageGetters = typeof dashboardPageGetters;
