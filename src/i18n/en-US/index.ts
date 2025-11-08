export default {
  app: {
    title: 'Provider Workspace',
  },
  layout: {
    workspaceTitle: 'Provider Workspace',
    skipToContent: 'Skip to workspace content',
    menuLabel: 'Toggle navigation',
    betaLabel: 'MVP',
  },
  navigation: {
    title: 'Workspace',
    dashboard: 'Dashboard',
    documentEdit: 'Edit document',
    documentSend: 'Send document',
    settings: 'Settings',
  },
  dashboard: {
    title: 'Dashboard',
    description: 'Track drafts, review send progress, and pick up where you left off.',
    empty: {
      title: 'No documents yet',
      description: 'Create your first draft to start the send workflow.',
      action: 'Start a draft',
    },
  },
  documentEdit: {
    title: 'Edit document',
    subtitle: 'Document ID: {id}',
    placeholder: 'The document editor will live here. Use the navigation to explore other routes.',
  },
  documentSend: {
    title: 'Send document',
    subtitle: 'Send summary for document {id}',
    accessLabel: 'Access code',
    accessHelper: 'Share this code with the recipient to preview the document.',
    placeholder: 'Delivery and confirmation details will surface in this area.',
  },
  documents: {
    status: {
      draft: 'Draft',
      final: 'Final',
    },
    createdAt: 'Created on {date}',
    filterLabel: 'Filter documents',
    filterPlaceholder: 'Search by title',
    loadMore: 'Load more',
  },
  settings: {
    title: 'Workspace settings',
    description: 'Update organisation details, preferences, and feature flags.',
    placeholder: 'Settings forms will be available in a future iteration.',
  },
  notFound: {
    title: 'Page not found',
    message: 'The page you are looking for could not be found.',
    ctaHome: 'Back to dashboard',
  },
  status: {
    loading: 'Loading workspace data...',
  },
  errors: {
    notFound: 'We could not find the requested resource.',
    expired: 'This link has expired.',
    unavailable: 'The workspace is temporarily unavailable. Please try again.',
    invalid: 'Please double-check the information and try again.',
  },
  actions: {
    retry: 'Try again',
  },
  components: {
    confirmDialog: {
      confirm: 'Confirm',
      cancel: 'Cancel',
    },
    copyField: {
      copy: 'Copy',
      copied: 'Copied!',
    },
  },
  a11y: {
    // Skip links
    skipToContent: 'Skip to workspace content',

    // Main layout landmarks
    workspaceNavigation: 'Workspace navigation',
    mainLayout: 'Provider workspace layout',
    headerBar: 'Header toolbar',
    toggleNavigation: 'Toggle navigation menu',
    pageContainer: 'Main content area',
    mainContent: 'Main workspace content',

    // Navigation links
    dashboardLink: 'Go to dashboard',
    documentEditLink: 'Go to document editor',
    documentSendLink: 'Go to document send',
    settingsLink: 'Go to settings',

    // Status indicators
    loading: 'Loading...',
    loadingSpinner: 'Loading indicator',
    loadingMessage: 'Loading message',
    errorIndicator: 'Error indicator',
    errorMessage: 'Error message',

    // Interactive elements
    menuButton: 'Menu button',
    closeButton: 'Close button',
    submitButton: 'Submit button',
    cancelButton: 'Cancel button',

    // Dashboard specific
    documentsList: 'Documents list',
    filterDocuments: 'Filter documents',
    loadMoreDocuments: 'Load more documents',
    emptyStateMessage: 'Empty state message',
    retryLoading: 'Retry loading',
  },
};
