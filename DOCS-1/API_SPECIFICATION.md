# API Specification: Mitra Infrastruktur Platform

**OpenAPI 3.0 Format** | Version 1.0 | Last Updated: May 2026

---

## Executive Summary

Platform terdiri dari **3 API domain utama**:

1. **Projects API** — Intake, SoW generation, contract management, BAST signoff
2. **Payment API** — Invoicing, reconciliation, recurring billing (Xendit)
3. **Content API** — RSS aggregation, directory listings, prestige ratings

Semua endpoints menggunakan **JWT token authentication** via Supabase.

---

## Base URL

```
Production:  https://api.mitra-infrastruktur.id
Development: http://localhost:3000/api
```

---

## Authentication

All endpoints require `Authorization: Bearer <JWT_TOKEN>` header.

**Token Acquisition:**
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 3600,
  "user": { "id": "...", "email": "...", "role": "admin|client|analyst" }
}
```

---

## Domain 1: Projects API

### 1.1 Create Master Brief

**Endpoint:** `POST /api/projects/brief`

**Purpose:** Initial project qualification & requirement capture

**Request Body:**
```json
{
  "client_name": "string (required)",
  "client_email": "string (required, email format)",
  "company": "string",
  "phone": "string",
  "project_type": "enum: web-development | campaign-strategy | document-layout | data-visualization",
  "segment": "enum: enterprise | academic",
  "budget_range": "enum: <50M | 50M-100M | 100M-500M | >500M",
  "timeline_weeks": "integer (2-52)",
  "key_objectives": "string (max 1000 chars)",
  "existing_assets": "string (describe current tools/infrastructure)",
  "decision_maker": "string (nama decision maker)",
  "business_context": "string (background, pain points)"
}
```

**Response:** `201 Created`
```json
{
  "brief_id": "brf_abc123xyz",
  "client_id": "cli_xyz789",
  "status": "pending_sow",
  "created_at": "2026-05-17T10:30:00Z",
  "assigned_to": "staff_id",
  "next_step": "Generate Scope of Work"
}
```

**Validation:**
- `client_email` must be valid email format
- `timeline_weeks` must be 2-52
- `budget_range` must map to pricing tier
- `segment` determines which SoW template is used

**Database:** Inserts into `projects` table with status='pending_sow'

---

### 1.2 Generate Scope of Work (SoW)

**Endpoint:** `POST /api/projects/{brief_id}/generate-sow`

**Purpose:** Auto-generate SoW from brief + pricing rules

**Request Body:**
```json
{
  "scope_items": [
    {
      "category": "string (e.g., 'Design', 'Development', 'Content')",
      "deliverable": "string (e.g., 'Homepage Design Mockup')",
      "quantity": "integer",
      "unit_price": "integer (in IDR)",
      "notes": "string (optional)"
    }
  ],
  "discount_percent": "integer (0-100, optional)",
  "payment_terms": "enum: 50-50 | 30-70 | upfront",
  "revision_limit": "integer (default: 2)",
  "revision_cost": "integer (cost per revision in IDR)"
}
```

**Response:** `200 OK`
```json
{
  "sow_id": "sow_def456",
  "brief_id": "brf_abc123xyz",
  "total_amount": 5000000,
  "currency": "IDR",
  "scope_items": [ /* array of items with pricing */ ],
  "payment_schedule": [
    { "phase": "DP (Deposit)", "amount": 2500000, "due_date": "2026-05-24" },
    { "phase": "Pelunasan", "amount": 2500000, "due_date": "2026-06-07" }
  ],
  "revision_policy": {
    "limit": 2,
    "cost_per_revision": 500000
  },
  "generated_at": "2026-05-17T11:00:00Z",
  "document_url": "https://api.mitra-infrastruktur.id/documents/sow_def456.docx"
}
```

**Business Logic:**
- Calculates total price from scope_items
- Applies discount_percent if provided
- Splits payment per payment_terms (DP default 50%)
- Generates DOCX file (downloadable)
- Marks project status as 'sow_ready'

---

### 1.3 Create Contract

**Endpoint:** `POST /api/projects/{brief_id}/contracts`

**Purpose:** Generate & sign contract (Kemitraan, IP rights, revision pricing)

**Request Body:**
```json
{
  "sow_id": "sow_def456",
  "contract_type": "enum: kemitraan | service | retainer",
  "include_sections": [
    "scope_of_work",
    "intellectual_property",
    "revision_pricing",
    "payment_terms",
    "confidentiality",
    "warranty"
  ],
  "custom_clauses": "string (optional, additional terms)",
  "client_signatory_name": "string",
  "client_signatory_title": "string"
}
```

**Response:** `201 Created`
```json
{
  "contract_id": "cnt_ghi789",
  "brief_id": "brf_abc123xyz",
  "sow_id": "sow_def456",
  "contract_type": "kemitraan",
  "status": "pending_signature",
  "document_url": "https://api.mitra-infrastruktur.id/documents/cnt_ghi789.docx",
  "signature_links": {
    "client": "https://app.mitra-infrastruktur.id/sign/cnt_ghi789?role=client",
    "company": "https://app.mitra-infrastruktur.id/sign/cnt_ghi789?role=company"
  },
  "created_at": "2026-05-17T11:30:00Z"
}
```

**Document Generation:**
- Pulls contract template from templates table
- Substitutes variables: {{sow_items}}, {{total_amount}}, {{payment_schedule}}
- Generates DOCX with signature blocks
- Stores in Supabase storage

---

### 1.4 Sign Contract (E-Signature)

**Endpoint:** `POST /api/contracts/{contract_id}/sign`

**Purpose:** Record signature + unlock project execution

**Request Body:**
```json
{
  "signature_token": "string (from signature_links)",
  "signed_by_name": "string",
  "signed_by_email": "string",
  "ip_address": "string",
  "timestamp": "ISO8601 datetime"
}
```

**Response:** `200 OK`
```json
{
  "contract_id": "cnt_ghi789",
  "status": "fully_signed",
  "signed_at": "2026-05-17T12:00:00Z",
  "signed_by": [
    { "role": "client", "name": "...", "timestamp": "..." },
    { "role": "company", "name": "...", "timestamp": "..." }
  ],
  "next_step": "Initiate Project & Issue Invoice"
}
```

**Triggers:**
- Updates `contracts` table status = 'fully_signed'
- Updates `projects` table status = 'active'
- Triggers invoice generation (see Payment API)

---

### 1.5 Submit BAST (Berita Acara Serah Terima)

**Endpoint:** `POST /api/projects/{project_id}/bast`

**Purpose:** QA checklist + project completion signoff

**Request Body:**
```json
{
  "qa_checklist": [
    {
      "item": "string (e.g., 'Homepage fully responsive')",
      "status": "enum: passed | failed | not_applicable",
      "notes": "string (optional)"
    }
  ],
  "deliverables_checklist": [
    {
      "deliverable": "string (e.g., 'Final source code')",
      "delivered": "boolean",
      "delivery_method": "enum: email | drive | github | server_access",
      "location": "string (URL/path)"
    }
  ],
  "client_acceptance": "boolean (true = client accepts deliverables)",
  "signed_by_client": "string (name & date)"
}
```

**Response:** `201 Created`
```json
{
  "bast_id": "bst_jkl012",
  "project_id": "prj_mno345",
  "status": "pending_signature",
  "qa_summary": {
    "total_items": 15,
    "passed": 15,
    "failed": 0,
    "passed_percent": 100
  },
  "document_url": "https://api.mitra-infrastruktur.id/documents/bst_jkl012.docx",
  "signature_url": "https://app.mitra-infrastruktur.id/sign-bast/bst_jkl012",
  "created_at": "2026-05-17T15:00:00Z"
}
```

**Business Logic:**
- Generates DOCX with checklist items
- QA must pass 100% for acceptance (or custom threshold)
- Upon client signature, triggers:
  - Project status = 'completed'
  - Invoice final payment = released (if using invoice-based workflow)
  - Stores BAST in audit log

---

## Domain 2: Payment API

### 2.1 Create Invoice (Xendit Integration)

**Endpoint:** `POST /api/invoices`

**Purpose:** Generate invoice tied to SoW + payment schedule

**Request Body:**
```json
{
  "project_id": "prj_mno345",
  "sow_id": "sow_def456",
  "amount_idr": "integer",
  "due_date": "YYYY-MM-DD",
  "invoice_type": "enum: deposit | progress | final",
  "items": [
    {
      "description": "string",
      "quantity": "integer",
      "unit_price": "integer",
      "amount": "integer"
    }
  ],
  "client_email": "string",
  "notes": "string (optional)"
}
```

**Response:** `201 Created`
```json
{
  "invoice_id": "inv_pqr678",
  "xendit_invoice_id": "invoice_xxxx",
  "amount_idr": 2500000,
  "status": "pending",
  "payment_link": "https://checkout.xendit.co/web/...",
  "qr_code_url": "https://api.xendit.co/qr/...",
  "bank_transfer_details": {
    "bank_code": "bca",
    "account_number": "...",
    "account_name": "PT Mitra Infrastruktur"
  },
  "due_date": "2026-05-24T23:59:59Z",
  "invoice_number": "INV-2026-001-DP",
  "created_at": "2026-05-17T11:30:00Z",
  "webhook_url": "https://api.mitra-infrastruktur.id/webhooks/xendit"
}
```

**Integrations:**
- Calls Xendit API to create invoice
- Stores in `invoices` table
- Sends invoice_link to client via email (optional)
- Sets up webhook listener for payment confirmation

---

### 2.2 Payment Webhook (Xendit)

**Endpoint:** `POST /api/webhooks/xendit`

**Purpose:** Receive payment status updates from Xendit

**Headers:**
```
X-Xendit-Webhook-Token: (verify against env var)
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": "invoice_xxxx",
  "user_id": "user_id",
  "external_id": "external_invoice_id",
  "status": "PAID | PENDING | EXPIRED",
  "merchant_name": "PT Mitra Infrastruktur",
  "amount": 2500000,
  "paid_amount": 2500000,
  "paid_at": "2026-05-20T10:30:00Z",
  "payment_method": "BANK_TRANSFER | CREDIT_CARD | ...",
  "payment_channel": "BCA | ...",
  "description": "..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Payment recorded",
  "invoice_id": "inv_pqr678",
  "new_status": "paid"
}
```

**Processing Logic:**
1. Verify `X-Xendit-Webhook-Token` signature
2. Update `invoices` table: status='paid', paid_at=now()
3. If all invoices for project are paid → unlock next phase:
   - If invoice_type='deposit' → unlock SoW execution
   - If invoice_type='final' → unlock BAST & project completion
4. Send payment confirmation email to client + internal team
5. Log transaction in audit table

---

### 2.3 Reconciliation & Revenue Tracking

**Endpoint:** `GET /api/invoices/reconciliation?month=2026-05`

**Purpose:** Monthly revenue reconciliation report

**Response:** `200 OK`
```json
{
  "period": "2026-05",
  "summary": {
    "total_invoiced": 50000000,
    "total_paid": 45000000,
    "outstanding": 5000000,
    "payment_rate": 90
  },
  "by_segment": {
    "enterprise": {
      "invoiced": 35000000,
      "paid": 33000000,
      "outstanding": 2000000
    },
    "academic": {
      "invoiced": 15000000,
      "paid": 12000000,
      "outstanding": 3000000
    }
  },
  "by_payment_method": {
    "bank_transfer": 35000000,
    "credit_card": 8000000,
    "e_wallet": 2000000
  },
  "aged_receivables": {
    "current": 3000000,
    "30_days_overdue": 1500000,
    "60_days_overdue": 500000
  },
  "invoices": [
    {
      "invoice_id": "inv_pqr678",
      "project_id": "prj_mno345",
      "amount": 2500000,
      "status": "paid",
      "paid_at": "2026-05-20T10:30:00Z"
    }
  ]
}
```

**Query Parameters:**
- `month` — YYYY-MM format (required)
- `segment` — 'enterprise' | 'academic' | 'all' (optional)
- `status` — 'paid' | 'pending' | 'overdue' | 'all' (optional)

---

### 2.4 Retainer Billing (Recurring)

**Endpoint:** `POST /api/retainers/{project_id}/setup`

**Purpose:** Setup recurring monthly billing (maintenance, SEO, ads)

**Request Body:**
```json
{
  "client_id": "cli_xyz789",
  "monthly_amount_idr": 5000000,
  "start_date": "2026-06-01",
  "billing_day": "1",
  "services": [
    "server_maintenance",
    "seo_monitoring",
    "paid_advertising",
    "monthly_report"
  ],
  "auto_charge": "boolean (true = auto-charge via stored payment method)"
}
```

**Response:** `201 Created`
```json
{
  "retainer_id": "rtn_stu901",
  "client_id": "cli_xyz789",
  "monthly_amount": 5000000,
  "status": "active",
  "billing_start": "2026-06-01",
  "next_billing_date": "2026-06-01",
  "auto_charge": true,
  "services": [ /* array */ ],
  "created_at": "2026-05-17T12:00:00Z"
}
```

**Automation:**
- Cron job runs on billing_day to generate new invoices
- If auto_charge=true, attempts automatic payment via stored payment method
- Sends invoice notification email

---

## Domain 3: Content API

### 3.1 RSS Aggregator Service

**Endpoint:** `GET /api/content/feeds`

**Purpose:** Fetch aggregated, filtered RSS content for topical authority

**Query Parameters:**
```
category=technology|marketing|ai|design (comma-separated)
limit=10
offset=0
sort_by=published_at|relevance
source_filter=global|premium (optional)
```

**Response:** `200 OK`
```json
{
  "total": 150,
  "limit": 10,
  "offset": 0,
  "items": [
    {
      "id": "rss_vwx234",
      "title": "Latest AI Breakthroughs in 2026",
      "source": "TechCrunch",
      "source_url": "https://techcrunch.com/...",
      "published_at": "2026-05-17T08:00:00Z",
      "content_summary": "string (max 300 chars)",
      "category": "ai",
      "relevance_score": 0.92,
      "image_url": "https://...",
      "read_more_url": "https://..."
    }
  ],
  "featured": [
    /* top 3 items by relevance */
  ]
}
```

**Backend Logic:**
- Cron job runs every 6 hours to fetch from subscribed RSS feeds
- Filters by keyword relevance (using Groq/Gemini NLP)
- Stores in `rss_items` table
- Removes duplicates by comparing content hash
- Ranks by relevance score

---

### 3.2 Tech Directory (Tool & Affiliate Engine)

**Endpoint:** `GET /api/content/tools-directory`

**Purpose:** Curated list of SaaS/tools with affiliate links + sponsorship data

**Query Parameters:**
```
category=development|design|marketing|analytics|database (comma-separated)
sort_by=popularity|rating|price
```

**Response:** `200 OK`
```json
{
  "total": 45,
  "items": [
    {
      "id": "tool_yza567",
      "name": "Next.js",
      "category": "development",
      "description": "React framework for production",
      "logo_url": "https://...",
      "website": "https://nextjs.org",
      "pricing": "Free, Pro: $10/mo",
      "affiliate_link": "https://aff.nextjs.org/...",
      "sponsor_status": "featured" | "standard" | "none",
      "rating": {
        "performance": 98,
        "ease_of_use": 92,
        "documentation": 95,
        "community": 90
      },
      "team_used": true,
      "tags": ["frontend", "ssr", "seo"]
    }
  ]
}
```

**Monetization:**
- Affiliate links earn commission on referred signups/subscriptions
- Sponsorship slots (3-5 tools) appear at top, marked "Sponsor"
- Commission tracking via unique UTM parameters

---

### 3.3 Prestige Directory & Vector Ratings

**Endpoint:** `GET /api/content/portfolio`

**Purpose:** Case studies with granular attribute ratings (not star-based)

**Query Parameters:**
```
segment=enterprise|academic
sort_by=completion_date|client_satisfaction|budget
```

**Response:** `200 OK`
```json
{
  "total": 18,
  "items": [
    {
      "id": "case_bcd890",
      "client_name": "PT Innovasi Digital",
      "project_title": "E-Commerce Platform Redesign",
      "segment": "enterprise",
      "description": "string (max 500 chars)",
      "images": ["url1", "url2"],
      "completion_date": "2026-03-15",
      "metrics": {
        "timeline_accuracy": 95,
        "code_quality": 94,
        "data_precision": 98,
        "client_satisfaction": 96,
        "time_to_delivery": 92
      },
      "deliverables": [
        "Homepage design",
        "Product catalog system",
        "Payment integration",
        "Admin dashboard"
      ],
      "tech_stack": ["Next.js", "Supabase", "Tailwind CSS"],
      "bast_id": "bst_jkl012",
      "verified": true
    }
  ]
}
```

**Rating System:**
- 5 dimensions: Timeline Accuracy, Code Quality, Data Precision, Client Satisfaction, Speed
- Each rated 0-100 based on BAST data + client feedback
- Portfolio only shows projects with BAST verification

---

## Error Handling

All endpoints return consistent error format:

```json
{
  "error": true,
  "code": "INVALID_REQUEST | UNAUTHORIZED | NOT_FOUND | SERVER_ERROR",
  "message": "Human-readable error message",
  "details": {
    "field": "error detail"
  },
  "timestamp": "2026-05-17T10:30:00Z"
}
```

**HTTP Status Codes:**
- `200` — Success
- `201` — Resource created
- `400` — Bad request (validation error)
- `401` — Unauthorized (invalid/missing token)
- `403` — Forbidden (insufficient permissions)
- `404` — Not found
- `409` — Conflict (duplicate resource)
- `500` — Server error

---

## Rate Limiting

- Free tier: 100 requests/hour
- Pro tier: 1000 requests/hour
- Enterprise: Unlimited (custom agreements)

Rate limit info in response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1726527600
```

---

## Webhooks Summary

| Event | Endpoint | Payload |
|-------|----------|---------|
| `payment.success` | `POST /webhooks/xendit` | Invoice paid, amount, timestamp |
| `contract.signed` | `POST /webhooks/contracts` | Contract ID, signer, timestamp |
| `project.completed` | `POST /webhooks/projects` | Project ID, BAST ID, status |
| `rss.update` | Internal cron | New feeds fetched & stored |

---

## API Versioning

- Current: `v1` (in URLs: `/api/v1/projects`)
- Breaking changes trigger new major version
- Deprecated endpoints: 6-month notice before removal

---

## Reference Implementation

Full OpenAPI YAML file available at: `docs/openapi.yaml`

Import into Postman:
```bash
curl -X POST https://api.postman.com/apis \
  -H "X-API-Key: <postman-api-key>" \
  -F "schema=@docs/openapi.yaml"
```

---

**Last Updated:** May 17, 2026  
**Status:** Ready for Implementation  
**Maintainer:** Devapenseo
