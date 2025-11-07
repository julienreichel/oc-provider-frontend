import { createMemoryHistory, createRouter } from 'vue-router';
import SidebarNav from '../SidebarNav.vue';
import { SidebarNavGetters } from '../SidebarNav.getters';

const createTestRouter = (): ReturnType<typeof createRouter> =>
  createRouter({
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

const mountSidebarNav = (initialRoute = '/'): Cypress.Chainable => {
  const router = createTestRouter();
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

describe('SidebarNav', () => {
  it('sets aria-current on active route for screen readers', () => {
    mountSidebarNav('/settings');

    // Test ARIA current attribute for active navigation
    SidebarNavGetters.getSettingsLink().should('have.attr', 'aria-current', 'page');
    SidebarNavGetters.getDashboardLink().should('not.have.attr', 'aria-current');
  });

  it('provides accessible navigation links', () => {
    mountSidebarNav();

    // Verify all navigation links have proper aria-labels
    SidebarNavGetters.getDashboardLink()
      .should('exist')
      .and('have.attr', 'aria-label', 'Go to dashboard');

    SidebarNavGetters.getDocumentEditLink()
      .should('exist')
      .and('have.attr', 'aria-label', 'Go to document editor');

    SidebarNavGetters.getDocumentSendLink()
      .should('exist')
      .and('have.attr', 'aria-label', 'Go to document send');

    SidebarNavGetters.getSettingsLink()
      .should('exist')
      .and('have.attr', 'aria-label', 'Go to settings');
  });

  it('supports keyboard navigation', () => {
    mountSidebarNav();

    // Test that navigation links are keyboard accessible
    SidebarNavGetters.getDocumentEditLink()
      .should('be.visible')
      .and('have.attr', 'tabindex', '0')
      .focus()
      .should('have.focus');
  });
});
