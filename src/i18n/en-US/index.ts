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
    subtitleNew: 'Create a new document',
    fields: {
      title: 'Title',
      content: 'Content',
      status: 'Status',
    },
    validation: {
      title: 'Title is required',
      content: 'Content is required',
    },
    actions: {
      save: 'Save document',
      create: 'Create document',
      send: 'Send document',
      duplicate: 'Duplicate to draft',
      close: 'Close',
    },
    metadata: {
      id: 'Document ID',
      createdAt: 'Created at',
      accessCode: 'Access code',
    },
    toast: {
      saved: 'Document saved successfully',
      created: 'Document created successfully',
      duplicated: 'Draft copy created',
    },
    lockedMessage: 'This document has already been sent. Create a draft copy to make further edits.',
    duplicateSuffix: '(copy)',
  },
  documentSend: {
    title: 'Send document',
    subtitle: 'Send summary for document {id}',
    accessLabel: 'Access code',
    accessHelper: 'Share this code with the recipient to preview the document.',
    placeholder: 'Delivery and confirmation details will surface in this area.',
    missingCode: 'This page requires a valid access code. Please send the document again.',
    dialog: {
      title: 'Send document to client',
      confirmQuestion: 'Are you sure you want to send this document?',
      requiresFinal: 'Document must be marked as final before sending.',
      confirm: 'Send',
      cancel: 'Cancel',
    },
    result: {
      title: 'Document sent',
      instructions: 'Share this access code with the client so they can view the document.',
    },
    toast: {
      sent: 'Document sent successfully',
    },
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

    // Document edit specific
    documentTitleInput: 'Document title input',
    documentContentInput: 'Document content input',
    documentStatusSelect: 'Document status select',
    saveDocument: 'Save document',
    sendDocument: 'Send document',
    closeDocumentEditor: 'Close document editor',
    documentErrorState: 'Document error state',

    // Document send specific
    sendResultPanel: 'Send result panel',
    documentAccessCode: 'Document access code input',
    copyAccessCode: 'Copy access code',
    sendErrorState: 'Send error state',
    retryAction: 'Retry action',
    backToDashboard: 'Back to dashboard',
    sendConfirmButton: 'Confirm send document',
    sendCancelButton: 'Cancel send document',
    sendConfirmDialog: 'Send document confirmation dialog',
  },
};
