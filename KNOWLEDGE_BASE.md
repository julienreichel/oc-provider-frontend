# OC Provider Frontend — Knowledge Base

## 🎯 Purpose

The **Provider Frontend** is a web application that enables providers to create, edit, and send documents to clients.
It serves as the main workspace for document management and communication, offering a simple and intuitive interface to manage the full document lifecycle — from creation to publication.

The app interacts exclusively with the **Provider Backend** to create, update, and send documents.
When a document is sent, the backend transmits it to the **Client Backend**, which returns a unique access code used by clients to view the document.

---

## 🧩 General Architecture

The application follows a modular **Vue 3 + Quasar** architecture, divided into several layers:

1. **Models** — define the structure of documents, users, and responses.
2. **Providers** — manage interactions with the backend and external services.
3. **Composables** — handle business logic and reactive state management.
4. **Components** — compose the user interface and implement user interactions.

This separation ensures clarity, modularity, and scalability, allowing easy maintenance and future feature growth.

---

## 🗂 Models

Models describe the data exchanged between the frontend and the backend, and the entities managed by the provider within the app.

### Proposed Models

| Model Name           | Description                                                                                                                                                                   |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Document**         | Represents a single editable document created by a provider. Contains attributes such as title, content, creation and modification dates, and status (draft, sent, archived). |
| **DocumentMetadata** | Holds supplementary details such as language, tags, and last modified information.                                                                                            |
| **DocumentSummary**  | Lightweight version of the document used for list views and dashboards.                                                                                                       |
| **SendResult**       | Represents the confirmation received after sending a document to the client backend, including the generated access code.                                                     |
| **UserProfile**      | Information about the currently logged-in provider (name, organization, preferences).                                                                                         |
| **ApiError**         | Represents API-level errors, used for consistent feedback when operations fail.                                                                                               |

### Relationships

- A **UserProfile** can own multiple **Documents**.
- Each **Document** can have a **DocumentMetadata** and may produce a **SendResult** when transmitted to the Client Backend.

---

## 🔌 Providers

Providers act as bridges between the frontend and the backend APIs, encapsulating network logic and error handling.
They allow the application to remain backend-agnostic and maintain consistent data handling.

### Required Providers

| Provider                      | Responsibility                                                                                            |
| ----------------------------- | --------------------------------------------------------------------------------------------------------- |
| **HttpProvider**              | Centralized configuration for backend communication (base URL, headers, authentication).                  |
| **DocumentProvider**          | Handles all document-related operations — creation, updates, deletion, and sending to the Client Backend. |
| **UserProvider**              | Retrieves and updates user profile and preferences.                                                       |
| **ConfigProvider (optional)** | Loads environment configuration, branding, and feature flags at runtime.                                  |

Providers should handle backend responses, normalize data into model structures, and manage errors gracefully.

---

## 🪄 Composables

Composables define and manage core business logic and reusable state.
They provide a declarative API for pages and components, enabling reactive updates and clean separation between logic and presentation.

### Core Composables

| Composable                | Description                                                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **useDocuments**          | Manages the list of all provider documents. Handles loading, filtering, and refreshing document lists.                         |
| **useDocumentEditor**     | Provides state and logic for editing a single document, including validation, saving, and publishing workflows.                |
| **useDocumentSender**     | Handles the “Send to client” process: triggers the backend call, receives confirmation, and exposes the resulting access code. |
| **useUserProfile**        | Retrieves and updates the current user’s profile information and settings.                                                     |
| **useUiState (optional)** | Manages notifications, modals, and global loading indicators.                                                                  |

Each composable should encapsulate one clear business domain (e.g., editing, sending, user profile).

---

## 🧱 Components

The interface is organized around intuitive workflows that guide the provider through document creation, editing, and sharing.

### 1. Layout Components

| Component             | Role                                                               |
| --------------------- | ------------------------------------------------------------------ |
| **MainLayout**        | Root layout containing navigation, toolbar, and main content area. |
| **SidebarNavigation** | Lists documents and actions (Create, Edit, Send).                  |
| **HeaderBar**         | Displays user profile, status, and contextual actions.             |

### 2. Document Management Components

| Component                 | Role                                                                                                        |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **DocumentList**          | Displays all documents with their title, last modification date, and status. Supports search and filtering. |
| **DocumentCard**          | Compact visual summary of a single document, used within lists or dashboards.                               |
| **DocumentEditor**        | The main editing interface allowing creation and modification of document content.                          |
| **DocumentToolbar**       | Provides actions for saving, sending, or discarding changes.                                                |
| **DocumentMetadataPanel** | Displays and edits metadata such as tags, language, and notes.                                              |

