# OC Provider Frontend

A **Vue 3 + Quasar** SPA that enables document providers to create, edit, and send documents to clients. The application serves as the main workspace for document management and communication, offering an intuitive interface to manage the full document lifecycle from creation to publication.

## 🎯 Purpose

The Provider Frontend interacts exclusively with the **Provider Backend** to create, update, and send documents. When a document is sent, the backend transmits it to the **Client Backend**, which returns a unique access code for clients to view the document.

## 🏗️ Architecture

The application follows a modular architecture with clear separation of concerns:

- **Models** — Data structures (Document, UserProfile, SendResult)
- **Providers** — Backend communication layer
- **Composables** — Business logic (useDocuments, useDocumentEditor)
- **Components** — UI components following Quasar patterns

## 🚀 Development

### Prerequisites

- Node.js 20+
- Yarn or npm
- Quasar CLI

### Install Dependencies

```bash
yarn
# or
npm install
```

### Development Commands

```bash
# Start development server with hot-reload
quasar dev

# Build for production
quasar build

# Lint code
yarn lint

# Format code
yarn format
```

### Key Development Rules

- **Mandatory i18n**: All user-facing text must use `src/i18n/` translations
- **Quasar-first**: Use Quasar components over custom HTML/CSS
- **TypeScript strict mode**: Use proper type imports (`import type`)
- **Composition API**: Use `<script setup>` pattern

## 🗂️ Project Structure

```
src/
├── models.ts          # Data structures
├── providers/         # Backend communication
├── composables/       # Business logic & state
├── components/        # UI components
├── boot/             # App initialization (axios, i18n)
├── i18n/             # Translation files
├── layouts/          # Layout components
└── pages/            # Route components
```

## 🌐 Deployment

- **Namespace**: `oc-provider`
- **Public URL**: `https://provider.on-track.ch/`
- **Container**: Nginx serving SPA from port 80
- **Deployment**: GitHub Actions → Docker → GHCR → Kubernetes

## 📚 Documentation

- See [KNOWLEDGE_BASE.md](./KNOWLEDGE_BASE.md) for detailed business requirements and component specifications
- See [.github/copilot-instructions.md](./.github/copilot-instructions.md) for AI coding guidelines

## 🔧 Configuration

The application uses Quasar's configuration system. Key settings:

- Hash routing mode for SPA deployment
- TypeScript strict mode enabled
- Vue I18n integration for internationalization
- Material icons and Roboto font
