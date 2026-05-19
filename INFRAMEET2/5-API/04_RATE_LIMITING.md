# INFRAMEET - Rate Limiting & Captcha Hardenings

To secure resources on free tiers, public APIs are strictly rate-limited and protected by CAPTCHAs.

---
# SECTION 1: API CONTRACT & ROUTES

## 1.1 API Design Principles
- **Response format:** Always return `{ success: boolean, data?: T, error?: ErrorDetail }`
- **Error codes:** Consistent across all endpoints
- **Authentication:** JWT token in Authorization header (`Bearer <token>`)
- **RLS:** Server enforces all data access control
- **Pagination:** `limit` (1-100, default 20) + `offset` (default 0)

## 1.2 API Route Specification Table

### DIRECTORY MANAGEMENT

| Route | Method | Auth | Parameters | Success Response | Error Codes | Notes |
|-------|--------|------|------------|------------------|-------------|-------|
| `/api/entities` | GET | None | `limit, offset, category, search, sort` | `{ entities: Entity[], total: int }` | `400_INVALID_PARAMS` | Public read, paginated |
| `/api/entities` | POST | JWT | `name, entity_type, slug, website_url, description, category, email, phone, country, city` | `{ id: UUID, slug: string, ... }` | `400_INVALID_INPUT, 409_SLUG_EXISTS, 401_UNAUTHORIZED` | Owner only, slug must be unique |
| `/api/entities/:id` | GET | None | - | `Entity (public fields only)` | `404_NOT_FOUND` | If private, return 404 unless owner |
| `/api/entities/:id` | PUT | JWT | Same as POST | `Entity (updated)` | `401_UNAUTHORIZED, 403_NOT_OWNER, 404_NOT_FOUND` | Owner only |
| `/api/entities/:id` | DELETE | JWT | - | `{ success: true }` | `401_UNAUTHORIZED, 403_NOT_OWNER, 404_NOT_FOUND` | Soft delete only |
| `/api/entities/:id/stats` | GET | JWT (owner) | - | `{ trust_score, proof_count, inquiry_count, review_avg_rating, widget_clicks }` | `401_UNAUTHORIZED, 403_NOT_OWNER` | Owner dashboard only |

### CLAIMS (OWNERSHIP VERIFICATION)

| Route | Method | Auth | Parameters | Success Response | Error Codes | Notes |
|-------|--------|------|------------|------------------|-------------|-------|
| `/api/claims` | POST | JWT | `directory_id, claim_type (email\|domain\|dns\|sms), claim_target` | `{ claim_id: UUID, verification_code?: string, expires_at: ISO8601 }` | `400_INVALID_CLAIM_TYPE, 409_CLAIM_EXISTS, 401_UNAUTHORIZED` | Rate limit: 3 claims/day per user |
| `/api/claims/:id/verify` | POST | JWT | `verification_code` | `{ status: 'verified', verified_at: ISO8601 }` | `400_INVALID_CODE, 429_MAX_ATTEMPTS, 410_EXPIRED` | Max 5 attempts, 7-day expiry |
| `/api/claims/:id/resend` | POST | JWT | - | `{ success: true, new_expires_at: ISO8601 }` | `400_ALREADY_VERIFIED, 429_TOO_MANY_RESENDS` | Resend limit: 3x per claim |
| `/api/claims/pending` | GET | JWT | - | `{ claims: Claim[] }` | `401_UNAUTHORIZED` | Claimant's pending claims |

### PROOFS (TRUST PROOF ENGINE)

