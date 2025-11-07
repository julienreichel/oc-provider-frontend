import DocumentViewPage from '../DocumentViewPage.vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { i18n } from 'src/i18n';
import { DocumentViewPageGetters } from './DocumentViewPage.getters';

const routes = [
  { path: '/', name: 'access', component: { template: '<div>Access</div>' } },
  { path: '/view/:code', name: 'view', component: DocumentViewPage },
];

describe('DocumentViewPage Accessibility', () => {
  let router: ReturnType<typeof createRouter>;

  beforeEach(() => {
    router = createRouter({
      history: createWebHashHistory(),
      routes,
    });

    cy.mount(DocumentViewPage, {
      global: {
        plugins: [router, i18n],
        mocks: {
          $route: {
            params: { code: 'TEST123' },
          },
        },
      },
    }).then(async () => {
      // Navigate to the view page to ensure proper component state
      await router.push('/view/TEST123');
    });
  });

  describe('focus management', () => {
    it('should place focus on main heading after navigation', async () => {
      // Navigate to document view
      await router.push('/view/test123');

      // Main heading should receive focus for screen readers
      DocumentViewPageGetters.getDocumentTitle()
        .should('have.focus')
        .and('have.attr', 'tabindex', '-1'); // Programmatic focus
    });

    it('should maintain focus when content loads', async () => {
      await router.push('/view/valid123');

      // When document loads successfully, focus should remain on title
      DocumentViewPageGetters.getDocumentTitle().should('be.visible').and('have.focus');
    });

    it('should focus error heading when error occurs', async () => {
      await router.push('/view/invalid123');

      // When error occurs, focus should be on error message
      DocumentViewPageGetters.getErrorMessage()
        .should('be.visible')
        .and('have.focus')
        .and('have.attr', 'tabindex', '-1');
    });
  });

  describe('error state accessibility', () => {
    it('should announce errors to screen readers', async () => {
      await router.push('/view/notfound');

      // Error message should have role="alert" for screen readers
      DocumentViewPageGetters.getErrorMessage()
        .should('be.visible')
        .and('have.attr', 'role', 'alert');
    });

    it('should provide clear error messaging', async () => {
      await router.push('/view/expired');

      // Error messages should be human-friendly
      DocumentViewPageGetters.getErrorMessage()
        .should('contain.text', 'no longer available')
        .and('not.contain', 'expired')
        .and('not.contain', '410')
        .and('not.contain', 'error');
    });

    it('should have accessible retry button', async () => {
      await router.push('/view/unavailable');

      // Retry button should be properly labeled
      DocumentViewPageGetters.getTryAgainButton()
        .should('be.visible')
        .and('contain.text', 'Try Again')
        .and('have.attr', 'type', 'button');
    });

    it('should have accessible back navigation', async () => {
      await router.push('/view/test123');

      // Back button should be clearly labeled
      DocumentViewPageGetters.getEnterNewCodeButton()
        .should('be.visible')
        .and('contain.text', 'Enter New Code')
        .and('have.attr', 'role', 'button');
    });
  });

  describe('loading state accessibility', () => {
    it('should announce loading state to screen readers', async () => {
      await router.push('/view/loading123');

      // Loading message should be announced
      DocumentViewPageGetters.getLoadingMessage()
        .should('be.visible')
        .and('have.attr', 'aria-live', 'polite');
    });

    it('should provide meaningful loading text', async () => {
      // Navigate to trigger loading state
      await router.push('/view/loading123');

      // Check that loading elements provide meaningful text for screen readers
      DocumentViewPageGetters.getLoadingMessage()
        .should('exist')
        .and('contain.text', 'Loading your document');

      // Verify loading spinner has accessibility role
      DocumentViewPageGetters.getLoadingSpinner().should('have.attr', 'role', 'status');
    });
  });

  describe('document content accessibility', () => {
    it('should have proper heading structure', async () => {
      await router.push('/view/valid123');

      // Document should have proper heading hierarchy
      DocumentViewPageGetters.getDocumentTitle().should('be.visible').and('match', 'h1');
    });

    it('should provide document meta information', async () => {
      await router.push('/view/valid123');

      // Document metadata should be accessible
      DocumentViewPageGetters.getDocumentMetadata()
        .should('be.visible')
        .and('have.attr', 'aria-label')
        .invoke('attr', 'aria-label')
        .then((ariaLabel) => {
          expect(ariaLabel).to.contain('Document metadata');
        });
    });

    it('should handle empty content gracefully', async () => {
      await router.push('/view/empty123');

      // Empty content should be indicated
      DocumentViewPageGetters.getDocumentContent()
        .should('exist')
        .then(($content: JQuery<HTMLElement>) => {
          if ($content.text().trim() === '') {
            // Should have indication of empty content
            DocumentViewPageGetters.getEmptyDocumentState()
              .should('be.visible')
              .and('contain.text', 'No content available');
          }
        });
    });
  });

  describe('keyboard navigation', () => {
    it('should support keyboard navigation for actions', async () => {
      await router.push('/view/error123');

      // Retry button should be keyboard accessible
      DocumentViewPageGetters.getTryAgainButton().focus().should('have.focus').type('{enter}');
    });

    it('should support Escape key for back navigation', async () => {
      await router.push('/view/test123');

      // Escape key should trigger back navigation
      cy.get('body').type('{esc}');
      cy.url().should('not.include', '/view/');
    });
  });

  describe('screen reader landmarks', () => {
    it('should have proper landmark structure', async () => {
      await router.push('/view/test123');

      // Main content should be in main landmark
      cy.get('main[role="main"]').should('exist');

      // Content should be within main
      cy.get('main').within(() => {
        // Check for main content areas - using individual selectors since Loading... doesn't exist
        cy.get('[aria-label="Document content"], [aria-label="Error message"]').should('exist');
      });
    });

    it('should have skip links for keyboard users', async () => {
      // Navigate to the document view page first
      await router.push('/view/test123');

      // Check accessibility elements
      DocumentViewPageGetters.getSkipToMainContent().should('exist');
      DocumentViewPageGetters.getPage().should('exist').and('not.be.empty');

      // Check that main content area exists for skip link target
      cy.get('#main-content').should('exist');
    });
  });
});
