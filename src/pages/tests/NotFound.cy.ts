import NotFound from '../NotFound.vue';

describe('NotFound.cy.ts', () => {
  it('renders basic structure', () => {
    cy.mount(NotFound);

    // Check that basic structure exists (without relying on Quasar classes)
    cy.get('div').should('exist');
    cy.get('main[role="main"]').should('exist');
    cy.get('h1').should('exist');
  });

  it('has accessible structure with proper headings', () => {
    cy.mount(NotFound);

    // Check accessibility features that work in component testing
    cy.get('main[role="main"]').should('exist');
    cy.get('h1').should('be.visible');
  });

  it('contains home navigation element', () => {
    cy.mount(NotFound);

    // Check that the home button element exists
    cy.dataCy('home-link').should('exist');
  });
});
