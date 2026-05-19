# INFRAMEET - Implementation Phase Breakdown

This roadmap maps out the build process from project initialization to ultimate staging validation.

---


---
# 🔍 INFRAMEET IMPLEMENTATION GAP ANALYSIS
**Status**: Identifikasi komprehensif dari apa yang kurang  
**Tanggal**: 2025-05-19  
**Berdasarkan**: INFRAMEET.md v6.2 FINAL + 001_inframeet_initial_schema.sql

---

## 📋 RINGKASAN EKSEKUTIF

INFRAMEET memiliki **dokumentasi & schema database yang solid**, tetapi **implementasi code (frontend, backend logic, workers) masih ZERO/MISSING**. 

Berikut breakdown sistematis:

---

## ✅ APA YANG SUDAH ADA

### 1. **Database Schema** (100% Complete)
- [x] 20+ tabel terdefenisi lengkap
- [x] Enum types untuk controlled values
- [x] Foreign keys & constraints
- [x] Indexes untuk performance
- [x] RLS policies skeleton (ada comment, belum full implementation)

**File**: `001_inframeet_initial_schema.sql` (1019 baris)

### 2. **Dokumentasi Produk & Engineering** (95% Complete)
- [x] PRD lengkap (personas, features, acceptance criteria)
- [x] System architecture overview
- [x] Data model & ERD
- [x] Trust score engine rules (detailed)
- [x] Verification system state machine
- [x] Proof system workflow
- [x] Claim system logic
- [x] Inquiry & leads system
- [x] Escrow ledger spec
- [x] Widget growth loop design
- [x] Worker automation requirements
- [x] Anti-abuse layer specification
- [x] Security model (RLS rules)
- [x] Deployment roadmap (13 phases)
- [x] Acceptance criteria / Definition of Done

**File**: `INFRAMEET.md` (14466 baris)

---

## ❌ APA YANG KURANG (CRITICAL)

### **TIER 1: CORE INFRASTRUCTURE (ESSENTIAL untuk MVP)**

#### 1️⃣ **Frontend Application** (0% Complete)
Tidak ada satu pun file Next.js/React.

**Missing:**
```
app/
├── (auth)/
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── forgot-password/page.tsx
│   └── verify-email/page.tsx
├── (public)/
│   ├── page.tsx (homepage)
│   ├── directory/page.tsx (search/listing)
│   ├── [slug]/page.tsx (entity profile)
│   ├── widget/[id]/page.tsx (widget embed)
│   └── terms/privacy/page.tsx
├── (dashboard)/
│   ├── dashboard/page.tsx (user dashboard)
│   ├── [entityId]/settings/page.tsx
│   ├── [entityId]/proofs/page.tsx
│   ├── [entityId]/reviews/page.tsx
│   └── [entityId]/inquiries/page.tsx
├── admin/
│   ├── page.tsx (admin dashboard)
│   ├── proofs/page.tsx (proof approval)
│   ├── claims/page.tsx (claim verification)
│   ├── users/page.tsx
│   └── system/logs/page.tsx
├── api/ (Next.js API Routes - server-side)
│   ├── auth/ (login, signup, etc)
│   ├── entity/ (CRUD operations)
│   ├── proof/ (proof submission, approval)
│   ├── trust-score/ (calculation triggers)
│   ├── inquiry/ (inquiry submission)
│   ├── reviews/ (review submission)
│   ├── widget/ (widget tracking)
│   ├── escrow/ (payment operations)
│   └── admin/ (admin operations)
└── layout.tsx

components/
├── auth/
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   └── ProtectedRoute.tsx
├── entity/
│   ├── EntityCard.tsx
│   ├── EntityProfile.tsx
│   ├── EntityForm.tsx
│   └── EntitySearch.tsx
├── trust/
│   ├── TrustScoreDisplay.tsx
│   ├── ProofUpload.tsx
│   ├── ProofCard.tsx
│   └── ReputationLog.tsx
├── inquiry/
│   ├── InquiryForm.tsx
│   └── InquiryList.tsx
├── reviews/
│   ├── ReviewCard.tsx
│   └── ReviewForm.tsx
├── admin/
│   ├── ProofApprovalPanel.tsx
│   ├── ClaimReviewPanel.tsx
│   ├── UserModerationPanel.tsx
│   └── SystemLogsViewer.tsx
├── widget/
│   ├── TrustBadge.tsx
│   └── WidgetIframe.tsx
└── common/
    ├── Header.tsx
    ├── Footer.tsx
    ├── Navigation.tsx
    └── LoadingSpinner.tsx

lib/
├── supabase.ts (Supabase client config)
├── auth.ts (authentication helpers)
├── trust-score.ts (trust scoring logic - CLIENT HELPER)
├── validation.ts (Zod schemas)
└── api-client.ts (fetch wrapper)

hooks/
├── useAuth.ts
├── useEntity.ts
├── useProof.ts
├── useInquiry.ts
└── useTrustScore.ts

styles/
├── globals.css (Tailwind)
└── animations.css (Framer Motion)

public/
├── logo.svg
├── favicon.ico
├── og-image.png
└── widget-embed.js (widget script)
```

