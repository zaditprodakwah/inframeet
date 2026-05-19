# INFRAMEET - Detailed User Flows

This document details critical user loops, visual diagrams, and frontend/backend transitions.

---
# SECTION 2: CRITICAL USER FLOWS (MERMAID DIAGRAMS)

## 2.1 FLOW: Entity Ownership Claim (Email Verification)

```mermaid
sequenceDiagram
  participant User as Owner/Claimant
  participant Browser as Web Browser
  participant Backend as Supabase/API
  participant Email as Email Service
  participant Admin as Verifier (Optional)

  User->>Browser: Navigate to entity page, click "Claim Ownership"
  User->>Browser: Select "Email" claim method
  Browser->>Backend: POST /api/claims {directory_id, claim_type: 'email', claim_target: 'owner@company.com'}
  
  Backend->>Backend: Check if claim already exists for this email
  alt Claim already pending
    Backend-->>Browser: 409_CLAIM_EXISTS
    Browser->>User: Show "Claim already in progress"
  else Claim created
    Backend->>Backend: Generate 6-digit verification_code (XXXXX)
    Backend->>Email: Send email with code to owner@company.com
    Backend-->>Browser: {claim_id, expires_at: +7 days, verification_attempts: 0/5}
    
    User->>Email: Check email, receive code
    User->>Browser: Enter verification code (XXXXX)
    Browser->>Backend: POST /api/claims/:id/verify {verification_code: 'XXXXX'}
    
    alt Code valid, attempts < 5
      Backend->>Backend: UPDATE claim SET status='verified', verified_at=NOW()
      Backend->>Backend: INSERT reputation_log {event: 'email_claim_verified', points_delta: +2}
      Backend->>Backend: UPDATE omni_directory SET verification_status='basic_verified'
      Backend-->>Browser: {status: 'verified', verified_at: ISO8601}
      Browser->>User: Show "Email verified! Your listing is now verified"
      
      Note over Admin: Optional: Manual verification for multi-step claims
      Admin->>Backend: POST /api/admin/claims/:id/approve (if needed)
    else Code invalid OR attempts >= 5
      Backend->>Backend: INCREMENT verification_attempts
      alt attempts < 5
        Backend-->>Browser: 400_INVALID_CODE, attempts_remaining: X
        Browser->>User: Show error + retry button
      else attempts >= 5
        Backend-->>Browser: 429_MAX_ATTEMPTS, lockout_until: +24 hours
        Browser->>User: Show "Too many attempts. Try again tomorrow or resend code"
      end
    end
    
    alt Code expired (7 days)
      User->>Browser: Try to verify after 7 days
      Browser->>Backend: POST /api/claims/:id/verify {code}
      Backend-->>Browser: 410_EXPIRED
      Browser->>User: Show "Code expired"
      User->>Browser: Click "Resend Code" (max 3x)
      Browser->>Backend: POST /api/claims/:id/resend
      Backend->>Email: Send new code
    end
  end
```

## 2.2 FLOW: Proof Submission → Review → Approval → Trust Update

