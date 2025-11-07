# Project Structure Status

This document captures the current layout of `oc-provider-frontend`, explains how it diverges from the target structure defined in `KNOWLEDGE_BASE.md`, and clarifies why we are temporarily working with this setup.

## Why the structure is different

- The existing codebase was copied from the public **access-code viewer** project so that we could immediately start experimenting with Quasar/Vue tooling.
- Because of that lineage, the directory layout, page flows, Cypress suites, and copy still revolve around the “enter an access code → view a document” journey instead of the provider-facing workspace that the knowledge base describes.
- We will iterate toward the documented target architecture (dashboard, document editor, send flow, settings, etc.) as we replace feature areas.

## Current repository layout

| Path | Purpose |
| --- | --- |
| `src/` | Application source (see breakdown below). |
| `public/` | Static assets served verbatim by Vite. |
| `cypress/` + `cypress.config.ts` | End-to-end and component tests that exercise the access-code experience. |
| `k8s/` | Deployment manifests carried over from the template project. |
| `quasar.config.ts`, `vite.config.ts`, `vitest.config.ts`, `eslint.config.js`, `postcss.config.js` | Tooling configuration from the source project. |
| `dockerfile`, `dist/` | Docker build definition and the last build artifacts. |

## `src/` breakdown

| Path | Notes |
| --- | --- |
| `App.vue`, `App.vue.spec.ts`, `router/` | Root shell and routing now expose the provider workspace routes (Dashboard, Document Edit, Document Send, Settings, NotFound) while we backfill real data and guards. |
| `pages/` | Contains the new workspace placeholder pages plus remnants from the copied public experience. The UI still renders static content until the document lifecycle is wired up. |
| `components/` | Mix of new workspace shell pieces (`MainLayout`, `HeaderBar`, `SidebarNav`, etc.) and historical viewer components that will be phased out next. |
| `layouts/` | Workspace shell now lives in `MainLayout.vue`; the legacy `PublicLayout` files were removed with the viewer flow. |
| `composables/` | Hooks such as `useDocumentByCode` and `useAccessCodeForm` that orchestrate the legacy flow rather than the provider document lifecycle described in the KB. |
| `providers/` | HTTP clients and provider registry abstractions copied from the source project; they focus on fetching a public document by code instead of the CRUD/send providers outlined in the KB. |
| `models/` | Data shapes (`PublicDocument`, `ApiError`) for the viewer workflow; we still need the `Document`, `DocumentMetadata`, `DocumentSummary`, `SendResult`, and `UserProfile` models listed in the KB. |
| `i18n/`, `assets/`, `css/`, `boot/`, `utils/` | Shared resources from the template project (global styles, Quasar boot files, translation bundles). |

## Gap vs. the target architecture

The knowledge base expects a provider-centric architecture composed of Models → Providers → Composables → Components that power dashboard, editing, sending, and settings routes. While we already have similarly named folders, their contents implement an entirely different user journey (public access-code viewer). Key gaps:

1. **Feature coverage** – None of the provider workflows (create/edit/send/manage documents, profile settings) exist; the router exposes only access-code pages.
2. **Domain models** – We still rely on `PublicDocument` instead of the provider-oriented models defined in the KB.
3. **Providers and composables** – Current services fetch a document by code; we still need the CRUD/send providers and related composables the KB outlines.
4. **Testing focus** – Cypress suites cover access-code input, document viewing, and accessibility for that flow, not the provider workspace flows we eventually need.

## Next steps toward alignment

1. Introduce the high-level routes described in `KNOWLEDGE_BASE.md` (`DashboardPage`, `DocumentEditPage`, `DocumentSendPage`, `SettingsPage`, `NotFound`).
2. Replace the copied `models/`, `providers/`, and `composables/` with the domain-specific entities (Document, DocumentMetadata, SendResult, etc.) and business logic defined in the KB.
3. Update components, layouts, and boot logic to match the provider workspace UX patterns, removing access-code specific screens as functionality becomes available.
4. Refresh Cypress and unit tests to cover the new workflows while phasing out the legacy suites.

This staged migration will bring the repository in line with the architecture committed to in the knowledge base while allowing us to keep shipping incremental improvements.