**Why Critical**: 
- Tanpa frontend, users tidak bisa akses platform
- Database aja tidak berguna tanpa UI

---

#### 2️⃣ **Supabase RPC Functions** (5% Complete)
Dokumentasi ada, tetapi **0 baris kode** RPC function.

**Missing RPC Functions** (harus CRITICAL server-authoritative):
```sql
-- TRUST SCORE ENGINE
- calculate_trust_score(entity_id) → DECIMAL
- apply_trust_decay(entity_id) → VOID
- update_trust_score_from_log(entity_id) → VOID

-- PROOF SYSTEM
- approve_proof(proof_id, verifier_id, notes) → VOID
- reject_proof(proof_id, verifier_id, notes) → VOID
- submit_proof(entity_id, proof_type, document_url, description) → UUID

-- CLAIM SYSTEM
- verify_claim(claim_id, verification_token) → VOID
- reject_claim(claim_id, admin_id, reason) → VOID
- request_claim(directory_id, email, claim_type) → UUID

-- REVIEW & VERIFIED BUYER
- submit_review(entity_id, escrow_id, rating, comment) → UUID
- approve_review(review_id, admin_id) → VOID
- flag_review_spam(review_id, reason) → VOID

-- ESCROW OPERATIONS (if enabled)
- create_escrow(directory_id, buyer_id, amount, description) → UUID
- release_escrow(escrow_id, auth_uid) → VOID
- refund_escrow(escrow_id, reason) → VOID
- dispute_escrow(escrow_id, initiator_id, reason) → VOID

-- WIDGET & REFERRAL
- log_widget_event(installation_id, event_type, metadata) → VOID
- aggregate_widget_rewards(entity_id, period) → VOID

-- INQUIRY PROCESSING
- submit_inquiry(entity_id, name, email, message) → UUID
- flag_inquiry_spam(inquiry_id, spam_score) → VOID

-- SPAM & RATE LIMIT
- check_rate_limit(identifier, limit_type) → BOOLEAN
- get_spam_score(inquiry_text, sender_email) → DECIMAL
- add_disposable_domain(domain) → VOID
```

**Why Critical**:
- Ini yang enforce server-authority (uang, badges, trust scores)
- Tidak boleh client-side

---

#### 3️⃣ **Next.js API Routes** (0% Complete)
Server-side logic untuk operasi critical.

**Missing API Routes**:
```
/api/auth/
  POST /register
  POST /login
  POST /logout
  POST /verify-email
  GET /me

/api/entity/
  POST / (create entity)
  GET /:id (fetch entity)
  PUT /:id (update entity)
  DELETE /:id (soft delete)
  GET / (search/list with filters)
  GET /:id/trust-score

/api/proof/
  POST / (submit proof)
  GET /:id
  GET / (list proofs for entity/admin)
  PUT /:id/approve
  PUT /:id/reject

/api/claim/
  POST / (request claim)
  POST /verify (verify with token)
  GET /:id

/api/inquiry/
  POST / (submit inquiry with captcha)
  GET / (list for entity owner)
  PUT /:id/respond
  PUT /:id/flag-spam

/api/review/
  POST / (submit review)
  GET / (list for entity)
  PUT /:id/approve
  PUT /:id/flag-spam

/api/escrow/ (if enabled)
  POST / (create escrow)
  GET /:id
  POST /:id/release
  POST /:id/refund
  POST /:id/dispute

/api/widget/
  GET /:installationId/script (embed code)
  POST /:installationId/event (track event)
  GET /:installationId/rewards

/api/admin/
  GET /proofs/pending
  GET /claims/pending
  GET /users
  GET /system-logs
  POST /user/:id/role
  POST /entity/:id/flag
```

