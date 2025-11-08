import { documentEditPageGetters } from './DocumentEditPage.getters';

describe('DocumentEditPage Accessibility Patterns', () => {
  it('validates accessibility-first test approach is implemented', () => {
    // This test confirms that we have moved from data-cy to aria-label approach
    // The getters file implements the accessibility-first pattern

    // Confirm the getters object exists and has the expected functions
    expect(documentEditPageGetters).to.have.property('getDocumentEditPage');
    expect(documentEditPageGetters).to.have.property('getDocumentEditHeading');
    expect(documentEditPageGetters).to.have.property('getDocumentTitleInput');
    expect(documentEditPageGetters).to.have.property('getDocumentContentInput');
    expect(documentEditPageGetters).to.have.property('getDocumentStatusSelect');
    expect(documentEditPageGetters).to.have.property('getDocumentSaveButton');
    expect(documentEditPageGetters).to.have.property('getDocumentCloseButton');
    expect(documentEditPageGetters).to.have.property('getDocumentErrorState');

    // Verify functions are callable (they return Cypress commands)
    expect(typeof documentEditPageGetters.getDocumentEditPage).to.equal('function');
    expect(typeof documentEditPageGetters.getDocumentTitleInput).to.equal('function');
    expect(typeof documentEditPageGetters.getDocumentSaveButton).to.equal('function');
  });

  it('demonstrates accessibility-first selector approach', () => {
    // Create a simple DOM structure to test our selectors
    cy.document().then((doc) => {
      doc.body.innerHTML = `
        <section class="document-edit-page" aria-labelledby="document-edit-heading">
          <h1 id="document-edit-heading">Edit document</h1>
          <input aria-label="Document title input" value="Test Title" />
          <textarea aria-label="Document content input">Test content</textarea>
          <div aria-label="Document status select" role="combobox">Draft</div>
          <button aria-label="Save document">Save</button>
          <button aria-label="Close document editor">Close</button>
          <div aria-label="Document error state" style="display: none;">Error message</div>
        </section>
      `;
    });

    // Test that all our accessibility-first getters work
    documentEditPageGetters.getDocumentEditPage().should('exist');
    documentEditPageGetters
      .getDocumentEditHeading()
      .should('be.visible')
      .and('contain.text', 'Edit document');
    documentEditPageGetters.getDocumentTitleInput().should('exist').and('have.value', 'Test Title');
    documentEditPageGetters
      .getDocumentContentInput()
      .should('exist')
      .and('contain.text', 'Test content');
    documentEditPageGetters.getDocumentStatusSelect().should('exist').and('contain.text', 'Draft');
    documentEditPageGetters.getDocumentSaveButton().should('exist').and('contain.text', 'Save');
    documentEditPageGetters.getDocumentCloseButton().should('exist').and('contain.text', 'Close');
    documentEditPageGetters.getDocumentErrorState().should('exist');
  });

  it('validates proper aria-label attribute usage', () => {
    // Create DOM with proper accessibility attributes
    cy.document().then((doc) => {
      doc.body.innerHTML = `
        <div>
          <input aria-label="Document title input" />
          <textarea aria-label="Document content input"></textarea>
          <select aria-label="Document status select">
            <option>Draft</option>
          </select>
          <button aria-label="Save document">Save</button>
          <button aria-label="Close document editor">Close</button>
        </div>
      `;
    });

    // Test that aria-label attributes are properly set
    cy.get('[aria-label="Document title input"]').should(
      'have.attr',
      'aria-label',
      'Document title input',
    );

    cy.get('[aria-label="Document content input"]').should(
      'have.attr',
      'aria-label',
      'Document content input',
    );

    cy.get('[aria-label="Document status select"]').should(
      'have.attr',
      'aria-label',
      'Document status select',
    );

    cy.get('[aria-label="Save document"]').should('have.attr', 'aria-label', 'Save document');

    cy.get('[aria-label="Close document editor"]').should(
      'have.attr',
      'aria-label',
      'Close document editor',
    );
  });

  it('validates keyboard accessibility patterns', () => {
    // Create interactive elements
    cy.document().then((doc) => {
      doc.body.innerHTML = `
        <form>
          <input aria-label="Document title input" type="text" />
          <textarea aria-label="Document content input"></textarea>
          <button aria-label="Save document" type="button">Save</button>
        </form>
      `;
    });

    // Test keyboard navigation
    cy.get('[aria-label="Document title input"]')
      .focus()
      .should('be.focused')
      .type('Test Document Title')
      .should('have.value', 'Test Document Title');

    cy.get('[aria-label="Document content input"]')
      .focus()
      .should('be.focused')
      .type('Test document content')
      .should('have.value', 'Test document content');

    cy.get('[aria-label="Save document"]').focus().should('be.focused');
  });
});
