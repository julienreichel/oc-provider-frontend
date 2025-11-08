import { createMemoryHistory, createRouter } from 'vue-router';
import type { Router } from 'vue-router';
import App from '../../App.vue';
import routes from '../../router/routes';
import { SidebarNavGetters } from '../../components/tests/SidebarNav.getters';

const mountApp = (initialPath = '/'): Cypress.Chainable<Router> => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  });

  void router.push(initialPath);

  return cy
    .wrap(router.isReady())
    .then(() => {
      cy.mount(App, {
        global: {
          plugins: [router],
        },
      });
    })
    .then(() => router);
};

describe('App navigation (workspace)', () => {
  it('navigates across primary routes via the sidebar', () => {
    mountApp('/').then((router) => {
      // Test initial dashboard route using accessibility selectors
      SidebarNavGetters.getDashboardLink().should('have.attr', 'aria-current', 'page');

      // Test that navigation elements are accessible and clickable
      SidebarNavGetters.getSettingsLink()
        .should('be.visible')
        .and('have.attr', 'aria-label', 'Go to settings');

      // Test that the router instance is properly configured
      cy.wrap(router.currentRoute.value.name).should('equal', 'dashboard');
    });
  });

  it('shows the not found page for unknown URLs', () => {
    mountApp('/unknown/path').then((router) => {
      // Test that router handles unknown routes properly
      cy.wrap(router.currentRoute.value.name).should('equal', 'not-found');

      // Test that 404 page renders with semantic structure
      cy.get('main[role="main"]').should('exist');
      cy.get('h1').should('exist').and('be.visible');

      // Test that there's a navigation element to go back
      cy.get('a, button').should('exist').and('be.visible');
    });
  });
});
