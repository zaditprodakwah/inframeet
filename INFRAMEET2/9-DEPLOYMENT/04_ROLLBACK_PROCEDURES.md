# INFRAMEET - Deployment Rollback Manual

A guide to rollback steps during severe production failures.

---
# SECTION 4: ERROR HANDLING & ROLLBACK STRATEGY

## 4.1 Error Handling by Feature

### Claim Verification

**Scenario:** User enters wrong verification code

```
Frontend → POST /api/claims/:id/verify {code: 'WRONG'}
Backend validation:
  1. Check if claim exists AND status='pending'
  2. Check if code == verification_code
  3. Check if attempts < max_attempts
  
Error handling:
  - If wrong code: return 400_INVALID_CODE + attempts_remaining
  - If attempts >= 5: return 429_MAX_ATTEMPTS + locked_until timestamp
  - If code expired: return 410_EXPIRED + offer resend
  
User sees: "Incorrect code. {N} attempts remaining. Code expires in {time}."
Recovery: User can resend code OR wait 24h for lockout to clear
```

**Scenario:** Email delivery fails

```
Backend process:
  1. INSERT claim {status: 'pending', verification_code: 'XXX'}
  2. TRY: Send email via SendGrid
     CATCH error (timeout, rate limit, auth error):
       - Store error in claim metadata: {email_failed: true, error_reason, timestamp}
       - INSERT staging_inbox {job_type: 'resend_claim_email', claim_id}
       - Return to user: "We sent verification code. Check spam folder."
  3. Worker job retries email delivery (max 3 retries, 1h apart)
     
Result: User waits 1h, checks spam, or clicks "Resend" button to retry immediately
```

### Proof Upload

**Scenario:** File upload fails (network timeout)

```
Browser → Upload file to Cloudinary/R2
  1. File upload in progress
  2. Network connection drops → Upload incomplete
  
Recovery (automatic retry):
  - Browser detects failed upload
  - Show: "Upload failed. Click to retry" + Resume button
  - User can click Resume or re-upload file
  - Max 3 attempts per file
  
If all 3 fail: Show "Upload failed. Try again later or contact support."
```

**Scenario:** Proof approval triggers reputation calculation failure

```
Verifier → POST /api/proofs/:id/approve {trust_points: 5}

Server (Supabase):
  BEGIN TRANSACTION
    1. UPDATE trust_proofs SET status='approved'
    2. INSERT reputation_logs (will calculate trust score later)
    3. CALL calculate_trust_score(directory_id) ← Can fail if RPC has bug
    4. UPDATE omni_directory SET trust_score=X
  COMMIT or ROLLBACK on error
  
If step 3 fails:
  - Entire transaction rolled back (no partial updates)
  - Proof remains status='pending'
  - Error logged to system_events
  - Return 500_DATABASE_ERROR to verifier
  - Verifier sees: "Approval failed. Please try again or contact support."
  - Admin notified of error
  
Recovery:
  - Sysadmin checks error logs
  - Fixes RPC bug (if exists) OR retries transaction
  - Verifier retries approval
```

### Inquiry Submission (Spam Detection)

**Scenario:** CAPTCHA verification fails

```
User → POST /api/inquiries {... captcha_token}

Backend:
  1. TRY: Verify captcha_token with Cloudflare API
     CATCH error (timeout, auth error):
       - Log error
       - Fallback: Proceed with inquiry if captcha_verified=false
       - Mark for manual review: is_spam_flagged=true initially
       
  Result: Inquiry created but flagged for moderator review
  User sees: "Inquiry received. (May take longer to process)"
```

**Scenario:** Spam scoring timeout

```
Background job → Spam check on inquiry

Worker:
  1. SELECT inquiry FROM staging_inbox
  2. TRY: Run spam scoring (ML model call)
     TIMEOUT after 5 seconds → Job fails
     
  Retry logic:
    - Increment attempts counter
    - If attempts < 3: reschedule for +30min
    - If attempts >= 3: INSERT system_event {severity: error, job_type: spam_check}
    
  Result: 
    - Inquiry stays in moderation queue (manual review)
    - Admin alerted to stuck jobs
    - No user impact (inquiry not published anyway)
```