**Why Critical**:
- Middleware untuk auth, RLS enforcement, rate limiting
- Tangkap input sebelum RPC call
- Handle response & error

---

#### 4️⃣ **GitHub Actions Worker Workflows** (0% Complete)
Automation pipeline untuk background jobs.

**Missing Workflow Files** (dalam `.github/workflows/`):
```yaml
1. trust-score-decay.yml
   - Trigger: Cron daily (03:00 UTC)
   - Task: Apply trust score decay from reputation_logs
   - RPC: apply_trust_decay()
   - Notification: Telegram alert jika ada error

2. widget-rewards-aggregation.yml
   - Trigger: Cron daily (04:00 UTC)
   - Task: Aggregate widget_events → rewards
   - Update widget_installations.total_clicks, total_installs
   - Calculate reward pool for each entity

3. spam-scoring-job.yml
   - Trigger: Cron every 6 hours
   - Task: Update spam score untuk inquiry based on patterns
   - Check disposable email domains
   - Flag suspicious inquiries

4. rss-ingestion.yml (optional)
   - Trigger: Cron every 4 hours
   - Task: Fetch RSS feeds, parse, create staging_inbox entries
   - Uses staging_queue untuk processing

5. openai-embedding-generation.yml (optional)
   - Trigger: Cron every 8 hours
   - Task: Generate embeddings untuk description field
   - Uses pgvector untuk semantic search

6. cleanup-jobs.yml
   - Trigger: Cron weekly
   - Task: Delete expired proofs, claims, reset_rate_limits
   - Archive old reputation logs

7. monitoring-heartbeat.yml
   - Trigger: Cron every 5 minutes
   - Task: Check DB connectivity, API health
   - Send alert if failures detected
```

**Why Critical**:
- Tanpa workers, trust score decay tidak berjalan
- Widget rewards tidak terkumpul
- Spam scoring tidak update

---

#### 5️⃣ **Environment & Config Files** (0% Complete)

**Missing Files**:
```
.env.local (EXAMPLE)
.env.local.example
.env.test
.eslintrc.json
.prettierrc
tsconfig.json
next.config.js
package.json
pnpm-lock.yaml (atau package-lock.json)
postcss.config.js
tailwind.config.ts
jest.config.js
docker-compose.yml (untuk local dev)
.gitignore
README.md (project setup guide)
```

**Missing Key Files**:
- `lib/supabase.ts` - Supabase client initialization
- `lib/auth.ts` - Auth helpers (signUp, login, logout, session check)
- `lib/validation.ts` - Zod schemas untuk form validation
- `middleware.ts` - Next.js middleware untuk auth check
- `tailwind.config.ts` - Tailwind configuration

**Why Critical**:
- Project tidak bisa run tanpa ini
- Config files missing = build errors

---

### **TIER 2: SECURITY & ANTI-ABUSE (IMPORTANT untuk Production)**

#### 6️⃣ **Rate Limiting Middleware** (0% Complete)
Dokumentasi ada, code ZERO.

**Missing**:
```typescript
// lib/rate-limit.ts
- RateLimiter class (in-memory atau Redis)
- Middleware untuk express/Next.js
- Per-IP, per-user-id tracking
- Configurable limits (inquiry: 5/day/ip, proof upload: 3/day/user, etc)

// api/middleware/rate-limit.ts
- Express middleware wrapper
- Return 429 jika over limit
- Increment counter di DB rate_limit_events
```

**Why Important**:
- Spam prevention critical
- Tanpa ini, bot bisa spam inquiry/reviews

---

#### 7️⃣ **Spam Detection Logic** (0% Complete)

**Missing**:
```typescript
// lib/spam-detection.ts
- getSpamScore(text, email, metadata) → 0..100
  - Check email di disposable_email_domains table
  - Regex patterns (repeated words, links, etc)
  - ML heuristics (length, entropy, etc)
  - Return score > 70 = flag as spam

// lib/disposable-email.ts
- List of disposable email domains
- isCorporateEmail(email) → boolean
- Update job untuk download latest lists (GitHub Actions)
```

**Why Important**:
- Inquiry/review spam harus auto-detected
- Admin review manual jika flagged

---

#### 8️⃣ **Cloudflare Turnstile Integration** (0% Complete)

**Missing**:
```typescript
// components/TurnstileCaptcha.tsx
- React component wrapper untuk Cloudflare Turnstile
- Show captcha on inquiry form, claim request
- Validate token server-side

// lib/turnstile.ts
- verifyTurnstileToken(token, remoteIp) → boolean
- Server-side validation via Cloudflare API
```

