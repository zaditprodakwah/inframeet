# Legal & Operations Templates

**Execution Guide for Project Management** | Version 1.0 | May 2026

---

## Overview

Platform menggunakan **template-based generation** untuk:
1. **Master Brief** — Initial client qualification
2. **Scope of Work (SoW)** — Deliverables + pricing
3. **Contracts** — Legal agreements (Kemitraan, Service, Retainer)
4. **BAST** — Project completion signoff

Semua templates dirender menjadi DOCX via Supabase Storage + template engine (e.g., Handlebars, node-docx).

---

## 1. MASTER BRIEF

### Purpose
Capture client requirements, validate fit, qualify project before SoW generation.

### Key Information Collected

```json
{
  "client_name": "PT Innovasi Digital",
  "client_email": "contact@innovasi.id",
  "company": "PT Innovasi Digital",
  "phone": "+62-274-123456",
  "website": "https://innovasi.id",
  
  "project_type": "web-development",
  "segment": "enterprise",
  "budget_range": "100M-500M",
  "timeline_weeks": 8,
  
  "key_objectives": "Redesign e-commerce platform untuk meningkatkan conversion rate & user experience",
  "existing_assets": "Current platform: Shopify + custom plugins, AWS hosting, PostgreSQL database",
  
  "decision_maker": {
    "name": "Bambang Sutrisno",
    "title": "CTO",
    "email": "bambang@innovasi.id",
    "phone": "+62-812-3456789"
  },
  
  "business_context": "Growing DTC brand, current platform bottleneck, need faster checkout & mobile optimization",
  
  "qualification": {
    "estimated_complexity": "high",
    "team_required": ["senior-developer", "designer", "qa"],
    "estimated_hours": 320,
    "fit_assessment": "good_fit"
  }
}
```

### DOCX Template Structure

**File:** `templates/master-brief-template.docx`

```
═══════════════════════════════════════════════════════════
  MASTER BRIEF - PROJECT QUALIFICATION DOCUMENT
═══════════════════════════════════════════════════════════

Date: {{date}}
Brief ID: {{brief_id}}
Prepared for: {{client_name}}

──────────────────────────────────────────────────────────
1. CLIENT INFORMATION
──────────────────────────────────────────────────────────

Name:                {{client_name}}
Email:               {{client_email}}
Company:             {{company}}
Phone:               {{phone}}
Website:             {{website}}
Decision Maker:      {{decision_maker.name}} ({{decision_maker.title}})

──────────────────────────────────────────────────────────
2. PROJECT OVERVIEW
──────────────────────────────────────────────────────────

Project Type:        {{project_type}}
Segment:             {{segment}}
Budget Range:        {{budget_range}}
Timeline:            {{timeline_weeks}} weeks

Key Objectives:
{{key_objectives}}

Existing Assets & Infrastructure:
{{existing_assets}}

Business Context:
{{business_context}}

──────────────────────────────────────────────────────────
3. QUALIFICATION ASSESSMENT
──────────────────────────────────────────────────────────

Estimated Complexity:   {{estimated_complexity}}
Required Team:          {{team_required}}
Estimated Hours:        {{estimated_hours}}
Fit Assessment:         {{fit_assessment}}

Recommendation:
✓ Proceed to SoW generation
✗ Request additional information
✗ Defer to next quarter

──────────────────────────────────────────────────────────
4. NEXT STEPS & APPROVAL
──────────────────────────────────────────────────────────

Reviewed by: {{reviewed_by_staff_name}}
Date:        {{reviewed_date}}
Status:      {{status}}

Notes:
{{approval_notes}}

═══════════════════════════════════════════════════════════
```