### 3. Sending and Confirmation Components

| Component           | Role                                                                                          |
| ------------------- | --------------------------------------------------------------------------------------------- |
| **SendDialog**      | Modal dialog confirming the action of sending a document to the client backend.               |
| **SendResultPanel** | Displays the access code returned by the backend and provides “Copy Link” or “Share” actions. |

### 4. Shared Components

| Component         | Role                                                                  |
| ----------------- | --------------------------------------------------------------------- |
| **LoadingState**  | Unified loading indicator for long-running operations.                |
| **ErrorState**    | Displays consistent error messages across pages.                      |
| **ConfirmDialog** | Reusable modal for user confirmations.                                |
| **EmptyState**    | Shown when no documents are available or a search returns no results. |

---

## 🌍 Internationalization (i18n)

Internationalization is **mandatory** in all user-facing text and labels.

### Guidelines

- Use Vue I18n or Quasar’s built-in internationalization system.
- Every text string must be translated via the i18n resource files — no hardcoded text in templates.
- Translation keys should be semantic and structured by context (e.g., `document.send.success`).
- Default language: **English**, with support for **French** and **German** in the future.
- The language should be automatically detected from browser settings and adjustable via a language selector in settings.

This ensures future adaptability for multilingual users and institutions.

---

## 🎨 Layout and Styling Rules

### Use of Quasar Components

- **All layouts must use Quasar’s grid system (`<q-page>`, `row`, `col`, `card`, `toolbar`, etc.)**.
- Avoid manually defining `div`-based grids — prefer Quasar’s responsive utilities.
- Leverage **Quasar Cards** for visual grouping (documents, modals, summaries).
- Avoid vertical “column” stacking unless logically necessary; favor **horizontal row-based layouts** for clarity and responsiveness.

### Styling Rules

- **No inline styles.** Use classes, props, or Quasar utility classes instead.
- **Reduce custom CSS to the strict minimum.** If styling is required, define scoped CSS in component files with meaningful class names.
- Use Quasar theme variables for colors, spacing, and typography.
- Maintain visual consistency across components — spacing, border-radius, and shadow should match Quasar defaults.
- Dark mode support should be considered but optional at this stage.

These rules ensure maintainability, visual harmony, and compliance with Quasar’s responsive design principles.

## 🧭 Navigation Structure

| Route                 | Page                 | Description                                                 |
| --------------------- | -------------------- | ----------------------------------------------------------- |
| `/`                   | **DashboardPage**    | Default view listing all documents created by the provider. |
| `/documents/:id/edit` | **DocumentEditPage** | Main document editing workspace.                            |
| `/documents/:id/send` | **DocumentSendPage** | Confirmation and result screen for document transmission.   |
| `/settings`           | **SettingsPage**     | Provider’s profile and configuration options.               |
| `/:catchAll(.*)*`     | **NotFound**         | Fallback page for invalid URLs.                             |

This structure provides a clear workflow from creation → editing → sending.

---

## 🧠 UX & Interaction Guidelines

- **Focus on clarity:** Each step of document creation and sending should be explicit and guided.
- **Minimize friction:** Auto-save documents regularly to prevent data loss.
- **Provide confirmation:** Always confirm destructive actions (delete, send).
- **Surface system feedback:** Inform users of send success, backend errors, or connectivity issues.
- **Accessibility:** Ensure compatibility with keyboard navigation and screen readers.
- **Responsiveness:** The interface must function on desktops, tablets, and mobile devices.

---

## ⚙️ Development & Deployment Notes

- Built with **Vue 3 + Quasar** using SPA mode.
- Communicates exclusively with the **Provider Backend**.
- Namespace: `oc-provider`.
- Public URL: `https://provider.on-track.ch/`.
- Deployed via GitHub Actions → Docker → GHCR → Kubernetes.
- Kubernetes manifests: `deployment.yaml`, `service.yaml`, `ingress.yaml` (all must be applied during CI/CD).
- The ingress manages routing:
  - `/` → Provider Frontend
  - `/api/*` → Provider Backend.

---

## Commit Message Rules

```
type(scope): Description
```

Examples:

```
feat(workspace): Add Save to Library button
fix(prescriptions): Prevent sending summary before finalize
refactor(composables): Extract persona state logic from workspace
```

---

## Release Flow

```
git checkout main
git pull
git merge dev
npm version <patch|minor|major>
git push && git push --tags
Create RELEASE-NOTES.md (manual high-level wording)
```
