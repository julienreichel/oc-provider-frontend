# API Reference

All endpoints are prefixed with `/api`. Responses use JSON and standard HTTP status codes.

## Health

| Method | Path      | Description              | Response Example                                    |
| ------ | --------- | ------------------------ | --------------------------------------------------- |
| GET    | `/health` | Liveness check           | `{ "status": "ok", "timestamp": "2025-11-07T..." }` |
| GET    | `/ready`  | Verifies DB connectivity | `{ "status": "ready", "database": "connected" }`    |

## Documents

### Data Model

```json
{
  "id": "uuid",
  "title": "string",
  "content": "string",
  "status": "draft" | "final",
  "accessCode": "string | null",
  "createdAt": "ISO timestamp"
}
```

### Create Document

- **POST** `/documents`
- **Request**
  ```json
  {
    "title": "Sample Draft",
    "content": "Document body..."
  }
  ```
- **Response** `201`
  ```json
  { "id": "doc-123" }
  ```

### Get Document

- **GET** `/documents/{id}`
- **Response** `200`
  ```json
  {
    "id": "doc-123",
    "title": "Sample Draft",
    "content": "Document body...",
    "status": "draft",
    "accessCode": null,
    "createdAt": "2025-11-07T13:45:12.000Z"
  }
  ```

### Update Document

- **PUT** `/documents/{id}`
- Fields are optional; payload can include `title`, `content`, `status`, `accessCode`.
- **Request**
  ```json
  {
    "title": "Updated Title",
    "content": "Updated content",
    "status": "final"
  }
  ```
- **Response** `200` with full document JSON.

### List Documents (Cursor Pagination)

- **GET** `/documents?cursor={cursor}&limit={1-50}`
- **Response** `200`
  ```json
  {
    "items": [
      { "id": "...", "title": "...", "status": "final", ... }
    ],
    "nextCursor": "base64-string-or-null"
  }
  ```

## Send Document

- **POST** `/send`
- Requires the document to be in `final` status and have non-empty content. On success, registers the document with the client backend and stores the returned access code.
- **Request**
  ```json
  { "documentId": "doc-123" }
  ```
- **Response** `200`
  ```json
  { "accessCode": "ABC12345" }
  ```
- **Errors**
  - `400 INVALID_DOCUMENT_STATE` for drafts/invalid payloads.
  - `404 NOT_FOUND` if document does not exist.
  - `502 EXTERNAL_SERVICE_ERROR` if the client backend call fails.
