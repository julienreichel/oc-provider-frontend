/**
 * Accessibility-first Cypress selectors for DocumentEditPage
 * Following the accessibility-first testing guide
 */

export const getByAriaLabel = (label: string): string => `[aria-label="${label}"]`;

export const documentEditPageGetters = {
  // Form input getters
  getDocumentTitleInput: (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get(getByAriaLabel('Document title input')),
  getDocumentContentInput: (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get(getByAriaLabel('Document content input')),
  getDocumentStatusSelect: (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get(getByAriaLabel('Document status select')),

  // Action button getters
  getDocumentSaveButton: (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get(getByAriaLabel('Save document')),
  getDocumentCloseButton: (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get(getByAriaLabel('Close document editor')),

  // Page structure getters
  getDocumentEditPage: (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get('section.document-edit-page'),
  getDocumentEditHeading: (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get('#document-edit-heading'),

  // Error state getters
  getDocumentErrorState: (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get(getByAriaLabel('Document error state')),

  // Legacy selectors (for backward compatibility if needed)
  documentTitleInput: () => getByAriaLabel('Document title input'),
  documentContentInput: () => getByAriaLabel('Document content input'),
  documentStatusSelect: () => getByAriaLabel('Document status select'),
  documentSaveButton: () => getByAriaLabel('Save document'),
  documentCloseButton: () => getByAriaLabel('Close document editor'),
} as const;

export type DocumentEditPageGetters = typeof documentEditPageGetters;