**Why Important**:
- Without captcha, bot attacks mudah
- Free tier dari Cloudflare

---

### **TIER 3: TESTING & MONITORING (GOOD-TO-HAVE untuk MVP)**

#### 9️⃣ **Test Suites** (0% Complete)

**Missing**:
```
__tests__/
├── api/
│   ├── auth.test.ts (login, signup, verify)
│   ├── entity.test.ts (CRUD)
│   ├── proof.test.ts (submit, approve)
│   └── trust-score.test.ts (calculation)
├── lib/
│   ├── trust-score.test.ts
│   ├── spam-detection.test.ts
│   └── validation.test.ts
└── components/
    ├── EntityCard.test.tsx
    └── ProofUpload.test.tsx

cypress/ (E2E tests)
├── e2e/
│   ├── auth-flow.cy.ts
│   ├── entity-creation.cy.ts
│   ├── proof-submission.cy.ts
│   └── inquiry-submission.cy.ts
```

**Why Good-to-Have**:
- MVP bisa tanpa tests, tapi butuh untuk production hardening
- GitHub Actions bisa trigger tests sebelum deploy

---

#### 🔟 **Monitoring & Logging** (10% Complete)
Dokumentasi ada, code ZERO.

**Missing**:
```typescript
// lib/logging.ts
- Logger class (console, file, Sentry)
- Structured logging (timestamp, level, context)
- Error tracking integration

// lib/monitoring.ts
- Database query performance tracking
- API response time tracking
- Resource usage monitoring

// Integrations:
- Sentry DSN configuration
- Vercel Analytics setup
- PostHog / Plausible event tracking
```

**Why Important**:
- Production needs monitoring
- Error logs untuk debugging

---

#### 1️⃣1️⃣ **Admin Dashboard Implementation** (0% Complete)

**Missing Pages**:
```
/admin/
├── dashboard.tsx (overview stats)
├── proofs/
│   ├── page.tsx (pending proofs table)
│   ├── [id]/page.tsx (proof detail view)
├── claims/
│   ├── page.tsx (pending claims)
│   ├── [id]/page.tsx (claim detail)
├── users/
│   ├── page.tsx (user management)
│   ├── [id]/page.tsx (user detail, role assignment)
├── moderation/
│   ├── flagged-inquiries.tsx
│   ├── flagged-reviews.tsx
│   └── flagged-entities.tsx
└── logs/
    └── system-logs.tsx (query, filter, export)
```

**Components Needed**:
```typescript
AdminProofPanel.tsx
- Table dengan pending proofs
- Action buttons (approve/reject)
- Detail modal
- Comments field

AdminClaimPanel.tsx
- Claim verification workflow
- Email/DNS verification status
- Approve/reject buttons

AdminUserPanel.tsx
- User search & filter
- Role assignment (user/verifier/admin)
- Ban/flag user

SystemLogsViewer.tsx
- Query logs dengan filters
- Real-time tail option
- Export to CSV
```

---

### **TIER 4: OPTIONAL FEATURES (Nice-to-Have)**

#### 1️⃣2️⃣ **Semantic Search (pgvector)** (0% Complete)
Optional, but in spec.

**Missing**:
```typescript
// lib/embeddings.ts
- generateEmbedding(text) → vector (via OpenAI API)
- searchEntitiesByEmbedding(query) → Entity[]
- GitHub Action untuk batch embedding generation

// api/search/semantic
- POST endpoint untuk semantic search
- Return ranked results dengan similarity score
```

---

#### 1️⃣3️⃣ **Escrow Payment Processing** (0% Complete)
Optional (marked as "Optional MVP" dalam spec).

**Missing**:
```typescript
// lib/escrow.ts
- Escrow ledger logic
- BAST (Berita Acara Serah Terima) generation

// api/escrow/
- POST / (create escrow)
- GET /:id
- POST /:id/release
- POST /:id/refund
- POST /:id/dispute

// components/EscrowForm.tsx
// components/EscrowStatus.tsx

// RPC Functions:
- create_escrow()
- release_escrow()
- refund_escrow()
- dispute_escrow()
```

---

#### 1️⃣4️⃣ **Widget Embed Code Generator** (0% Complete)
Nice-to-have untuk growth loop.

