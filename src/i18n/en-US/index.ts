export default {
  // Application
  app: {
    title: 'Document Viewer',
  },

  // Common actions
  failed: 'Action failed',
  success: 'Action was successful',

  // Layout
  layout: {
    title: 'Client Portal',
  },

  // Access page
  access: {
    title: 'Enter Access Code',
    label: 'Access Code',
    placeholder: 'Enter your access code',
    submit: 'View Document',
    instructions: 'Enter the access code you received to view your document.',
    validation: {
      required: 'Please enter an access code',
    },
  },

  // Document viewing
  document: {
    title: 'Document:',
    loading: 'Loading your document',
    error: {
      notFound: "We couldn't find a document with this code. Please check the code and try again.",
      expired: 'This link is no longer available.',
      unavailable: 'The document is temporarily unavailable. Please try again in a moment.',
      invalid: 'Please check the code and try again.',
      unknown: 'Something went wrong. Please try again.',
    },
    retry: 'Try Again',
    createdAt: 'Created on {date}',
    backToHome: 'Enter New Code',
    empty: 'No content available for this document.',
  },

  // Meta information
  meta: {
    title: 'Document Viewer',
    description: 'View shared documents securely',
  },

  // Accessibility labels and instructions
  a11y: {
    skipToMain: 'Skip to main content',
    loading: 'Loading...',
    errorRegion: 'Error message',
    documentViewPage: 'Document view page',
    documentNavigation: 'Document navigation',
    documentContent: 'Document content',
    documentTitle: 'Document title',
    documentMetadata: 'Document metadata',
    emptyDocumentState: 'Empty document state',
    loadingSpinner: 'Loading spinner',
    loadingMessage: 'Loading message',
    errorIndicator: 'Error indicator',
    errorMessage: 'Error message',
    // AccessPage labels
    accessPage: 'Document access page',
    accessForm: 'Document access form',
    accessPageTitle: 'Enter access code',
    accessSubmitButton: 'Submit access code',
    // AccessInput labels
    accessInputField: 'Access code input',
    accessInputError: 'Access code error',
    accessInputLabel: 'Access code label',
  },

  // 404 Not Found page
  notFound: {
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.',
    ctaHome: 'Return Home',
  },
};
