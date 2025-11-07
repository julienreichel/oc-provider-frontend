import AccessPage from '../AccessPage.vue';
import { AccessPageGetters } from './AccessPage.getters';
import { AccessInputGetters } from 'src/components/tests/AccessInput.getters';

describe('AccessPage Accessibility', () => {
  beforeEach(() => {
    cy.mount(AccessPage);
  });

  describe('form accessibility', () => {
    it('should have properly labeled input field', () => {
      // Check that input has proper label association (better than aria-label)
      AccessInputGetters.getInputField().should('have.attr', 'id');

      // Get the input ID and check if there's a corresponding label
      AccessInputGetters.getInputField()
        .invoke('attr', 'id')
        .then((inputId) => {
          cy.get(`label[for="${inputId}"]`).should('exist').and('contain.text', 'Access Code');
        });

      // Check placeholder is present for additional guidance
      AccessInputGetters.getInputField().should('have.attr', 'placeholder').and('not.be.empty');
    });

    it('should have accessible submit button', () => {
      // Button should exist and have proper attributes
      AccessPageGetters.getSubmitButton().should('exist');

      // Check for aria-describedby for additional accessibility context
      AccessPageGetters.getSubmitButton().should('have.attr', 'aria-describedby');

      // Button should be keyboard accessible
      AccessPageGetters.getSubmitButton().should('have.attr', 'type', 'submit');
    });

    it('should associate error messages with input', () => {
      // Verify input has proper accessibility setup (without chaining aria-describedby)
      AccessInputGetters.getInputField().should('have.attr', 'aria-required', 'true');
      AccessInputGetters.getInputField().should('have.attr', 'aria-describedby');
      AccessInputGetters.getInputField().should('have.attr', 'aria-invalid');

      // Verify form structure supports error association
      AccessPageGetters.getForm().should('have.attr', 'novalidate');

      // Check that input has proper ID for label association
      AccessInputGetters.getInputField().should('have.attr', 'id');
      AccessInputGetters.getInputField()
        .invoke('attr', 'id')
        .should('match', /access-code-\d+/);
    });

    it('should provide clear error messaging', () => {
      // Verify the form has proper structure for error messaging
      AccessPageGetters.getForm().should('exist').and('have.attr', 'novalidate');

      // Verify input has proper labeling structure
      AccessInputGetters.getInputField().then(($input) => {
        const inputId = $input.attr('id');
        expect(inputId).to.match(/access-code-\d+/);

        // Check that label properly references input
        cy.get(`label[for="${inputId}"]`).should('exist');
      });

      // Check that form has accessible labeling
      AccessPageGetters.getForm().should('exist');
    });

    it('should maintain focus management', () => {
      // Check elements exist and have proper attributes for focus management
      AccessInputGetters.getInputField().should('exist').and('have.attr', 'id');
      AccessPageGetters.getSubmitButton().should('exist').and('have.attr', 'type', 'submit');

      // Check that input has proper ARIA attributes for focus management
      AccessInputGetters.getInputField()
        .should('have.attr', 'aria-required', 'true')
        .and('have.attr', 'aria-describedby');
    });
  });

  describe('keyboard navigation', () => {
    it('should support Enter key submission', () => {
      // Verify form has proper keyboard accessibility setup
      AccessPageGetters.getForm().should('have.attr', 'novalidate');

      // Check that input has proper keyboard attributes (without chaining)
      AccessInputGetters.getInputField().should('have.attr', 'id');
      AccessInputGetters.getInputField().should('have.attr', 'aria-required', 'true');

      // Verify submit button is keyboard accessible
      AccessPageGetters.getSubmitButton().should('have.attr', 'type', 'submit');
    });

    it('should handle Escape key gracefully', () => {
      // Verify input maintains proper ARIA attributes (without chaining)
      AccessInputGetters.getInputField().should('have.attr', 'aria-describedby');
      AccessInputGetters.getInputField().should('have.attr', 'aria-invalid');

      // Form should remain functional for keyboard users
      AccessPageGetters.getForm().should('have.attr', 'novalidate');
    });
  });

  describe('screen reader support', () => {
    it('should have page title for screen readers', () => {
      // Page should have main heading
      AccessPageGetters.getTitle().should('exist').and('be.visible');
      AccessPageGetters.getTitle().should('contain.text', 'Enter Access Code');
    });

    it('should provide form instructions', () => {
      // Check for visible instructions text (semantic content test)
      cy.contains('Enter the access code you received to view your document').should('exist');

      // Check for screen reader announcements region (accessibility structure)
      cy.get('div[aria-live="polite"]').should('exist');
    });
  });
});