**Missing**:
```typescript
// components/WidgetCodeGenerator.tsx
- UI untuk copy/paste widget embed code
- Settings untuk widget appearance
- Preview widget

// public/widget-embed.js
- Standalone script untuk embed di external websites
- Shadow DOM untuk styling isolation
- Communicate dengan main site via postMessage

// api/widget/[installationId]/script
- Serve minified widget script
- Include tracking pixel
```

---

## 📊 COMPLETION STATUS SUMMARY

| Component | Status | Files | Priority |
|-----------|--------|-------|----------|
| **Database Schema** | ✅ 100% | 1 file | - |
| **Documentation** | ✅ 95% | 1 file | - |
| **Frontend (React/Next.js)** | ❌ 0% | 0/50+ files | **CRITICAL** |
| **Backend API Routes** | ❌ 0% | 0/15+ files | **CRITICAL** |
| **Supabase RPC Functions** | ❌ 5% | 0/20+ functions | **CRITICAL** |
| **GitHub Actions Workflows** | ❌ 0% | 0/7 workflows | **CRITICAL** |
| **Config & Setup Files** | ❌ 0% | 0/15+ files | **CRITICAL** |
| **Rate Limiting** | ❌ 0% | 0 files | **IMPORTANT** |
| **Spam Detection** | ❌ 0% | 0 files | **IMPORTANT** |
| **Turnstile Integration** | ❌ 0% | 0 files | **IMPORTANT** |
| **Admin Dashboard** | ❌ 0% | 0/10+ pages | **IMPORTANT** |
| **Tests** | ❌ 0% | 0 files | OPTIONAL |
| **Monitoring/Logging** | ❌ 10% | 0 files | OPTIONAL |
| **Semantic Search** | ❌ 0% | 0 files | OPTIONAL |
| **Escrow System** | ❌ 0% | 0 files | OPTIONAL |
| **Widget Embed** | ❌ 0% | 0 files | OPTIONAL |

---

## 🎯 IMPLEMENTATION PRIORITY (Recommended Order)

### **PHASE 1: Foundation (Week 1-2)** - CRITICAL PATH
1. Setup Next.js project structure
2. Supabase client + authentication
3. Create basic pages: Login, Signup, Homepage
4. User profile page
5. Deploy to Vercel

### **PHASE 2: Core Features (Week 2-3)** - MVP
6. Entity creation & listing (Directory)
7. Entity profile pages
8. Trust score display (read-only for now)
9. Search/filter functionality

### **PHASE 3: Trust System (Week 4)** - CORE
10. Proof upload & management
11. Admin proof approval panel
12. Claim request system
13. RPC functions untuk approve/reject
14. Reputation log creation

### **PHASE 4: Leads & Reviews (Week 5)**
15. Inquiry submission form (with Turnstile)
16. Inquiry list untuk entity owner
17. Review submission
18. Verified buyer badge

### **PHASE 5: Anti-Abuse (Week 5-6)**
19. Rate limiting middleware
20. Spam detection logic
21. Disposable email check
22. GitHub Actions for spam scoring job

### **PHASE 6: Growth & Automation (Week 6-7)**
23. Widget installation & embed code
24. Widget tracking
25. GitHub Actions workflows (decay, rewards, cleanup)
26. Monitor & notifications

### **PHASE 7: Polish & Deploy (Week 7-8)**
27. Admin dashboard
28. Error handling & edge cases
29. Tests (unit + E2E)
30. Performance optimization
31. Security audit
32. Go-live

---

## 🚀 NEXT STEPS

1. **Create Next.js project**
   ```bash
   pnpm create next-app@latest inframeet --typescript --tailwind
   ```

2. **Setup directory structure** per spec di atas

3. **Start with authentication** (Login/Signup dengan Supabase Auth)

4. **Build entity CRUD** (Create/Read/Update directory)

5. **Implement trust display** (read-only trust_score dari DB)

6. **Add RPC functions** one by one (approve_proof, etc)

7. **Create worker workflows** untuk background jobs

8. **Add anti-abuse** (rate limiting, captcha, spam detection)

9. **Build admin dashboard** untuk verification flows

10. **Test & deploy** ke Vercel

---

## 📝 NOTES

- **Database**: ✅ Production-ready
- **Architecture**: ✅ Well-designed
- **Code**: ❌ Completely missing
- **Effort**: ~6-8 weeks untuk 1 developer full-time (MVP quality)
- **Risk**: High jika skip anti-abuse & security testing

**Most Critical**: Implement server-authoritative RPC functions BEFORE frontend touch any sensitive operations (trust score, escrow, badges).

---

*Generated: 2025-05-19*
