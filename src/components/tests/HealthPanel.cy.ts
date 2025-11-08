import { ref } from 'vue';
import type { UseHealthResult } from 'src/composables/useHealth';
import type { ApiError } from 'src/models/ApiError';
import type { Health, Ready } from 'src/models/Document';
import HealthPanel from '../HealthPanel.vue';
import { healthPanelGetters } from './HealthPanel.getters';

type MockOverrides = Partial<{
  health: Health | null;
  ready: Ready | null;
  loading: boolean;
  error: ApiError | null;
}>;

const createComposableMock = (overrides: MockOverrides = {}): UseHealthResult => {
  const health = ref<Health | null>(
    overrides.health ?? { status: 'ok', timestamp: '2024-02-15T10:00:00.000Z' },
  );
  const ready = ref<Ready | null>(overrides.ready ?? { status: 'ready', database: 'connected' });
  const loading = ref(overrides.loading ?? false);
  const error = ref<ApiError | null>(overrides.error ?? null);
  const check = cy.stub().as('healthCheck').resolves(undefined);

  return {
    health,
    ready,
    loading,
    error,
    check,
  };
};

describe('HealthPanel', () => {
  it('renders API and ready status details from the composable', () => {
    const mockComposable = createComposableMock();

    cy.mount(HealthPanel, {
      props: {
        useHealthImpl: () => mockComposable,
      },
    });

    cy.get('@healthCheck').should('have.been.calledOnce');
    healthPanelGetters.getPanel().should('contain.text', 'Service health');
    healthPanelGetters.getPanel().should('contain.text', 'API availability');
    //healthPanelGetters.getBadgeByText('Operational').should('exist');
    //healthPanelGetters.getBadgeByText('Ready').should('exist');
    healthPanelGetters.getPanel().should('contain.text', 'Database connected');
  });

  it('surfaces backend errors without exposing translation keys', () => {
    const mockComposable = createComposableMock({
      error: { message: 'Workspace unavailable', code: 'unavailable' },
    });

    cy.mount(HealthPanel, {
      props: {
        useHealthImpl: () => mockComposable,
      },
    });

    healthPanelGetters.getPanel().should('contain.text', 'Workspace unavailable');
    healthPanelGetters.getPanel().should('not.contain.text', 'settings.health');
  });

  it.skip('allows manual refresh', () => {
    const mockComposable = createComposableMock();

    cy.mount(HealthPanel, {
      props: {
        useHealthImpl: () => mockComposable,
      },
    });

    healthPanelGetters.getRefreshButton().click();
    cy.get('@healthCheck').should('have.been.calledTwice');
  });
});