| Route | Method | Auth | Parameters | Success Response | Error Codes | Notes |
|-------|--------|------|------------|------------------|-------------|-------|
| `/api/proofs` | GET | None | `directory_id, status (approved\|pending\|rejected), limit, offset` | `{ proofs: Proof[], total: int }` | `400_INVALID_PARAMS` | Public can only see approved |
| `/api/proofs` | POST | JWT (owner) | `directory_id, title, description, proof_type, file_url, category, expires_at` | `{ proof_id: UUID, status: 'pending', review_queue_position: int }` | `400_INVALID_INPUT, 401_UNAUTHORIZED, 413_FILE_TOO_LARGE, 429_QUOTA_EXCEEDED` | Free tier: 3 proofs; Pro: unlimited. Max 50MB file |
| `/api/proofs/:id` | GET | Any | - | `Proof (with review_notes if owner or verifier)` | `404_NOT_FOUND` | Owners/verifiers see more detail |
| `/api/proofs/:id/approve` | POST | JWT (verifier) | `trust_points (0-50)` | `{ proof_id: UUID, status: 'approved', reputation_log_id: UUID }` | `400_INVALID_POINTS, 401_UNAUTHORIZED, 403_NOT_VERIFIER, 404_NOT_FOUND` | Server-auth only. Creates reputation log |
| `/api/proofs/:id/reject` | POST | JWT (verifier) | `reason_code (string), detailed_feedback` | `{ proof_id: UUID, status: 'rejected', can_appeal: true }` | Same as approve | Creates appeal window (7 days) |
| `/api/proofs/:id/appeal` | POST | JWT (owner) | `appeal_reason` | `{ appeal_id: UUID, status: 'pending', reviewed_at: null }` | `400_APPEAL_WINDOW_CLOSED, 403_NOT_OWNER` | Can only appeal rejected proofs |

### INQUIRIES (LEADS)

| Route | Method | Auth | Parameters | Success Response | Error Codes | Notes |
|-------|--------|------|------------|------------------|-------------|-------|
| `/api/inquiries` | POST | None | `directory_id, sender_email, sender_name, subject, message, captcha_token` | `{ inquiry_id: UUID, received_at: ISO8601 }` | `400_INVALID_INPUT, 400_CAPTCHA_FAILED, 429_SPAM_BLOCKED, 400_DISPOSABLE_EMAIL` | Rate limit: 5 inquiries/IP/day. Captcha mandatory |
| `/api/inquiries/:directory_id` | GET | JWT (owner) | `status (new\|responded\|closed\|flagged), limit, offset` | `{ inquiries: Inquiry[], total: int }` | `401_UNAUTHORIZED, 403_NOT_OWNER` | Owner dashboard |
| `/api/inquiries/:id` | PUT | JWT (owner) | `status, response_notes` | `Inquiry (updated)` | `401_UNAUTHORIZED, 403_NOT_OWNER` | Can only change status, add notes |

### REVIEWS

| Route | Method | Auth | Parameters | Success Response | Error Codes | Notes |
|-------|--------|------|------------|------------------|-------------|-------|
| `/api/reviews` | GET | None | `directory_id, rating (1-5), verified_buyer, limit, offset` | `{ reviews: Review[], avg_rating: decimal, total: int }` | `400_INVALID_PARAMS` | Public read approved reviews only |
| `/api/reviews` | POST | None | `directory_id, reviewer_email, reviewer_name, rating, title, comment, captcha_token` | `{ review_id: UUID, status: 'pending' }` | `400_INVALID_INPUT, 400_CAPTCHA_FAILED, 429_ONE_REVIEW_PER_EMAIL` | Captcha required, moderation queue |
| `/api/reviews/:id/approve` | POST | JWT (moderator) | - | `Review (status: approved)` | `401_UNAUTHORIZED, 403_NOT_MODERATOR` | Server-auth only |
| `/api/reviews/:id/reject` | POST | JWT (moderator) | `flag_reason` | `Review (status: rejected)` | Same as approve | |
| `/api/reviews/:id/flag` | POST | JWT (owner) | `flag_reason` | `{ review_id: UUID, is_flagged: true }` | `403_NOT_OWNER` | Owner can flag inappropriate reviews |

### ESCROW (OPTIONAL MVP)

