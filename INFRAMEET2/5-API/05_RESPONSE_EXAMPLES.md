# INFRAMEET - API Response JSON Examples

Below are concrete, actual JSON output payloads for core endpoints under success and failure states.

## 1. Directory Detail Endpoint (`GET /api/entities/:id`)

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "e8a21fd9-9b2f-488f-a9cb-b210f4439c2a",
    "name": "Acme SaaS Corporation",
    "slug": "acme-saas",
    "entity_type": "saas",
    "verification_status": "basic_verified",
    "trust_score": 65.0,
    "metadata_public": {
      "website_url": "https://acme.com",
      "category": "Customer Support Tools",
      "description": "High performance customer service automations."
    },
    "created_at": "2026-05-19T12:00:00Z"
  },
  "error": null
}
```

### Failure Response (Not Found)
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "404_NOT_FOUND",
    "message": "The requested entity does not exist or has been soft-deleted.",
    "details": null
  }
}
```

## 2. Submit Inquiry (`POST /api/inquiries`)

### Success Response
```json
{
  "success": true,
  "data": {
    "inquiry_id": "c1a93b2a-e8d1-419b-b422-901fd4a8b1a2",
    "status": "UNREAD",
    "received_at": "2026-05-19T15:00:23Z"
  },
  "error": null
}
```

### Failure Response (Captcha Failed)
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "400_CAPTCHA_FAILED",
    "message": "Cloudflare Turnstile token validation failed. Please try again.",
    "details": {
      "ip_address": "203.0.113.195",
      "timestamp": "2026-05-19T15:00:23Z"
    }
  }
}
```
