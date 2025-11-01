# AI Coding Instructions for OC Provider Frontend

## Project Overview

This is a **Vue 3 + Quasar** SPA for document providers to create, edit, and send documents to clients. The app communicates exclusively with a Provider Backend and follows a modular architecture with Models → Providers → Composables → Components separation.

## Architecture & Structure

### Key Conventions

- **Mandatory i18n**: All user-facing text must use `src/i18n/` translations, never hardcoded strings
- **Quasar-first**: Use Quasar components (`q-page`, `q-card`, `q-toolbar`) over custom divs/CSS
- **TypeScript strict mode**: All code uses strict TypeScript with proper type imports (`import type`)
- **Composition API**: Use `<script setup>` and composables, not Options API

### File Organization Pattern

```
src/
├── models.ts          # Data structures (Document, UserProfile, SendResult)
├── providers/         # Backend communication layer
├── composables/       # Business logic (useDocuments, useDocumentEditor)
├── components/        # UI components following Quasar patterns
├── boot/             # App initialization (axios, i18n)
└── i18n/             # Translation files (mandatory for all text)
```

## Development Workflow

### Commands

- **Dev server**: `quasar dev` (not `npm run dev`)
- **Build**: `quasar build`
- **Lint**: `yarn lint` (uses flat ESLint config with Vue/TypeScript rules)
- **Format**: `yarn format` (Prettier with specific ignore patterns)

### Code Quality Rules

- ESLint enforces `@typescript-eslint/consistent-type-imports`
- No inline styles - use Quasar utility classes or scoped CSS
- Auto-save documents to prevent data loss
- Always confirm destructive actions (delete, send)

## Specific Patterns

### Component Structure

```vue
<template>
  <q-page class="row justify-center">
    <q-card class="col-12 col-md-8">
      <!-- Use i18n for all text -->
      <q-card-section>{{ $t('document.title') }}</q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import type { Document } from 'src/models';
import { useDocuments } from 'src/composables/useDocuments';
</script>
```

### Boot File Pattern

Boot files in `src/boot/` use `defineBoot()` wrapper and register global properties. See `axios.ts` and `i18n.ts` for examples.

### Quasar Config

- Uses hash routing (`vueRouterMode: 'hash'`)
- Includes TypeScript strict mode and Vue shim
- Vite plugins for i18n and ESLint checking
- Material icons and Roboto font

## Deployment Context

- **Namespace**: `oc-provider`
- **Container**: Nginx serving SPA from port 80
- **K8s**: Uses `ghcr-creds` image pull secret
- **Routing**: Ingress handles `/` → frontend, `/api/*` → backend

## Commit Convention

```
type(scope): Description

Examples:
feat(editor): Add document auto-save functionality
fix(i18n): Correct German translation keys
refactor(composables): Extract document state logic
```

## Key Integration Points

- **Provider Backend**: All API calls go through `src/boot/axios.ts` configured API instance
- **Client Backend**: Documents sent via Provider Backend return access codes for client viewing
- **i18n**: Browser language detection with manual override in settings
- **Responsive**: Must work on desktop, tablet, and mobile using Quasar's grid system

Read `KNOWLEDGE_BASE.md` for detailed business requirements and component specifications.