```mermaid
sequenceDiagram
  participant Owner as Entity Owner
  participant Browser as Web Browser
  participant Backend as Supabase/Next.js
  participant FileStorage as Cloudinary/R2
  participant Queue as Staging Inbox (Worker)
  participant Verifier as Verifier/Admin

  Owner->>Browser: Click "Upload Proof of Credibility"
  Owner->>Browser: Fill form {title, description, proof_type, file, category}
  
  Browser->>Browser: Validate file (size < 50MB, type allowed)
  Browser->>FileStorage: Upload file (signed request)
  FileStorage-->>Browser: {file_url, CDN_url}
  
  Browser->>Backend: POST /api/proofs {directory_id, title, proof_type, file_url, ...}
  
  Backend->>Backend: Validate input (XSS, file type whitelist)
  Backend->>Backend: Check quota (free: 3, pro: unlimited)
  
  alt Quota exceeded
    Backend-->>Browser: 429_QUOTA_EXCEEDED
    Browser->>Owner: Show upgrade dialog
  else Quota OK
    Backend->>Backend: INSERT trust_proofs {status: 'pending', ...}
    Backend->>Backend: INSERT staging_inbox {job_type: 'proof_spam_check', proof_id, payload}
    Backend-->>Browser: {proof_id, status: 'pending', queue_position: N}
    Browser->>Owner: Show "Proof submitted. Estimated review: 24-48 hours"
    
    note over Queue: Background Job (GitHub Actions Worker)
    Queue->>Queue: Check staging_inbox for pending spam_check jobs
    Queue->>Queue: Run ML/heuristic spam scoring on proof
    Queue->>Backend: UPDATE proof {metadata.spam_score: X}
    Queue->>Queue: If spam_score > 0.8: auto-flag for manual review
    
    Verifier->>Backend: GET /api/admin/proofs/queue {status: 'pending'}
    Backend-->>Verifier: [List of pending proofs, prioritized by spam_score]
    
    Verifier->>Browser: Open proof review dashboard
    Verifier->>Browser: Review proof details, file content, metadata
    Verifier->>Browser: Decision: Approve, Reject, or Request More Info
    
    alt Approve
      Verifier->>Backend: POST /api/proofs/:id/approve {trust_points: 5}
      Backend->>Backend: UPDATE trust_proofs SET status='approved'
      Backend->>Backend: INSERT reputation_logs {event: 'proof_approved', points_delta: 5, source_proof_id}
      Backend->>Backend: CALL calculate_trust_score(directory_id)
      Backend->>Backend: UPDATE omni_directory SET trust_score=X, verification_status='basic_verified'
      Backend->>Backend: INSERT system_event {event_type: 'proof_approved', actor_id: verifier_id}
      Backend-->>Verifier: {proof_id, status: 'approved', reputation_log_id: UUID}
      
      Verifier->>Backend: Optional: Send notification to owner
      Backend-->>Owner: Email: "Your proof was approved! Trust score increased to X"
      
    else Reject
      Verifier->>Backend: POST /api/proofs/:id/reject {reason_code: 'unverifiable', detailed_feedback: '...'}
      Backend->>Backend: UPDATE trust_proofs SET status='rejected'
      Backend->>Backend: Store feedback for appeal
      Backend->>Backend: INSERT system_event
      Backend-->>Verifier: {proof_id, status: 'rejected', can_appeal: true}
      
      Owner->>Backend: GET /api/proofs/:id (sees feedback)
      Owner->>Browser: Read rejection reason
      Owner->>Browser: (Optional) Click "File Appeal" button
      Owner->>Backend: POST /api/proofs/:id/appeal {appeal_reason: '...'}
      Backend->>Backend: INSERT proof_reviews {is_appeal: true, original_review_id}
      Backend->>Backend: Add to verifier queue with [APPEAL] flag
      
      alt Appeal approved
        Verifier->>Backend: POST /api/proofs/:id/approve
      else Appeal denied
        Backend->>Owner: Email: "Appeal denied. Contact support."
      end
    end
  end
```

## 2.3 FLOW: Widget Installation → Click Tracking → Reward Payout

```mermaid
sequenceDiagram
  participant Owner as Entity Owner
  participant Dashboard as INFRAMEET Dashboard
  participant Frontend as External Website (Partner)
  participant Browser2 as Visitor Browser
  participant Backend as Supabase API
  participant PaymentGW as Stripe/Wise

  Owner->>Dashboard: Click "Get Widget Badge"
  Dashboard->>Backend: POST /api/widgets {directory_id, installation_url, widget_type: 'badge'}
  Backend->>Backend: Validate URL (TLD check, no localhost)
  Backend->>Backend: Generate install_token (unique, secure)
  Backend-->>Dashboard: {widget_id, install_token: 'wgt_xxx', embed_code: '<script>...'}
  
  Dashboard->>Owner: Show embed code + installation instructions
  Owner->>Frontend: Copy/paste embed code into website
  Frontend->>Frontend: Load widget script with install_token
  
  note over Frontend: Visitor arrives and sees widget badge
  Browser2->>Frontend: Load page with widget
  Frontend->>Backend: GET /widgets/wgt_xxx/embed (CORS allowed)
  Backend-->>Frontend: Return widget HTML/CSS/JS
  Frontend->>Browser2: Render badge: "Verified by INFRAMEET ⭐ 4.8"
  
  Browser2->>Browser2: User clicks badge
  Frontend->>Backend: POST /api/widgets/wgt_xxx/track {event_type: 'click', session_id, referrer}
  Backend->>Backend: INSERT widget_events {installation_id, event_type: 'click', reward_amount: 0.05}
  Backend->>Backend: UPDATE widget_installations SET total_clicks++
  Backend-->>Frontend: {success: true, reward_amount: 0.05, redirect_url: '/entities/...'}
  
  Browser2->>Backend: Follow redirect → Entity profile page
  Backend->>Backend: Track: User came from widget → potential lead
  
  note over Backend: Background Job (Daily Widget Reward Aggregation)
  Backend->>Backend: SELECT widget_installations WHERE is_active=true
  Backend->>Backend: SELECT SUM(reward_amount) FROM widget_events (last 24h)
  Backend->>Backend: For each installation: clicks * 0.05 + installs * 0.20
  Backend->>Backend: UPDATE widget_installations SET reward_balance += total_rewards
  Backend->>Backend: INSERT staging_inbox {job_type: 'widget_reward_aggregation'}
  
  note over Owner: Owner requests payout
  Owner->>Dashboard: Click "Withdraw Rewards" (balance: $45.23)
  Dashboard->>Backend: POST /api/widgets/:id/payout {payout_method: 'stripe', bank_account_id}
  Backend->>Backend: Check balance >= $10 (minimum)
  Backend->>Backend: Create payout transaction
  Backend->>PaymentGW: POST /payouts {amount: 45.23, destination: bank_account}
  PaymentGW-->>Backend: {payout_id: 'po_xxx', status: 'pending'}
  Backend->>Backend: UPDATE widget_installations SET reward_balance=0, last_payout_date=NOW()
  Backend->>Backend: INSERT system_event {event_type: 'widget_payout', amount: 45.23}
  Backend-->>Dashboard: {payout_id, status: 'pending', expected_arrival: '+2-5 business days'}
  
  Dashboard->>Owner: Show "Payout processing. Check bank account in 2-5 days"
  PaymentGW->>Backend: Webhook: Payout completed
  Backend->>Backend: UPDATE widget_installations {last_payout_status: 'completed'}
  Backend->>Owner: Email: "Your payout of $45.23 has been completed"
```

