\# INFRAMEET — API CONTRACT \+ ENDPOINT PAYLOADS \+ ZOD SCHEMA INDEX (DOC-8)  
\*\*Version:\*\* v1.0    
\*\*Status:\*\* Engineering Ready (Single Source of Truth)    
\*\*Scope:\*\* Endpoint map, request/response schema, validation rules, error codes, rate limit rules, auth model    
\*\*Audience:\*\* AI Coder / Backend Integrator / Frontend Integrator    
\*\*Goal:\*\* Tidak ada mismatch FE↔BE↔DB. Semua payload, response, dan error code konsisten.

\---

\# 1\) GLOBAL API RULES

\#\# 1.1 API Style  
\- REST-like JSON API  
\- Semua endpoint harus \`application/json\`  
\- Semua request body harus tervalidasi dengan Zod  
\- Semua response wajib memakai envelope standar

\---

\#\# 1.2 Response Envelope Standard (MANDATORY)

\#\#\# Success  
\`\`\`json  
{  
  "ok": true,  
  "data": {},  
  "error": null,  
  "meta": {  
    "request\_id": "uuid",  
    "timestamp": "2026-01-01T00:00:00Z"  
  }  
}

### **Error**

{  
  "ok": false,  
  "data": null,  
  "error": {  
    "code": "VALIDATION\_ERROR",  
    "message": "Invalid payload",  
    "details": {}  
  },  
  "meta": {  
    "request\_id": "uuid",  
    "timestamp": "2026-01-01T00:00:00Z"  
  }  
}

---

## **1.3 Error Code Enum (Single Source)**

* `UNAUTHORIZED`  
* `FORBIDDEN`  
* `NOT_FOUND`  
* `VALIDATION_ERROR`  
* `RATE_LIMITED`  
* `CAPTCHA_FAILED`  
* `CONFLICT`  
* `FEATURE_DISABLED`  
* `INTERNAL_ERROR`

---

## **1.4 Auth Rules**

* Public endpoints: no auth required  
* Owner endpoints: Supabase session required  
* Admin endpoints: Supabase session \+ role check  
* Worker endpoints: must require `INTERNAL_WEBHOOK_SECRET`

---

## **1.5 Feature Flag Rules**

Jika feature flag off:

* return `FEATURE_DISABLED`  
* hide route from UI

---

## **1.6 Rate Limit Rules (Default Contract)**

Rate limit key \= `ip_hash` atau `user_id` sesuai endpoint.

Default:

* inquiry submit: 3 / 10 minutes / ip\_hash  
* claim request: 3 / day / user\_id  
* proof create: 10 / day / user\_id  
* widget event: 1000 / day / installation\_id

---

# **2\) API ROUTE MAP (COMPLETE)**

## **2.1 Public API**

* `GET /api/public/search`  
* `GET /api/public/entity`  
* `GET /api/public/category`  
* `GET /api/public/city`  
* `GET /api/public/updates`  
* `GET /api/public/leaderboard`  
* `POST /api/public/inquiry/submit`

## **2.2 Auth/User API**

* `POST /api/auth/entity/create`  
* `POST /api/auth/entity/list`  
* `POST /api/auth/referral/capture` (optional)

## **2.3 Owner API**

* `POST /api/owner/entity/update`  
* `POST /api/owner/entity/publish` (optional)  
* `POST /api/owner/proof/create`  
* `POST /api/owner/proof/delete`  
* `POST /api/owner/claim/request`  
* `POST /api/owner/widget/create`  
* `POST /api/owner/widget/revoke`  
* `POST /api/owner/inquiry/update-status`

## **2.4 Admin API**

* `GET /api/admin/proofs/pending`  
* `POST /api/admin/proofs/approve`  
* `POST /api/admin/proofs/reject`  
* `GET /api/admin/claims/pending`  
* `POST /api/admin/claims/approve`  
* `POST /api/admin/claims/reject`  
* `POST /api/admin/moderation/flag-entity`  
* `POST /api/admin/moderation/unflag-entity`  
* `GET /api/admin/system-events`  
* `POST /api/admin/feature-flags/set` (optional)

## **2.5 Widget API**

* `GET /embed/widget/[entitySlug].js`  
* `POST /api/widget/event`  
* `POST /api/widget/impression`

## **2.6 Worker Internal API (optional)**

* `POST /api/internal/seo/rebuild-cache`  
* `POST /api/internal/trust/recalculate`  
* `POST /api/internal/dns/check-claims`

---

# **3\) ZOD SCHEMA INDEX (SINGLE FILE CONTRACT)**

AI Coder wajib membuat file:  
`/apps/web/lib/apiSchemas.ts`

## **3.1 Common Schemas**

### **UUID**

* `z.string().uuid()`

### **Slug**

* lowercase  
* dash only  
* max 60

slug: z.string().regex(/^\[a-z0-9\]+(?:-\[a-z0-9\]+)\*$/).max(60)

### **URL**

url: z.string().url()

### **Email**

email: z.string().email()

---

# **4\) ENDPOINT SPECIFICATIONS (REQUEST/RESPONSE)**

---

# **4.1 GET /api/public/search**

Search entity directory (semantic \+ keyword).

## **Query Params**

* `q` string optional  
* `category` string optional  
* `city` string optional  
* `verified` boolean optional  
* `sort` enum optional: `trust_desc | newest | reviews_desc`  
* `page` number default 1  
* `limit` number default 20

## **Response Data**

{  
  "results": \[  
    {  
      "directory\_id": "uuid",  
      "slug": "netizensolusi",  
      "name": "NetizenSolusi",  
      "headline": "SEO & Web Growth",  
      "trust\_score": 62,  
      "verification\_status": "legal\_verified",  
      "city": "Cirebon",  
      "categories": \["seo", "web-development"\]  
    }  
  \],  
  "pagination": {  
    "page": 1,  
    "limit": 20,  
    "total": 120  
  }  
}

## **Notes**

* Public endpoint must use anon supabase key.  
* Must not leak metadata\_private.

---

# **4.2 GET /api/public/entity**

Get public directory profile.

## **Query Params**

* `slug` required

## **Response Data**

{  
  "directory\_id": "uuid",  
  "slug": "netizensolusi",  
  "name": "NetizenSolusi",  
  "entity\_type": "brand",  
  "headline": "SEO & Web Growth",  
  "description": "....",  
  "trust\_score": 62,  
  "verification\_status": "legal\_verified",  
  "proof\_summary": {  
    "approved\_count": 5,  
    "pending\_count": 1  
  },  
  "reviews\_summary": {  
    "count": 12,  
    "avg\_rating": 4.7  
  },  
  "metadata\_public": {},  
  "last\_verified\_at": "ISO\_DATE",  
  "updated\_at": "ISO\_DATE"  
}

---

# **4.3 POST /api/public/inquiry/submit**

Submit inquiry to entity.

## **Rate Limit**

* 3 per 10 min per ip\_hash

## **Body Schema**

{  
  "directory\_slug": "netizensolusi",  
  "sender\_name": "Ahmad",  
  "sender\_email": "a@email.com",  
  "message": "Saya ingin konsultasi SEO.",  
  "topic": "partnership",  
  "budget\_idr": 5000000,  
  "timeline": "2 weeks",  
  "captcha\_token": "turnstile\_token",  
  "utm": {  
    "source": "google",  
    "medium": "organic",  
    "campaign": "brand"  
  }  
}

## **Response Data**

{  
  "inquiry\_id": "uuid",  
  "status": "submitted"  
}

## **Validation Rules**

* message max 2000 chars  
* sender\_name min 2 chars  
* max 3 URLs in message  
* captcha mandatory

---

# **4.4 POST /api/auth/entity/create**

Create new directory entity.

## **Auth**

* required

## **Body Schema**

{  
  "name": "NetizenSolusi",  
  "slug": "netizensolusi",  
  "entity\_type": "brand",  
  "headline": "SEO & Web Growth",  
  "city": "Cirebon",  
  "country": "ID"  
}

## **Response Data**

{  
  "directory\_id": "uuid",  
  "slug": "netizensolusi"  
}

## **Validation Rules**

* slug unique  
* entity\_type enum

---

# **4.5 POST /api/owner/entity/update**

Update entity profile.

## **Auth**

* required (owner)

## **Body Schema**

{  
  "directory\_id": "uuid",  
  "headline": "SEO & Web Growth",  
  "description": "markdown supported",  
  "metadata\_public": {  
    "categories": \["seo"\],  
    "services": \["SEO Audit"\],  
    "location": {  
      "country": "ID",  
      "city": "Cirebon"  
    },  
    "contact": {  
      "whatsapp": "+62..."  
    }  
  },  
  "visibility": {  
    "show\_whatsapp": true,  
    "show\_reviews": true  
  }  
}

## **Response Data**

{  
  "updated": true  
}

## **Notes**

* metadata\_public must match JSON schema DOC-1.  
* owner\_id enforced via RLS.

---

# **4.6 POST /api/owner/proof/create**

Create new proof.

## **Feature Flag**

* FEATURE\_PROOFS must be true

## **Rate Limit**

* 10/day per user

## **Body Schema**

{  
  "directory\_id": "uuid",  
  "proof\_type": "legal\_document",  
  "title": "NIB Perusahaan",  
  "description": "Dokumen legal resmi",  
  "file\_url": "https://cdn.../file.pdf",  
  "source\_url": null,  
  "file\_hash": "sha256hex",  
  "file\_size": 1024000,  
  "mime\_type": "application/pdf",  
  "visibility": "public"  
}

## **Response Data**

{  
  "proof\_id": "uuid",  
  "status": "pending"  
}

## **Rules**

* file\_url OR source\_url required  
* file\_hash required  
* visibility enum: public/private/verifier\_only

---

# **4.7 POST /api/owner/proof/delete**

Delete proof (soft delete recommended).

## **Body Schema**

{  
  "proof\_id": "uuid"  
}

## **Rules**

* owner can delete only if status=pending (recommended)  
* admin can delete any

---

# **4.8 POST /api/owner/claim/request**

Request claim verification.

## **Feature Flag**

* FEATURE\_CLAIMS

## **Body Schema**

{  
  "directory\_id": "uuid",  
  "method": "dns\_txt",  
  "claim\_target": "example.com"  
}

## **Response Data**

{  
  "claim\_id": "uuid",  
  "method": "dns\_txt",  
  "token": "random\_token",  
  "instructions": {  
    "record\_type": "TXT",  
    "host": "\_inframet-claim",  
    "value": "random\_token"  
  }  
}

## **Rules**

* claim\_target must be valid domain/email based on method  
* token expiry default 72 hours

---

# **4.9 POST /api/owner/widget/create**

Create widget installation.

## **Feature Flag**

* FEATURE\_WIDGETS

## **Body Schema**

{  
  "directory\_id": "uuid",  
  "widget\_type": "badge",  
  "domain": "example.com"  
}

## **Response Data**

{  
  "installation\_id": "uuid",  
  "embed\_code": "\<script src=\\"https://.../embed/widget/netizensolusi.js\\" data-token=\\"...\\"\>\</script\>"  
}

## **Rules**

* domain must be normalized  
* optional: only allow if claim verified

---

# **4.10 POST /api/widget/impression**

Widget impression tracking.

## **Auth**

* public (no login)

## **Body Schema**

{  
  "installation\_id": "uuid",  
  "event\_type": "impression",  
  "page\_url": "https://example.com/page",  
  "referrer": "https://google.com",  
  "ua": "user-agent",  
  "ts": "ISO\_DATE",  
  "meta": {  
    "utm\_source": "blog"  
  }  
}

## **Response Data**

{  
  "tracked": true  
}

## **Anti Abuse Rules**

* dedupe by ip\_hash \+ installation\_id \+ day  
* rate limit by installation\_id

---

# **4.11 POST /api/widget/event**

Widget click tracking.

## **Body Schema**

{  
  "installation\_id": "uuid",  
  "event\_type": "click",  
  "page\_url": "https://example.com/page",  
  "target\_url": "https://inframet.xyz/directory/netizensolusi",  
  "ts": "ISO\_DATE",  
  "meta": {  
    "page\_path": "/home"  
  }  
}

## **Response Data**

{  
  "tracked": true  
}

---

# **4.12 GET /api/admin/proofs/pending**

Fetch pending proofs.

## **Auth**

* verifier/admin only

## **Response Data**

{  
  "proofs": \[  
    {  
      "proof\_id": "uuid",  
      "directory\_id": "uuid",  
      "title": "NIB",  
      "proof\_type": "legal\_document",  
      "file\_url": "https://...",  
      "status": "pending",  
      "created\_at": "ISO\_DATE"  
    }  
  \]  
}

---

# **4.13 POST /api/admin/proofs/approve**

Approve proof.

## **Auth**

* verifier/admin only

## **Body Schema**

{  
  "proof\_id": "uuid",  
  "notes": "Valid document",  
  "meta": {  
    "issuer": "Kemenkumham",  
    "confidence\_score": 0.82  
  }  
}

## **Response Data**

{  
  "approved": true,  
  "trust\_score\_updated": true  
}

## **Side Effects**

* set status=approved  
* insert into proof\_reviews  
* insert reputation\_logs  
* call RPC recalculate trust score

---

# **4.14 POST /api/admin/proofs/reject**

Reject proof.

## **Body Schema**

{  
  "proof\_id": "uuid",  
  "reason": "Document unreadable / invalid"  
}

## **Response Data**

{  
  "rejected": true  
}

---

# **4.15 GET /api/admin/claims/pending**

Fetch pending claims.

## **Response Data**

{  
  "claims": \[  
    {  
      "claim\_id": "uuid",  
      "directory\_id": "uuid",  
      "method": "dns\_txt",  
      "claim\_target": "example.com",  
      "status": "pending",  
      "token": "hidden\_or\_masked",  
      "created\_at": "ISO\_DATE"  
    }  
  \]  
}

---

# **4.16 POST /api/admin/claims/approve**

Approve claim.

## **Body Schema**

{  
  "claim\_id": "uuid",  
  "notes": "DNS verified"  
}

## **Response Data**

{  
  "approved": true,  
  "owner\_assigned": true  
}

## **Side Effects**

* update claim status verified  
* set omni\_directory.owner\_id \= requester\_user\_id  
* add trust score reputation event

---

# **4.17 POST /api/admin/claims/reject**

Reject claim.

## **Body Schema**

{  
  "claim\_id": "uuid",  
  "reason": "DNS record mismatch"  
}

---

# **4.18 POST /api/admin/moderation/flag-entity**

Flag entity.

## **Body Schema**

{  
  "directory\_id": "uuid",  
  "reason": "spam / fraud"  
}

## **Response Data**

{  
  "flagged": true  
}

---

# **4.19 POST /api/admin/moderation/unflag-entity**

Unflag entity.

## **Body Schema**

{  
  "directory\_id": "uuid"  
}

---

# **4.20 GET /api/admin/system-events**

Fetch system events.

## **Query Params**

* severity optional: info/warn/error  
* page optional

## **Response Data**

{  
  "events": \[  
    {  
      "event\_id": "uuid",  
      "severity": "warn",  
      "type": "captcha\_failed",  
      "meta": {},  
      "created\_at": "ISO\_DATE"  
    }  
  \]  
}

---

# **5\) ENUM DEFINITIONS (API-LEVEL)**

## **5.1 entity\_type**

* personal  
* brand  
* saas  
* institution

## **5.2 verification\_status**

* unverified  
* basic\_verified  
* legal\_verified  
* academic\_verified  
* premium\_verified  
* flagged

## **5.3 proof\_type**

* legal\_document  
* academic\_profile  
* business\_profile  
* portfolio  
* identity  
* social\_proof  
* escrow\_receipt  
* other

## **5.4 proof\_status**

* pending  
* approved  
* rejected  
* expired  
* deleted

## **5.5 claim\_method**

* email  
* dns\_txt  
* document

## **5.6 claim\_status**

* pending  
* verified  
* rejected  
* expired

## **5.7 inquiry\_status**

* new  
* read  
* archived  
* spam

## **5.8 widget\_type**

* badge  
* mini\_card  
* trust\_bar

## **5.9 widget\_event\_type**

* impression  
* click

---

# **6\) SECURITY CONTRACT (API HARD RULES)**

## **6.1 Captcha Required Endpoints**

* POST /api/public/inquiry/submit  
* POST /api/auth/entity/create (optional strict mode)  
* POST /api/owner/claim/request  
* POST /api/owner/proof/create (optional)

---

## **6.2 Rate Limit Required Endpoints**

* inquiry submit  
* widget event endpoints  
* claim request  
* login abuse (optional)

---

## **6.3 Audit Logging Required**

Admin endpoints wajib insert ke:

* system\_events  
* proof\_reviews / claim\_reviews

---

# **7\) FRONTEND INTEGRATION RULES**

## **7.1 Client Fetch Wrapper**

AI coder harus membuat helper:

* `apiFetch<T>(url, options)`  
  yang otomatis:  
* parse JSON  
* handle ok/error envelope  
* throw typed error

---

## **7.2 UI Error Handling Standard**

Jika error code:

* RATE\_LIMITED → show toast "Terlalu banyak request"  
* CAPTCHA\_FAILED → show "Captcha gagal"  
* FORBIDDEN → redirect /login  
* FEATURE\_DISABLED → show disabled page

---

# **8\) DATABASE INTEGRATION NOTES**

## **8.1 DB Must Provide Views**

Recommended views:

* public\_directory\_profile\_view  
* dashboard\_owner\_summary

API boleh query view untuk menghindari join kompleks.

---

## **8.2 Worker Side Effects**

Worker wajib memproses:

* seo\_page\_cache updates  
* widget\_event\_daily\_stats  
* entity\_updates generation  
* trust\_score recalculation queue

---

# **9\) ACCEPTANCE TEST CASES (MINIMUM)**

## **9.1 Inquiry Submit**

* captcha valid → inserted  
* captcha invalid → CAPTCHA\_FAILED  
* spam repeated → RATE\_LIMITED

## **9.2 Proof Approval**

* proof approved by verifier → trust\_score updated

## **9.3 Claim Verification**

* claim verified → owner\_id updated

## **9.4 Widget Click Tracking**

* dedupe works → unique clicks not inflated

## **9.5 Public Profile Safety**

* metadata\_private never returned

---

# **END OF DOC-8**

