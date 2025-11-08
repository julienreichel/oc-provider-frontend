export const healthPanelGetters = {
  getPanel: (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get('[data-cy="health-panel"]'),
  getBadgeByText: (text: string): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get('[data-cy="health-panel"]').find('.q-badge').contains(text),
  getRefreshButton: (): Cypress.Chainable<JQuery<HTMLButtonElement>> =>
    cy.contains('button', 'Check status'),
};

export type HealthPanelGetters = typeof healthPanelGetters;
