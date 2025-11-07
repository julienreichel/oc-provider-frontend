# Accessibility-First Cypress Testing Guide

This guide documents the testing strategy we will use to keep the OC Provider Frontend fully aligned with assistive technology behavior. Follow these rules for every new component, page, or layout before merging Cypress specs.

---

## 1. Core Principles

1. **Getter Utility Pattern** — Every component or page with Cypress coverage owns a `{ComponentName}.getters.ts` file placed next to the component source.
2. **Aria-Label Based Selection** — Tests target `aria-label` values (or other ARIA relationships) rather than `data-*`, CSS, or DOM structure.
3. **Internationalized Accessibility** — All aria strings live in the `a11y` namespace inside the i18n bundle so they stay in sync with translations.
4. **Structured Object Export** — Getter utilities export a typed `const` object that mirrors the rendered elements.
5. **Minimal Abstraction** — Only add getters for elements that exist; delete getters when elements go away.

**Benefits**

- Mirrors the screen-reader experience.
- Changes to aria copy only require getter updates.
- Enforces semantic HTML and ARIA usage.
- Keeps selectors locale-aware.
- Provides IntelliSense-friendly TypeScript types.

---

## 2. Getter Utility Architecture

**File placement:** next to the component (`SidebarNav.getters.ts`, `MainLayout.getters.ts`, etc.).

```ts
/**
 * Cypress getter utilities for MainLayout
 * Uses aria-label selectors to mirror screen reader behavior.
 */
/// <reference types="cypress" />

const getByAriaLabel = (label: string) => cy.get(`[aria-label="${label}"]`);

export const MainLayoutGetters = {
  getSkipLink: () => getByAriaLabel('Skip to workspace content'),
  getNavigation: () => getByAriaLabel('Workspace'),
  getHeaderMenuButton: () => getByAriaLabel('Toggle navigation'),
} as const;

export type MainLayoutElements = {
  [K in keyof typeof MainLayoutGetters]: ReturnType<(typeof MainLayoutGetters)[K]>;
};
```

### Selector Rules

| ✅ Allowed | 💬 Notes |
| --- | --- |
| `cy.get('[aria-label="Workspace navigation"]')` | Primary selector form |
| `cy.get('label[for="access-code"]')` | Valid when verifying label associations |
| `cy.get('[role="alert"]')`, `cy.get('[aria-live="polite"]')` | Use for ARIA roles/live regions |
| `cy.contains('Start a draft')` | Acceptable for visible semantic copy |

| 🚫 Forbidden | Why |
| --- | --- |
| `cy.get('[data-cy="submit-btn"]')` | Implementation detail |
| `cy.get('.btn-primary')` | Style-based |
| `cy.get('#submit-button')` | DOM coupling |

Exceptions only apply when testing ARIA relationships (e.g., `label[for]`, `aria-describedby`, focus state selectors).

---

## 3. Internationalization Requirements

- Add/maintain accessibility strings under `a11y` in `src/i18n/en-US/index.ts`.
- Use sentence case and keep copy descriptive (e.g., `document send form submit button`).
- Getter files must reference the same resolved string the component uses via `$t('a11y.someKey')`.
- When a component introduces new aria-labels, update translations *and* getters in the same change.

Example structure:

```ts
export default {
  // ...
  a11y: {
    workspaceNavigation: 'Workspace navigation',
    skipToContent: 'Skip to workspace content',
    sidebarDashboardLink: 'Go to dashboard',
    sendDocumentButton: 'Send document',
    // ...
  },
};
```

---

## 4. Component Implementation Checklist

1. Wrap interactive areas with semantic elements (`nav`, `main`, `button`, `form`).
2. Apply internationalized `aria-label` attributes using `$t('a11y.key')`.
3. Manage ARIA states (`aria-current`, `aria-invalid`, `aria-live`, `role="status"`, etc.).
4. Expose skip links and focus traps where relevant (e.g., `MainLayout`, dialogs).
5. Keep markup aligned with the getters — rename getters if aria-labels evolve.

Snippet pattern:

```vue
<q-btn
  aria-live="polite"
  :aria-label="$t('a11y.sidebarDashboardLink')"
  :to="{ name: 'dashboard' }"
/>
```

---

## 5. Cypress Test Structure

### Component / Layout Specs

```ts
import MainLayout from './MainLayout.vue';
import { MainLayoutGetters } from './MainLayout.getters';

describe('MainLayout', () => {
  beforeEach(() => {
    cy.mount(MainLayout, { /* router + plugins */ });
  });

  it('renders shell landmarks', () => {
    MainLayoutGetters.getSkipLink().should('exist');
    MainLayoutGetters.getNavigation().should('have.attr', 'role', 'navigation');
  });
});
```

### Accessibility Suites

Create `{Component}.a11y.cy.ts` (if needed) to cover keyboard flow, focus order, and ARIA live regions.

```ts
describe('SidebarNav accessibility', () => {
  it('cycles focus via keyboard', () => {
    SidebarNavGetters.getDashboardLink().focus().tab();
    SidebarNavGetters.getDocumentEditLink().should('have.focus');
  });

  it('sets aria-current on active route', () => {
    SidebarNavGetters.getSettingsLink().should('have.attr', 'aria-current', 'page');
  });
});
```

### Testing Categories

- **Form Accessibility**: labels, `aria-required`, `aria-describedby`, validation messaging.
- **Keyboard Navigation**: Tab order, Enter submission, Escape handling (dialogs).
- **Screen Reader Support**: Live regions, alerts, headings, skip links.
- **Focus Management**: Initial focus, restoration after dialogs, visible focus rings.

---

## 6. Implementation Checklist

### Per Component/Page

- [ ] Aria labels internationalized and documented.
- [ ] `{Component}.getters.ts` contains only real elements.
- [ ] Getter JSDoc explains intent and references Cypress docs if helpful.
- [ ] Type definitions exported.
- [ ] Accessibility copy reviewed with Product/Design if translated text changes.

### Per Cypress Spec

- [ ] Imports getter utilities for every component under test.
- [ ] Uses aria-label selectors (no `data-cy` or CSS selectors).
- [ ] Contains at least one accessibility-focused test block (keyboard, Aria, etc.).
- [ ] Includes assertions for visible semantics when needed (`cy.contains(...)`).

### Internationalization

- [ ] `a11y` translation entries added/updated.
- [ ] Keys follow sentence case and describe actual behavior.
- [ ] Getter expectations match final translation values exactly.

### QA Sign-off

- [ ] `npm run test:component` (Cypress) passes locally.
- [ ] Accessibility suites cover keyboard navigation, ARIA roles, and live regions.
- [ ] No orphaned getters or selectors remain in the repo.

---

## 7. Quick Start Workflow

1. Build the component with semantic HTML + aria labels referencing `a11y` keys.
2. Add `{Component}.getters.ts` next to the component and document each getter.
3. Update translations with any new `a11y` keys.
4. Write Cypress specs using the getter utilities (include `.a11y.cy.ts` when appropriate).
5. Run Cypress component tests (`npm run test:component`) and include logs/screenshots when submitting PRs.

Following this workflow ensures every test validates the same experience delivered to screen reader and keyboard users, keeping the Provider Frontend inclusive by default.