### JSON Schema (for API validation)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "Master Brief",
  "properties": {
    "client_name": { "type": "string", "minLength": 3 },
    "client_email": { "type": "string", "format": "email" },
    "company": { "type": "string" },
    "phone": { "type": "string", "pattern": "^\\+?[0-9\\-\\s()]+$" },
    "project_type": {
      "type": "string",
      "enum": ["web-development", "campaign-strategy", "document-layout", "data-visualization"]
    },
    "segment": { "type": "string", "enum": ["enterprise", "academic"] },
    "budget_range": {
      "type": "string",
      "enum": ["<50M", "50M-100M", "100M-500M", ">500M"]
    },
    "timeline_weeks": {
      "type": "integer",
      "minimum": 2,
      "maximum": 52
    },
    "key_objectives": { "type": "string", "maxLength": 1000 },
    "existing_assets": { "type": "string" },
    "decision_maker": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "title": { "type": "string" },
        "email": { "type": "string", "format": "email" },
        "phone": { "type": "string" }
      },
      "required": ["name", "title", "email"]
    }
  },
  "required": ["client_name", "client_email", "project_type", "segment", "budget_range", "timeline_weeks"]
}
```

---

## 2. SCOPE OF WORK (SoW)

### Purpose
Detailed breakdown of deliverables, pricing, revision policy, payment schedule.

### JSON Structure (for dynamic generation)

```json
{
  "sow_id": "sow_def456",
  "brief_id": "brf_abc123xyz",
  "client_name": "PT Innovasi Digital",
  "project_title": "E-Commerce Platform Redesign",
  
  "scope_items": [
    {
      "line_number": 1,
      "category": "Design",
      "deliverable": "Homepage & Landing Page Redesign",
      "quantity": 1,
      "unit_price": 10000000,
      "notes": "Desktop & mobile responsive, Figma files included"
    },
    {
      "line_number": 2,
      "category": "Development",
      "deliverable": "Product Listing Page Implementation",
      "quantity": 1,
      "unit_price": 15000000,
      "notes": "React component, integrated with existing backend"
    },
    {
      "line_number": 3,
      "category": "Development",
      "deliverable": "Checkout Flow Optimization",
      "quantity": 1,
      "unit_price": 20000000,
      "notes": "4-step checkout, payment gateway integration (Xendit)"
    },
    {
      "line_number": 4,
      "category": "QA & Testing",
      "deliverable": "User Acceptance Testing & Bug Fixes",
      "quantity": 1,
      "unit_price": 5000000,
      "notes": "Cross-browser testing, performance optimization"
    }
  ],
  
  "subtotal": 50000000,
  "discount_percent": 0,
  "total_amount": 50000000,
  
  "payment_schedule": [
    {
      "phase": "DP (Deposit)",
      "percent": 50,
      "amount": 25000000,
      "due_date": "2026-05-24"
    },
    {
      "phase": "Pelunasan (Final Payment)",
      "percent": 50,
      "amount": 25000000,
      "due_date": "2026-07-05"
    }
  ],
  
  "revision_policy": {
    "included_revisions": 2,
    "cost_per_additional_revision": 500000
  },
  
  "terms": {
    "timeline_start": "2026-05-24",
    "timeline_end": "2026-07-05",
    "payment_method": "Bank Transfer / Invoice (via Xendit)",
    "warranty_period": "14 days post-handover"
  }
}
```

### DOCX Template

**File:** `templates/sow-template.docx`

```
═══════════════════════════════════════════════════════════
      SCOPE OF WORK (SoW) - PROJECT EXECUTION DOCUMENT
═══════════════════════════════════════════════════════════

SoW ID:          {{sow_id}}
Brief ID:        {{brief_id}}
Project Title:   {{project_title}}
Client:          {{client_name}}
Date:            {{date}}

──────────────────────────────────────────────────────────
1. SCOPE SUMMARY
──────────────────────────────────────────────────────────

This document outlines the scope of work, deliverables, pricing,
and terms for {{project_title}}.

Timeline:        {{terms.timeline_start}} to {{terms.timeline_end}}
Duration:        {{duration_weeks}} weeks
Total Budget:    IDR {{total_amount}} ({{currency}})

──────────────────────────────────────────────────────────
2. DELIVERABLES & PRICING
──────────────────────────────────────────────────────────

