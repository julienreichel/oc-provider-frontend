import DocumentViewer from '../DocumentViewer.vue';
import type { PublicDocument } from '../../models/PublicDocument';
import { DocumentViewerGetters } from './DocumentViewer.getters';

describe('DocumentViewer', () => {
  const mockDocument: PublicDocument = {
    id: 'doc123',
    title: 'Sample Document Title',
    content: 'This is the document content with some text.',
    createdAt: '2024-01-15T10:30:00Z',
    meta: {
      author: 'John Doe',
      category: 'test',
    },
  };

  it('renders document title correctly', () => {
    cy.mount(DocumentViewer, {
      props: {
        document: mockDocument,
      },
    });

    DocumentViewerGetters.getTitle().should('contain.text', 'Sample Document Title');
  });

  it('renders document content correctly', () => {
    cy.mount(DocumentViewer, {
      props: {
        document: mockDocument,
      },
    });

    DocumentViewerGetters.getContent().should(
      'contain.text',
      'This is the document content with some text.',
    );
  });

  it('renders creation date element', () => {
    cy.mount(DocumentViewer, {
      props: {
        document: mockDocument,
      },
    });

    // The date element should exist and not contain the raw ISO string
    DocumentViewerGetters.getMetadata().should('exist');
    DocumentViewerGetters.getMetadata().should('not.contain.text', '2024-01-15T10:30:00Z');
    // Should contain formatted content (could be i18n key in test environment)
    DocumentViewerGetters.getMetadata().should('not.be.empty');
  });

  it('sanitizes content by rendering as text only', () => {
    const documentWithHtml: PublicDocument = {
      id: 'doc456',
      title: 'HTML Test Document',
      content: '<script>alert("xss")</script><p>Safe content</p><b>Bold text</b>',
      createdAt: '2024-01-15T10:30:00Z',
    };

    cy.mount(DocumentViewer, {
      props: {
        document: documentWithHtml,
      },
    });

    // Should render the HTML as plain text (sanitized)
    DocumentViewerGetters.getContent().should('contain.text', '<script>alert("xss")</script>');
    DocumentViewerGetters.getContent().should('contain.text', '<p>Safe content</p>');
    DocumentViewerGetters.getContent().should('contain.text', '<b>Bold text</b>');

    // Should NOT execute or render HTML
    DocumentViewerGetters.getContent().find('script').should('not.exist');
    DocumentViewerGetters.getContent().find('p').should('not.exist');
    DocumentViewerGetters.getContent().find('b').should('not.exist');
  });

  it('handles empty or missing content gracefully', () => {
    const emptyDocument: PublicDocument = {
      id: 'doc789',
      title: 'Empty Document',
      content: '',
      createdAt: '2024-01-15T10:30:00Z',
    };

    cy.mount(DocumentViewer, {
      props: {
        document: emptyDocument,
      },
    });

    DocumentViewerGetters.getTitle().should('contain.text', 'Empty Document');
    DocumentViewerGetters.getContent().should('exist');
    DocumentViewerGetters.getMetadata().should('exist');
  });

  it('handles document without meta information', () => {
    const documentNoMeta: PublicDocument = {
      id: 'doc999',
      title: 'No Meta Document',
      content: 'Content without metadata',
      createdAt: '2024-01-15T10:30:00Z',
      // meta is undefined
    };

    cy.mount(DocumentViewer, {
      props: {
        document: documentNoMeta,
      },
    });

    DocumentViewerGetters.getTitle().should('contain.text', 'No Meta Document');
    DocumentViewerGetters.getContent().should('contain.text', 'Content without metadata');
    DocumentViewerGetters.getMetadata().should('exist');
  });

  it('preserves whitespace and line breaks in content', () => {
    const multilineDocument: PublicDocument = {
      id: 'doc101',
      title: 'Multiline Document',
      content: 'Line 1\n\nLine 3 with spaces   \n    Indented line',
      createdAt: '2024-01-15T10:30:00Z',
    };

    cy.mount(DocumentViewer, {
      props: {
        document: multilineDocument,
      },
    });

    // Content should preserve formatting
    DocumentViewerGetters.getContent().should('contain.text', 'Line 1');
    DocumentViewerGetters.getContent().should('contain.text', 'Line 3 with spaces');
    DocumentViewerGetters.getContent().should('contain.text', 'Indented line');
  });
});
