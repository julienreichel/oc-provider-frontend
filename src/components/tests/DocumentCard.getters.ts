/**
 * Accessibility-first Cypress selectors for DocumentCard
 * Following the accessibility-first testing guide
 */

export const getByAriaLabel = (label: string): string => `[aria-label="${label}"]`;

export const documentCardGetters = {
  // Main card structure - getter functions
  getDocumentCard: (title: string): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get(getByAriaLabel(title)),
  getDocumentCardByRole: (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get('[role="article"]'),

  // Status indicator - getter function
  getDocumentStatus: (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get('[aria-label*="Document status"]'),

  // Navigation link - getter function
  getDocumentLink: (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get('a.document-card__link'),

  // Legacy selectors (for backward compatibility if needed)
  documentCard: (title: string) => getByAriaLabel(title),
  documentCardByRole: () => '[role="article"]',
  documentStatus: () => '[aria-label*="Document status"]',
  documentLink: () => 'a.document-card__link',
} as const;

export type DocumentCardGetters = typeof documentCardGetters;
