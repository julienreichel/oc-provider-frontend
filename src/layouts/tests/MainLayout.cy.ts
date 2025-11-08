import { createMemoryHistory, createRouter } from 'vue-router';
import MainLayout from '../MainLayout.vue';
import { MainLayoutGetters } from './MainLayout.getters';

const mountLayout = (initialPath = '/'): Cypress.Chainable => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/',
        name: 'dashboard',
        component: { template: '<div>Dashboard</div>' },
      },
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
      {
        path: '/settings',
        name: 'settings',
        component: { template: '<div>Settings</div>' },
      },
    ],
  });

  void router.push(initialPath);

  return cy.wrap(router.isReady()).then(() => {
    cy.mount(MainLayout, {
      global: {
        plugins: [router],
      },
    });
  });
};

describe('MainLayout (component)', () => {
  it('renders semantic layout landmarks', () => {
    mountLayout();

    // Test accessibility landmarks using aria-label selectors
    MainLayoutGetters.getMainLayout().should('exist');
    MainLayoutGetters.getHeaderBar().should('exist');
    MainLayoutGetters.getNavigation().should('have.attr', 'role', 'navigation');
    MainLayoutGetters.getPageContainer().should('exist');
    MainLayoutGetters.getMainContent().should('have.prop', 'tagName', 'MAIN');
  });

  it('provides skip link for keyboard navigation', () => {
    mountLayout();

    MainLayoutGetters.getSkipLink().should('exist').and('have.attr', 'href', '#main-content');
  });

  it('sets proper ARIA labels for screen readers', () => {
    mountLayout();

    MainLayoutGetters.getMainLayout().should(
      'have.attr',
      'aria-label',
      'Provider workspace layout',
    );
    MainLayoutGetters.getNavigation().should('have.attr', 'aria-label', 'Workspace navigation');
    MainLayoutGetters.getMainContent().should('have.attr', 'aria-label', 'Main workspace content');
  });
});