## 2.4 FLOW: Inquiry Submission → Spam Detection → Owner Notification

```mermaid
sequenceDiagram
  participant Visitor as Website Visitor
  participant Browser as Web Browser
  participant Captcha as Cloudflare Turnstile
  participant Backend as Supabase/Next.js
  participant SpamEngine as Spam Detector (RPC/Job)
  participant Owner as Entity Owner
  participant Email as Email Service

  Visitor->>Browser: Navigate to entity page
  Browser->>Browser: Scroll to "Send Inquiry" form
  Visitor->>Browser: Enter email, name, subject, message
  Browser->>Browser: Validate email format
  
  Browser->>Captcha: Load Turnstile widget
  Visitor->>Captcha: Complete CAPTCHA challenge
  Captcha-->>Browser: {captcha_token: 'tok_xxx'}
  
  Visitor->>Browser: Click "Send Inquiry"
  Browser->>Backend: POST /api/inquiries {directory_id, sender_email, sender_name, subject, message, captcha_token}
  
  Backend->>Backend: Verify captcha_token with Cloudflare
  alt Captcha failed
    Backend-->>Browser: 400_CAPTCHA_FAILED
    Browser->>Visitor: "CAPTCHA verification failed. Try again"
  else Captcha valid
    Backend->>Backend: Check rate limit: inquiries from IP in last 24h
    alt Rate limit exceeded (5 per IP)
      Backend-->>Browser: 429_SPAM_BLOCKED
      Browser->>Visitor: "Too many inquiries from your IP. Try again tomorrow"
    else Rate limit OK
      Backend->>Backend: Check if email is disposable (compare against disposable_email_domains table)
      alt Disposable email detected
        Backend-->>Browser: 400_DISPOSABLE_EMAIL
        Browser->>Visitor: "Please use a real email address"
      else Real email
        Backend->>Backend: INSERT inquiry {directory_id, sender_email, status: 'new', captcha_verified: true}
        Backend->>Backend: INSERT staging_inbox {job_type: 'inquiry_spam_scoring', inquiry_id, payload}
        Backend-->>Browser: {inquiry_id, received_at: ISO8601}
        Browser->>Visitor: "Thank you! We'll forward your inquiry"
        
        note over SpamEngine: Background Job (async spam scoring)
        SpamEngine->>SpamEngine: Check inquiry text against spam patterns
        SpamEngine->>SpamEngine: Calculate: keyword_spam_score + sender_history_score + content_length_score
        SpamEngine->>SpamEngine: Result: spam_score (0.0 - 1.0)
        SpamEngine->>Backend: UPDATE inquiry SET spam_score=X, is_spam_flagged=(X > 0.7)
        
        Backend->>Backend: SELECT inquiry WHERE directory_id=X AND status='new'
        alt is_spam_flagged=true
          Backend->>Owner: (Optional) Show in "Suspected Spam" folder in dashboard
        else Not spam
          Backend->>Email: Send notification to owner: "New inquiry from {sender_name}"
        end
        
        Owner->>Dashboard: Check "New Inquiries" (backend dashboard)
        Dashboard->>Backend: GET /api/inquiries/:directory_id {status: 'new'}
        Backend-->>Dashboard: [{inquiry_id, sender_email, subject, spam_score, ...}]
        
        alt Owner marks as spam
          Owner->>Dashboard: Flag inquiry as spam
          Dashboard->>Backend: UPDATE inquiry {is_spam_flagged: true, flagged_by: owner_id}
        else Owner responds
          Owner->>Dashboard: Click "Respond" button
          Owner->>Dashboard: Type response message (optional)
          Dashboard->>Backend: PUT /api/inquiries/:id {status: 'responded', response_notes: '...'}
          Backend->>Email: Forward response to sender_email (if configured)
          Email->>Visitor: Email response
        end
      end
    end
  end
```

