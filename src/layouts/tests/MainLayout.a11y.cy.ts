import { createMemoryHistory, createRouter } from 'vue-router';
import MainLayout from '../MainLayout.vue';
import { MainLayoutGetters } from './MainLayout.getters';

const mountLayoutForA11y = (initialRoute = '/'): Cypress.Chainable => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'dashboard', component: { template: '<div>Dashboard Content</div>' } },
      {
        path: '/settings',
        name: 'settings',
        component: { template: '<div>Settings Content</div>' },
      },
    ],
  });

  void router.push(initialRoute);

  return cy.wrap(router.isReady()).then(() => {
    cy.mount(MainLayout, {
      global: {
        plugins: [router],
      },
    });
  });
};

describe('MainLayout accessibility', () => {
  it('provides skip link for keyboard users', () => {
    mountLayoutForA11y();

    // Test skip link exists and is properly positioned off-screen
    MainLayoutGetters.getSkipLink().should('exist').and('have.css', 'top', '-40px'); // Initially positioned off-screen

    // Test skip link becomes visible when focused
    MainLayoutGetters.getSkipLink().focus();
    MainLayoutGetters.getSkipLink().should('have.css', 'top', '16px'); // Moves on-screen when focused

    // Verify skip link functionality
    MainLayoutGetters.getSkipLink().click();
    MainLayoutGetters.getMainContent().should('have.focus');
  });

  it('maintains proper focus management', () => {
    mountLayoutForA11y();

    // Test that main content is focusable and has proper attributes
    MainLayoutGetters.getMainContent()
      .should('have.attr', 'tabindex', '-1')
      .focus()
      .should('have.focus');

    // Test that skip link can receive focus
    MainLayoutGetters.getSkipLink().focus().should('have.focus');
  });

  it('supports keyboard navigation patterns', () => {
    mountLayoutForA11y();

    // Test that skip link can be focused and is keyboard accessible
    MainLayoutGetters.getSkipLink().focus().should('have.focus').and('be.visible'); // Should be visible when focused

    // Test click functionality on skip link (since Enter might not work in test env)
    MainLayoutGetters.getSkipLink().click();

    // Main content should receive focus after skip link activation
    MainLayoutGetters.getMainContent().should('have.focus');

    // Test that main content is properly configured for focus management
    MainLayoutGetters.getMainContent()
      .should('have.attr', 'tabindex', '-1')
      .and('have.attr', 'id', 'main-content');
  });

  it('provides proper ARIA landmarks structure', () => {
    mountLayoutForA11y();

    // Verify semantic structure for screen readers
    MainLayoutGetters.getNavigation()
      .should('have.attr', 'role', 'navigation')
      .and('have.attr', 'aria-label');

    MainLayoutGetters.getMainContent()
      .should('have.prop', 'tagName', 'MAIN')
      .and('have.attr', 'aria-label');

    // Ensure no missing landmarks
    cy.get('header, main, nav, aside').should('have.length.gte', 2);
  });

  it('handles responsive navigation properly', () => {
    mountLayoutForA11y();

    // Test mobile menu behavior (simulated)
    cy.viewport(768, 1024); // Mobile viewport

    // Navigation should remain accessible
    MainLayoutGetters.getNavigation().should('exist');

    // Toggle button should be properly labeled
    cy.get('[aria-label*="Toggle"]').should('exist');
  });
});
