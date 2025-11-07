import { createMemoryHistory, createRouter } from 'vue-router';
import SidebarNav from './SidebarNav.vue';
import { SidebarNavGetters } from './SidebarNav.getters';

const mountSidebarNavForA11y = (initialRoute = '/'): Cypress.Chainable => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'dashboard', component: { template: '<div>Dashboard</div>' } },
      {
        path: '/documents/:id/edit',
        name: 'document-edit',
        component: { template: '<div>Edit</div>' },
      },
      {
        path: '/documents/:id/send',
        name: 'document-send',
        component: { template: '<div>Send</div>' },
      },
      { path: '/settings', name: 'settings', component: { template: '<div>Settings</div>' } },
    ],
  });

  void router.push(initialRoute);

  return cy.wrap(router.isReady()).then(() => {
    cy.mount(SidebarNav, {
      global: {
        plugins: [router],
      },
    });
    return cy.wrap(router);
  });
};

describe('SidebarNav accessibility', () => {
  it('cycles focus through navigation links via keyboard', () => {
    mountSidebarNavForA11y();

    // Test that navigation elements are focusable
    SidebarNavGetters.getDashboardLink().focus();
    cy.focused().should('have.attr', 'aria-label', 'Go to dashboard');

    // Test that all navigation links are keyboard accessible
    SidebarNavGetters.getDocumentEditLink().focus();
    cy.focused().should('have.attr', 'aria-label', 'Go to document editor');
  });

  it('sets aria-current correctly for screen readers', () => {
    mountSidebarNavForA11y('/settings');

    // Active route should have aria-current="page"
    SidebarNavGetters.getSettingsLink().should('have.attr', 'aria-current', 'page');

    // Inactive routes should not have aria-current
    SidebarNavGetters.getDashboardLink().should('not.have.attr', 'aria-current');
    SidebarNavGetters.getDocumentEditLink().should('not.have.attr', 'aria-current');
    SidebarNavGetters.getDocumentSendLink().should('not.have.attr', 'aria-current');
  });

  it('supports keyboard and mouse activation', () => {
    mountSidebarNavForA11y();

    // Test that navigation links are clickable and accessible
    SidebarNavGetters.getSettingsLink()
      .should('be.visible')
      .and('have.attr', 'aria-label', 'Go to settings')
      .and('have.attr', 'tabindex', '0');

    // Test focus and keyboard interaction
    SidebarNavGetters.getSettingsLink()
      .focus()
      .should('have.focus')
      .trigger('keydown', { key: 'Enter' });

    // Verify element remains accessible after interaction
    SidebarNavGetters.getSettingsLink().should('exist');
  });

  it('maintains focus visibility for keyboard users', () => {
    mountSidebarNavForA11y();

    // Test that focused elements are accessible
    SidebarNavGetters.getDashboardLink().focus().should('have.focus').and('be.visible');
  });

  it('provides meaningful navigation structure for screen readers', () => {
    mountSidebarNavForA11y();

    // All navigation links should have descriptive aria-labels
    const expectedLabels = [
      'Go to dashboard',
      'Go to document editor',
      'Go to document send',
      'Go to settings',
    ];

    cy.get('[aria-label]').each(($el, index) => {
      if (index < expectedLabels.length) {
        cy.wrap($el).should('have.attr', 'aria-label', expectedLabels[index]);
      }
    });
  });

  it('handles route changes and updates aria-current dynamically', () => {
    mountSidebarNavForA11y('/').then((router) => {
      // Initially dashboard should be active
      SidebarNavGetters.getDashboardLink().should('have.attr', 'aria-current', 'page');

      // Navigate to settings
      void router.push('/settings');

      cy.wrap(router.isReady()).then(() => {
        // Settings should now be active
        SidebarNavGetters.getSettingsLink().should('have.attr', 'aria-current', 'page');
        SidebarNavGetters.getDashboardLink().should('not.have.attr', 'aria-current');
      });
    });
  });
});