| # | Category    | Deliverable                    | Qty | Unit Price | Total      |
|---|-------------|--------------------------------|-----|------------|------------|
{{#each scope_items}}
| {{line_number}} | {{category}} | {{deliverable}} | {{quantity}} | IDR {{unit_price}} | IDR {{total_price}} |
{{/each}}

──────────────────────────────────────────────────────────
3. FINANCIAL SUMMARY
──────────────────────────────────────────────────────────

Subtotal:                    IDR {{subtotal}}
Discount ({{discount_percent}}%):       IDR {{discount_amount}}
──────────────────────────────────────────
NET TOTAL:                   IDR {{total_amount}}

──────────────────────────────────────────────────────────
4. PAYMENT SCHEDULE
──────────────────────────────────────────────────────────

{{#each payment_schedule}}
Phase {{@index}}: {{phase}}
  Amount:    IDR {{amount}}
  Due Date:  {{due_date}}
  
{{/each}}

Payment Method: {{terms.payment_method}}
Warranty Period: {{terms.warranty_period}}

──────────────────────────────────────────────────────────
5. REVISION POLICY
──────────────────────────────────────────────────────────

Included Revisions:    {{revision_policy.included_revisions}}
Additional Revisions:  IDR {{revision_policy.cost_per_additional_revision}} per revision

Revisions cover:
• Design mockups & iterations
• Code modifications (non-architectural)
• Content adjustments
• Bug fixes

Excluded:
• Scope changes beyond original deliverables
• Third-party service integrations (separate quotes)

──────────────────────────────────────────────────────────
6. TERMS & CONDITIONS
──────────────────────────────────────────────────────────

✓ Timeline adherence based on approved brief & no scope changes
✓ Client to provide timely feedback (max 2 days per revision round)
✓ Deliverables subject to BAST (Berita Acara Serah Terima) signoff
✓ 14-day post-delivery warranty for bug fixes

──────────────────────────────────────────────────────────
7. APPROVAL & ACCEPTANCE
──────────────────────────────────────────────────────────

Client Signature:  ________________________  Date: __________
                   {{client_signatory_name}}

Company Signature: ________________________  Date: __________
                   {{company_signatory_name}}

═══════════════════════════════════════════════════════════
```

---

## 3. CONTRACTS

### 3.1 Contract Type: KEMITRAAN (Partnership)

**Purpose:** Long-term partnership with IP rights clarity, revision costing, retainer provisions.

**DOCX Template Structure:**

```
═══════════════════════════════════════════════════════════
    KONTRAK KEMITRAAN (PARTNERSHIP AGREEMENT)
                 Indonesian Legal Template
═══════════════════════════════════════════════════════════

Kontrak No: {{contract_id}}
Tanggal:    {{date}}

──────────────────────────────────────────────────────────
PIHAK-PIHAK
──────────────────────────────────────────────────────────

PIHAK PERTAMA (Client):
  Nama:        {{client_name}}
  Alamat:      {{client_address}}
  Diwakili oleh: {{client_signatory_name}} ({{client_signatory_title}})

PIHAK KEDUA (Service Provider):
  Nama:        PT Mitra Infrastruktur & Pertumbuhan Digital
  Alamat:      Cirebon, West Java, Indonesia
  Diwakili oleh: {{company_signatory_name}} ({{company_signatory_title}})

──────────────────────────────────────────────────────────
RECITAL (DASAR PERTIMBANGAN)
──────────────────────────────────────────────────────────

WHEREAS, PIHAK PERTAMA requires {{project_type}} services;
WHEREAS, PIHAK KEDUA is qualified to deliver such services;
WHEREAS, both parties agree to the terms herein;

NOW THEREFORE, the parties agree as follows:

──────────────────────────────────────────────────────────
PASAL 1: SCOPE OF WORK
──────────────────────────────────────────────────────────

Pihak Kedua akan menyediakan layanan sebagai berikut:

{{#each scope_items}}
• {{deliverable}} — IDR {{unit_price}}
{{/each}}

Total Kontrak: IDR {{total_amount}}

──────────────────────────────────────────────────────────
PASAL 2: HAK KEKAYAAN INTELEKTUAL (INTELLECTUAL PROPERTY)
──────────────────────────────────────────────────────────

2.1 Ownership
    Semua deliverables (design files, code, documentation) akan
    menjadi milik PIHAK PERTAMA setelah pembayaran final (Pasal 3).

2.2 Pre-Existing IP
    Pihak Kedua mempertahankan hak atas tools, templates, dan 
    methodologies yang dikembangkan sebelumnya.

2.3 Third-Party IP
    Pihak Kedua tidak bertanggung jawab atas pelanggaran IP 
    pihak ketiga pada deliverables yang melebihi scope.

──────────────────────────────────────────────────────────
PASAL 3: PEMBAYARAN & JADWAL
──────────────────────────────────────────────────────────

3.1 Ringkasan Pembayaran:
{{#each payment_schedule}}
    {{phase}}: IDR {{amount}} (due {{due_date}})
{{/each}}

3.2 Metode Pembayaran:
    Bank Transfer atau Invoice (via Xendit payment gateway)

3.3 Keterlambatan Pembayaran:
    Pembayaran yang terlambat akan dikenakan bunga 1% per minggu,
    maksimal 10% dari total kontrak.

──────────────────────────────────────────────────────────
PASAL 4: KEBIJAKAN REVISI
──────────────────────────────────────────────────────────

4.1 Included Revisions: {{revision_policy.included_revisions}} putaran revisi
4.2 Additional Revisions: IDR {{revision_policy.cost_per_additional_revision}} per putaran

Revisi mencakup:
• Modifikasi design & layout
• Perubahan kode (non-architectural)
• Optimisasi konten

Tidak termasuk:
• Perubahan scope fundamental
• Integrasi third-party services
• Infrastructure/deployment changes (quote terpisah)

──────────────────────────────────────────────────────────
PASAL 5: TIMELINE & DELIVERABLES
──────────────────────────────────────────────────────────

5.1 Tanggal Mulai: {{timeline_start}}
5.2 Tanggal Target Selesai: {{timeline_end}}
5.3 BAST (Berita Acara Serah Terima): Required sebelum dana final dilepas

──────────────────────────────────────────────────────────
PASAL 6: CONFIDENTIALITY & NDA
──────────────────────────────────────────────────────────

Kedua belah pihak setuju untuk merahasiakan informasi klien,
termasuk business strategy, financial data, dan source code,
kecuali dengan persetujuan tertulis.

──────────────────────────────────────────────────────────
PASAL 7: TERMINATION & LIABILITY
──────────────────────────────────────────────────────────

7.1 Either party may terminate with 14-day written notice
7.2 Upon termination, all paid work shall be delivered within 5 days
7.3 Liability capped at total contract value

──────────────────────────────────────────────────────────
PASAL 8: DISPUTE RESOLUTION
──────────────────────────────────────────────────────────

Disputes shall be resolved through:
1. Negotiation (14 days)
2. Mediation (if negotiation fails)
3. Arbitration under Indonesian law

──────────────────────────────────────────────────────────
SIGNATURES
──────────────────────────────────────────────────────────

PIHAK PERTAMA (Client):

Nama: {{client_signatory_name}}
Jabatan: {{client_signatory_title}}
Signature: ________________________  Date: {{client_signed_date}}


PIHAK KEDUA (Service Provider):

Nama: {{company_signatory_name}}
Jabatan: {{company_signatory_title}}
Signature: ________________________  Date: {{company_signed_date}}

═══════════════════════════════════════════════════════════
```

### 3.2 Contract Type: SERVICE (Simple Service Agreement)

Simplified version untuk project kecil atau academic segment.

### 3.3 Contract Type: RETAINER (Monthly Maintenance)

```
═══════════════════════════════════════════════════════════
           RETAINER AGREEMENT (MONTHLY SERVICES)
═══════════════════════════════════════════════════════════

Services:        {{services}} (e.g., server maintenance, SEO monitoring)
Monthly Fee:     IDR {{monthly_amount_idr}}
Billing Day:     {{billing_day}} setiap bulan
Start Date:      {{start_date}}

Auto-Billing:    {{auto_charge}} (if true, automatic charge via Xendit)

Terms:
• Services deliverable during business hours (9 AM - 6 PM WIB)
• 2-hour SLA for critical issues
• 24-hour SLA for non-critical issues
• Monthly performance report & billing statement

═══════════════════════════════════════════════════════════
```

---

## 4. BAST (Berita Acara Serah Terima)

### Purpose
QA checklist + project completion signoff. Triggers final payment release.

### DOCX Template

```
═══════════════════════════════════════════════════════════
     BERITA ACARA SERAH TERIMA (HANDOVER DOCUMENT)
         Project Completion & QA Verification
═══════════════════════════════════════════════════════════

BAST ID:        {{bast_id}}
Project ID:     {{project_id}}
Project Title:  {{project_title}}
Date:           {{date}}

──────────────────────────────────────────────────────────
1. QA CHECKLIST
──────────────────────────────────────────────────────────

{{#each qa_checklist}}

[{{#if status.passed}}✓{{else}}✗{{/if}}] {{item}}
    Status: {{status}}
    {{#if notes}}Notes: {{notes}}{{/if}}

{{/each}}

Total Items:     {{total_qa_items}}
Passed:          {{passed_qa_items}}
Failed:          {{failed_qa_items}}
Pass Rate:       {{qa_pass_percent}}%

QA Status:       {{qa_status}}

──────────────────────────────────────────────────────────
2. DELIVERABLES HANDOVER
──────────────────────────────────────────────────────────

{{#each deliverables}}

✓ {{deliverable}}
  Delivered via:  {{delivery_method}}
  Location:       {{location}}
  Credentials:    {{#if credentials}}Provided{{else}}N/A{{/if}}

{{/each}}

──────────────────────────────────────────────────────────
3. POST-DELIVERY WARRANTY
──────────────────────────────────────────────────────────

14-day warranty period covers:
• Critical bug fixes (affecting functionality)
• Security patches
• Performance optimization (if <5% decline)

Excluded:
• New feature requests
• Major architectural changes
• Third-party service issues

──────────────────────────────────────────────────────────
4. CLIENT ACCEPTANCE
──────────────────────────────────────────────────────────

☐ All deliverables received and verified
☐ QA items satisfied
☐ No outstanding issues
☐ Ready for production deployment

Client Acceptance:  {{client_accepted}}
Accepted Date:      {{client_accepted_at}}

Client Signature: ________________________  Date: __________
                  {{client_signatory_name}}

Company Signature: ________________________  Date: __________
                   {{company_signatory_name}}

───────────────────────────────────────────────────────────
NOTES & FOLLOW-UP
───────────────────────────────────────────────────────────

{{internal_notes}}

Next Steps:
• Release final payment (if all conditions met)
• Schedule post-launch review (optional)
• Begin retainer services (if applicable)

═══════════════════════════════════════════════════════════
```

---

## Implementation Notes

### Template Engine Selection
- **Node.js:** `handlebars` (for DOCX) or `docxtemplater`
- **Python:** `python-docx` with Jinja2

### DOCX Generation Flow

```
1. User submits form data (JSON)
   ↓
2. Validate against JSON schema
   ↓
3. Query API for template (from Supabase storage)
   ↓
4. Render template with Handlebars/docxtemplater
   ↓
5. Save to Supabase storage (PDF + DOCX)
   ↓
6. Return download URL + send email
```

### Email Notifications

Upon document generation:

**Email to Client:**
```
Subject: Your {{document_type}} is Ready for Review

Hi {{client_name}},

Your {{document_type}} for "{{project_title}}" is ready.

Review here: {{document_url}}

Next steps:
1. Review for accuracy
2. Request changes if needed
3. Sign electronically via {{signature_url}}

Questions? Reply to this email.

Best regards,
Mitra Infrastruktur Team
```

**Email to Internal Team:**
```
Subject: [Internal] {{document_type}} Generated - {{project_title}}

Team,

New document generated for {{project_id}}:
- Type: {{document_type}}
- Client: {{client_name}}
- Status: {{document_status}}

Action required:
- Review & approve before sending to client
- Update project status in dashboard

View: [internal-dashboard-link]
```

---

## Archival & Compliance

All generated documents are:
- Stored in versioned Supabase storage
- Indexed with metadata (project_id, created_date, hash)
- Encrypted at rest
- Audit-logged (who created, when, signature)
- Retained for 7 years (per Indonesia tax law)

---

**Last Updated:** May 17, 2026  
**Status:** Ready for AI Coder Template Engine Implementation
