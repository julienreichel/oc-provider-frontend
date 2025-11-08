/**
 * Accessibility-first Cypress selectors for DocumentSendPage
 * Following the accessibility-first testing guide
 */

export const getByAriaLabel = (label: string): string => `[aria-label="${label}"]`;

export const documentSendPageGetters = {
  // Page structure getters
  getDocumentSendPage: (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get('section.document-send-page'),
  getDocumentSendHeading: (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get('#document-send-heading'),

  // Send result getters
  getSendResultPanel: (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get('[aria-label="Send result panel"]'),
  getSendResultAccessCode: (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get('[aria-label="Document access code input"]'),
  getCopyAccessCodeButton: (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get('[aria-label="Copy access code"]'),

  // Error state getters
  getSendErrorState: (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get('[aria-label="Send error state"]'),
  getRetryButton: (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get('[aria-label="Retry action"]'),

  // Navigation getters
  getBackToDashboardButton: (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get('[aria-label="Back to dashboard"]'),

  // Legacy selectors (for backward compatibility if needed)
  sendResultCode: () => getByAriaLabel('Document access code input'),
  sendResultPanel: () => getByAriaLabel('Send result panel'),
  copyButton: () => getByAriaLabel('Copy access code'),
} as const;

export type DocumentSendPageGetters = typeof documentSendPageGetters;
