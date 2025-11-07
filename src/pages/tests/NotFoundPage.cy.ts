import NotFoundPage from '../NotFoundPage.vue';

describe('NotFoundPage', () => {
  it('renders accessible message and action', () => {
    cy.mount(NotFoundPage);

    cy.get('main[role="main"]').should('exist');
    cy.contains('Page not found').should('exist');
    cy.dataCy('not-found-home').should('exist');
  });
});
