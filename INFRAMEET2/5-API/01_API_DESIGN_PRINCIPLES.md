# INFRAMEET - API Design Principles

## Standards
- **Wrapper**: Every single JSON response MUST adhere to the following wrapper contract:
  ```json
  {
    "success": true,
    "data": {},
    "error": null
  }
  ```
- **Auth Headers**: Secured routes require standard Bearer token format:
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Rate-Limiting**: Handled in server routes via rate-limiter middleware using Redis or memory cache. Over-limit triggers HTTP code `429 Too Many Requests`.
- **CORS**: Allowed for external web widget scripts strictly on whitelisted domains listed in `widget_installations`.