| Route | Method | Auth | Parameters | Success Response | Error Codes | Notes |
|-------|--------|------|------------|------------------|-------------|-------|
| `/api/escrow` | POST | JWT (buyer) | `directory_id, amount, currency, description, payment_method (stripe\|wise)` | `{ escrow_id: UUID, status: 'held', payment_url?: string }` | `400_INVALID_AMOUNT, 400_CURRENCY_NOT_SUPPORTED, 401_UNAUTHORIZED` | Server-auth only. Links to payment provider |
| `/api/escrow/:id/release` | POST | JWT (owner) | - | `{ escrow_id: UUID, status: 'released', released_at: ISO8601 }` | `400_INVALID_STATUS, 401_UNAUTHORIZED, 403_NOT_OWNER` | Server-auth only. Atomic transaction |
| `/api/escrow/:id/refund` | POST | JWT (buyer) | `reason` | `{ escrow_id: UUID, status: 'refunded' }` | Same as release | Server-auth only |
| `/api/escrow/:id/dispute` | POST | JWT (buyer\|owner) | `reason, evidence_url` | `{ escrow_id: UUID, is_disputed: true, status: 'disputed' }` | `400_ALREADY_DISPUTED` | Freezes release/refund |

### WIDGETS

| Route | Method | Auth | Parameters | Success Response | Error Codes | Notes |
|-------|--------|------|------------|------------------|-------------|-------|
| `/api/widgets` | POST | JWT (owner) | `directory_id, installation_url, widget_type (badge\|full-profile\|mini-card)` | `{ widget_id: UUID, install_token: string }` | `400_INVALID_URL, 401_UNAUTHORIZED, 403_NOT_OWNER` | Free tier: 1 widget; Pro: 5 |
| `/api/widgets/:id` | GET | JWT (owner) | - | `Widget (with stats: total_clicks, total_installs, reward_balance)` | `401_UNAUTHORIZED, 403_NOT_OWNER` | |
| `/api/widgets/:id/events` | GET | JWT (owner) | `event_type (click\|view\|install), limit, offset, date_range` | `{ events: WidgetEvent[], total: int }` | `401_UNAUTHORIZED, 403_NOT_OWNER` | Analytics endpoint |
| `/api/widgets/:token/track` | POST | None | `event_type, session_id, referrer` | `{ success: true, reward_amount?: decimal }` | `400_INVALID_TOKEN, 400_INVALID_EVENT` | Public endpoint (CORS allowed for embed) |
| `/api/widgets/:id/payout` | POST | JWT (owner) | `payout_method (bank_transfer\|stripe)` | `{ payout_id: UUID, amount: decimal, status: 'pending' }` | `400_MINIMUM_BALANCE_NOT_MET` | Min balance: $10 |

### ADMIN / MODERATION

| Route | Method | Auth | Parameters | Success Response | Error Codes | Notes |
|-------|--------|------|------------|------------------|-------------|-------|
| `/api/admin/entities/flag` | POST | JWT (moderator) | `directory_id, flag_reason, severity (low\|medium\|high)` | `{ flagged_id: UUID, verification_status: 'flagged' }` | `401_UNAUTHORIZED, 403_NOT_MODERATOR` | Server-auth only |
| `/api/admin/proofs/queue` | GET | JWT (verifier) | `status, priority, assigned_to, limit, offset` | `{ proofs: Proof[], queue_size: int }` | `401_UNAUTHORIZED, 403_NOT_VERIFIER` | Verification dashboard |
| `/api/admin/spam/check` | POST | JWT (admin) | `email, ip_address, inquiry_id` | `{ spam_score: decimal(0-1), risk_level: (low\|medium\|high), reason: string }` | `400_INVALID_INPUT` | Spam detection engine |
| `/api/admin/metrics/dashboard` | GET | JWT (admin) | `date_range, group_by (day\|week\|month)` | `{ traffic, conversions, verifications, revenue, widget_footprint }` | `401_UNAUTHORIZED, 403_NOT_ADMIN` | Analytics dashboard |