### Widget Reward Payout

**Scenario:** Payment provider (Stripe) returns error

```
Owner → POST /api/widgets/:id/payout {amount: 45.23, destination: account_id}

Backend:
  1. Validate balance >= $10
  2. TRY: Call Stripe API create_payout()
     ON error: 
       a) Rate limit (429): Retry with exponential backoff (1s, 2s, 4s)
       b) Auth error (401): Return 500_PAYMENT_ERROR + alert admin
       c) Insufficient balance (400): Return 400_INSUFFICIENT_BALANCE
       d) Invalid account (400): Return 400_INVALID_DESTINATION
       
  3. If successful: record payout_id + status='pending'
  4. Webhook listener awaits confirmation
  
Recovery:
  - Owner sees: "Payout failed: {reason}. Contact support if issue persists."
  - Admin monitors failed payouts dashboard
  - Admin can manually retry or refund
```

### Escrow Release

**Scenario:** Atomic transaction fails (buyer pays, release fails, escrow stuck)

```
Owner → POST /api/escrow/:id/release

Supabase (CRITICAL - must be atomic):
  BEGIN TRANSACTION (ISOLATION LEVEL: SERIALIZABLE)
    1. SELECT escrow WHERE id=X FOR UPDATE (row-level lock)
    2. Check status='held', buyer exists
    3. Create payment instruction (internal ledger)
    4. UPDATE escrow SET status='released', released_at=NOW()
    5. INSERT system_event {type: 'escrow_released'}
    6. Trigger notification webhook to payment processor
  COMMIT
  
If ANY step fails:
  - Entire transaction rolls back
  - Escrow status remains 'held'
  - Error returned: 500_DATABASE_ERROR
  - Automatic retry queued (max 3 retries, 5min apart)
  
If retry fails after 3 attempts:
  - Flag escrow: {is_stuck: true, error_reason: '...'}
  - Alert admin: "Manual intervention needed for escrow {id}"
  - Owner can contact support
  
Prevention:
  - Avoid calling external APIs (Stripe, Wise) INSIDE transaction
  - Call after transaction commits, retry if API fails
  - Webhook confirmation updates escrow status
```

## 4.2 Rollback Strategy

### Database Migration Rollback

**Scenario:** Migration introduced a bug (e.g., trust score calculation wrong formula)

```
If deployed and causing issues:
  
Option 1: HOTFIX (if fixable without schema change)
  1. Identify bug in RPC function or trigger
  2. Fix SQL code
  3. Apply patch: UPDATE function logic
  4. Recompute affected records: UPDATE omni_directory SET trust_score=...
  5. Verify data integrity
  
Option 2: ROLLBACK (if schema breaking)
  1. If fresh deployment (< 1 hour): 
     - Revert Vercel/Next.js to previous commit
     - Supabase: Use "Rollback" feature (if available in free tier)
     - OR: Manually restore database from backup
  
  2. If in production (> 1 hour):
     - Cannot full rollback (data changed)
     - Instead: Apply reverse migration (new migration file)
     - E.g., if added column that broke validation, DROP column + DEFAULT old value
     - Test extensively in staging first
```

### Code Rollback (Vercel)

```
Broken deployment detected:
  
Frontend:
  - Click "Revert to previous" in Vercel dashboard
  - Select commit to revert to
  - Click "Promote to Production"
  - Deployment completes (30 seconds)
  - Cached content refreshed
  
Time to recover: ~5 minutes
User impact: ~2 minutes downtime

Recommended: Always test in Staging → Preview first
```

### Payment System Rollback

```
Scenario: Stripe webhook processing bug caused double-charging

Recovery:
  1. Identify affected transactions (query escrow_ledger)
  2. For each erroneous transaction:
     - Create manual refund via Stripe dashboard
     - UPDATE escrow_ledger {refund_id, refunded_at} for internal record
  3. Send customer apology + refund confirmation email
  4. Fix bug in webhook handler
  5. Test webhook processing in Stripe test environment before re-enabling
```

---