## 2.5 FLOW: Review Submission → Moderation → Publishing

```mermaid
sequenceDiagram
  participant Customer as Buyer/Customer
  participant Browser as Web Browser
  participant Backend as Supabase API
  participant Moderator as Content Moderator
  participant Admin as Admin Dashboard
  participant Owner as Entity Owner

  Customer->>Browser: Navigate to entity page, scroll to "Write a Review"
  Customer->>Browser: Enter email, name (optional), rating (1-5), title, comment
  Browser->>Browser: Validate: email required, rating 1-5, comment 5-500 chars
  
  Browser->>Backend: POST /api/reviews {directory_id, reviewer_email, rating, title, comment, captcha_token}
  Backend->>Backend: Verify captcha_token
  Backend->>Backend: Check if email already reviewed this entity (one review per email)
  alt Email already has review
    Backend-->>Browser: 409_ONE_REVIEW_PER_EMAIL
    Browser->>Customer: Show: "You've already reviewed this entity"
  else New review
    Backend->>Backend: INSERT review {status: 'pending', created_at: NOW()}
    Backend->>Backend: INSERT staging_inbox {job_type: 'review_moderation_queue', review_id}
    Backend-->>Browser: {review_id, status: 'pending', message: 'Your review is being moderated'}
    Browser->>Customer: Show success message
    
    note over Moderator: Moderation Queue Processing
    Moderator->>Admin: Login to admin panel
    Admin->>Backend: GET /api/admin/reviews {status: 'pending', limit: 50}
    Backend-->>Admin: [List of pending reviews]
    
    Moderator->>Admin: Click review to inspect
    Admin->>Backend: GET /api/reviews/:id (with full metadata)
    Backend-->>Admin: {reviewer_email, rating, title, comment, created_at, metadata: {word_count, keyword_violations: []}}
    
    alt Review contains violations (spam, hate speech, etc)
      Moderator->>Admin: Select reason: "Spam", "Inappropriate Language", "Unrelated Content"
      Admin->>Backend: POST /api/reviews/:id/reject {flag_reason: '...'}
      Backend->>Backend: UPDATE review {status: 'rejected', flagged_reason: '...'}
      Backend-->>Admin: {review_id, status: 'rejected'}
      note over Customer: (Optional) Email: "Your review was not published. Reason: ..."
    else Review looks good
      Moderator->>Admin: Click "Approve"
      Admin->>Backend: POST /api/reviews/:id/approve
      Backend->>Backend: UPDATE review {status: 'approved', approved_at: NOW()}
      Backend->>Backend: If escrow linked: UPDATE review {is_verified_buyer: true}
      Backend->>Backend: UPDATE omni_directory: recalculate avg_rating
      Backend->>Backend: INSERT reputation_log {event: 'review_approved', points_delta: +1}
      Backend-->>Admin: {review_id, status: 'approved'}
      
      Owner->>Dashboard: Dashboard shows: "New review: {rating} stars from {reviewer_name}"
      Owner->>Dashboard: (Optional) Click "Reply to Review"
      Owner->>Backend: POST /api/reviews/:id/reply {comment: '...'}
      Backend->>Backend: Store reply, notify reviewer via email
      
      Visitor->>Website: Visit entity page
      Website->>Backend: GET /api/reviews {directory_id, status: 'approved'}
      Backend-->>Website: [Approved reviews sorted by rating/date]
      Website->>Visitor: Display reviews publicly
    end
    
    alt Owner flags review as inappropriate
      Owner->>Dashboard: Click "Flag" on review
      Dashboard->>Backend: POST /api/reviews/:id/flag {flag_reason: 'Defamatory'}
      Backend->>Backend: UPDATE review {is_flagged: true, flagged_by: owner_id}
      Backend->>Moderator: Alert moderator to review flagged content
      Moderator->>Admin: Review flagged review
      Moderator->>Admin: Decide to keep or remove
    end
  end
```

---

---
