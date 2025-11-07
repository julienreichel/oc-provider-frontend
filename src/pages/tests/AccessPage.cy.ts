import AccessPage from '../AccessPage.vue';
import { AccessPageGetters } from './AccessPage.getters';

describe('AccessPage', () => {
  it('renders form elements', () => {
    cy.mount(AccessPage);

    // Check form is present
    AccessPageGetters.getForm().should('exist');

    // Check submit button is present
    AccessPageGetters.getSubmitButton().should('exist');
  });

  it('renders submit button', () => {
    cy.mount(AccessPage);

    // Check submit button exists (visibility might be affected by Quasar styles in test env)
    AccessPageGetters.getSubmitButton().should('exist');
  });
});
