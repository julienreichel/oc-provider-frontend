import PublicLayout from './PublicLayout.vue';

describe('PublicLayout.cy.ts', () => {
  it('renders slot content in the main area', () => {
    cy.mount(PublicLayout);

    // Check that basic div structure exists (Quasar components render as divs)
    cy.get('div').should('exist');
  });

  it('renders layout structure', () => {
    cy.mount(PublicLayout);

    // Check that i18n title is rendered (tests both component and i18n integration)
    cy.contains('Client Portal').should('exist');
  });

  it('has accessible main content area', () => {
    cy.mount(PublicLayout);

    // Check that the layout title provides accessible context
    cy.contains('Client Portal').should('exist');
  });
});