---

## 1.3 Error Code Reference

| Error Code | HTTP Status | Meaning | Example Mitigation |
|------------|------------|---------|-------------------|
| `400_INVALID_INPUT` | 400 | Input validation failed | Return validation error details |
| `400_INVALID_PARAMS` | 400 | Query param validation failed | Return expected params |
| `400_INVALID_CLAIM_TYPE` | 400 | Unsupported claim method | Show supported methods |
| `400_CAPTCHA_FAILED` | 400 | Captcha verification failed | Ask user to try again |
| `400_DISPOSABLE_EMAIL` | 400 | Disposable email domain detected | Suggest real email |
| `400_APPEAL_WINDOW_CLOSED` | 400 | Appeal window expired | Show appeal deadline |
| `400_ALREADY_DISPUTED` | 400 | Escrow already in dispute | Wait for resolution |
| `400_INVALID_POINTS` | 400 | Trust points out of range (0-50) | Return valid range |
| `400_INVALID_EVENT` | 400 | Unknown widget event type | Return valid event types |
| `400_MINIMUM_BALANCE_NOT_MET` | 400 | Widget reward balance < $10 | Show required balance |
| `409_SLUG_EXISTS` | 409 | Entity slug already taken | Suggest alternative slug |
| `409_CLAIM_EXISTS` | 409 | Claim already pending | Show existing claim |
| `409_ONE_REVIEW_PER_EMAIL` | 409 | Email already reviewed entity | Show existing review |
| `410_EXPIRED` | 410 | Verification code/claim expired | Trigger resend flow |
| `413_FILE_TOO_LARGE` | 413 | Proof file exceeds 50MB | Show size limit |
| `429_TOO_MANY_RESENDS` | 429 | Resend limit exceeded (3x) | Show retry window |
| `429_MAX_ATTEMPTS` | 429 | Verification attempts exceeded (5x) | Show lockout window |
| `429_SPAM_BLOCKED` | 429 | Inquiry marked as spam | Show spam appeal process |
| `429_QUOTA_EXCEEDED` | 429 | Proof upload quota exceeded | Show upgrade option |
| `401_UNAUTHORIZED` | 401 | Missing or invalid JWT | Redirect to login |
| `403_NOT_OWNER` | 403 | User doesn't own resource | Show access denied |
| `403_NOT_VERIFIER` | 403 | User doesn't have verifier role | Contact admin |
| `403_NOT_MODERATOR` | 403 | User doesn't have moderator role | Contact admin |
| `403_NOT_ADMIN` | 403 | User doesn't have admin role | Contact admin |
| `404_NOT_FOUND` | 404 | Resource doesn't exist | Check URL/ID |
| `500_DATABASE_ERROR` | 500 | Database transaction failed | Retry or contact support |
| `500_PAYMENT_ERROR` | 500 | Payment provider error (Stripe, Wise) | Retry, contact support |
| `500_EXTERNAL_API_ERROR` | 500 | External API unavailable (OpenAlex, RSS) | Retry async job |

---

## 1.4 Rate Limits (Per User/IP)

| Action | Limit | Window | Error Code |
|--------|-------|--------|------------|
| Submit inquiry | 5 per day | Per IP | `429_SPAM_BLOCKED` |
| Resend claim verification | 3 per claim | Per claim | `429_TOO_MANY_RESENDS` |
| Create new claim | 3 per day | Per user | `429_QUOTA_EXCEEDED` |
| Upload proof | Varies by tier | Per month | `429_QUOTA_EXCEEDED` |
| Submit review | 1 per email per entity | Lifetime | `409_ONE_REVIEW_PER_EMAIL` |
| Widget track event | 1000 per day | Per install token | Silently dropped |

---
