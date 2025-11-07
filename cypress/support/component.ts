// Import commands.ts using ES2015 syntax:
import './commands';

import { mount } from '@cypress/vue';
import { Quasar } from 'quasar';
import { i18n } from '../../src/i18n';

// Import only the essential Quasar CSS for component testing (following Quasar docs)
import 'quasar/dist/quasar.css';

// Add Quasar-specific helper commands following their documentation
Cypress.Commands.add('dataCy', (dataCyId: string) => {
  return cy.get(`[data-cy=${dataCyId}]`);
});

// Augment the Cypress namespace to include type definitions for custom commands
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      dataCy(dataCyId: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

// Create a custom mount command that includes Quasar and i18n by default (Quasar pattern)
Cypress.Commands.add('mount', (component, options = {}) => {
  options.global = options.global ?? {};
  options.global.plugins = options.global.plugins ?? [];

  // Add Quasar plugin following their recommendations
  options.global.plugins.push([
    Quasar,
    {
      plugins: {}, // Add any Quasar plugins you need
    },
  ]);

  // Add i18n plugin
  options.global.plugins.push(i18n);

  return mount(component, options);
});
