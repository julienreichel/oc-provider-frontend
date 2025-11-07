import AccessInput from '../AccessInput.vue';
import { AccessInputGetters } from './AccessInput.getters';

describe('AccessInput', () => {
  it('renders label and placeholder correctly', () => {
    const props = {
      modelValue: '',
      label: 'Access Code',
      placeholder: 'Enter your access code',
      showError: false,
      errorMessage: '',
    };

    cy.mount(AccessInput, { props });

    // Check label is rendered
    AccessInputGetters.getLabel().should('contain.text', 'Access Code');

    // Check input has correct placeholder
    AccessInputGetters.getInputField().should('have.attr', 'placeholder', 'Enter your access code');
  });

  it('shows validation error when showError is true', () => {
    const props = {
      modelValue: '',
      label: 'Access Code',
      placeholder: 'Enter your access code',
      showError: true,
      errorMessage: 'Access code is required',
    };

    cy.mount(AccessInput, { props });

    // Check error message is displayed
    AccessInputGetters.getErrorMessage().should('be.visible');
    AccessInputGetters.getErrorMessage().should('contain.text', 'Access code is required');
  });

  it('hides validation error when showError is false', () => {
    const props = {
      modelValue: 'test',
      label: 'Access Code',
      placeholder: 'Enter your access code',
      showError: false,
      errorMessage: '',
    };

    cy.mount(AccessInput, { props });

    // Check error message is not displayed
    AccessInputGetters.getErrorMessage().should('not.exist');
  });

  it('renders with correct model value attribute', () => {
    const props = {
      modelValue: 'TEST123',
      label: 'Access Code',
      placeholder: 'Enter your access code',
      showError: false,
      errorMessage: '',
    };

    cy.mount(AccessInput, { props });

    // Verify the component has the model-value attribute set
    AccessInputGetters.getInputField().should('have.attr', 'model-value', 'TEST123');
  });
});
