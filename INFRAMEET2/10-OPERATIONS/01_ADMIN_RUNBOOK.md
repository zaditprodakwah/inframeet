# INFRAMEET - Admin Operations Manual

## Daily Operations Routine
This guide details the routine tasks required of human moderators and verifiers.

---
# SECTION 6: MODERATION SYSTEM (SOP)

## 6.1 Moderation Queue Architecture

```
User Action (submit proof, inquiry, review)
  ↓
INSERT into DB + INSERT into staging_inbox
  ↓
Worker Job (async spam check) [if enabled]
  ├─ If spam_score > 0.8: auto-flag
  ├─ If spam_score 0.5-0.8: send to queue (manual review)
  └─ If spam_score < 0.5: approve (publish immediately)
  ↓
Moderator Dashboard (queued items)
  ├─ Proof reviews (awaiting approval)
  ├─ Flagged inquiries (suspected spam)
  ├─ Flagged reviews (inappropriate language)
  └─ Flagged entities (possible fraud)
  ↓
Moderator Decision (approve / reject / request info)
  ↓
Item published OR rejected OR escalated to admin
```

## 6.2 Moderation SOP (Step-by-Step)

### Proof Review SOP

```
1. OPEN PROOF REVIEW QUEUE
   - Moderator logs into /admin/proofs/queue
   - Filter by: newest, highest-priority, or assigned-to-me
   - See: proof title, type, submitted date, metadata, uploaded file preview

2. EVALUATE PROOF
   Checklist:
   ✓ Does proof file exist and is readable?
   ✓ Does content match claim (e.g., certificate = award)?
   ✓ Is document recent enough (< 2 years for most)?
   ✓ Is there any indication of forgery/photoshop?
   ✓ Does it boost credibility meaningfully?
   
   Rejection reasons (select one):
   - UNVERIFIABLE: Can't validate authenticity
   - EXPIRED: Certificate/award too old
   - UNRELATED: Doesn't match entity type
   - SPAM: Duplicate or irrelevant
   - DEFAMATORY: Contains harmful claims
   - PLAGIARISM: Copied from someone else
   
3. DECISION
   APPROVE:
   - Assign trust_points: 1-50 (higher = more credible)
   - Example: "Certified by ISO" = 10pts, "Feature in Forbes" = 15pts
   - Click APPROVE button
   - System creates reputation_log + updates trust_score
   - Owner notified: "Proof approved! +10 trust points"
   
   REJECT:
   - Select rejection reason
   - Optional: Add detailed feedback (e.g., "This certificate appears to be Photoshopped")
   - Click REJECT
   - Owner can appeal within 7 days
   - Detailed feedback visible to owner (not public)
   
   REQUEST MORE INFO:
   - Add comment: "Please provide document with current date stamp"
   - Set deadline: 14 days
   - System emails owner with request
   - Proof remains in PENDING queue
   
4. SLA TARGETS
   - Proof review: 24-48 hours after submission
   - Appeal review: 72 hours
   - Quality target: <5% false rejections (measured monthly)

5. ESCALATION
   - If unsure: Add note "ESCALATE" + tag @admin
   - Admin reviews in next 24h
   - Complex cases (legal documents, academic creds) → external verifier
```

### Inquiry (Leads) Moderation SOP

```
1. OPEN INQUIRY QUEUE
   - Moderator views /admin/inquiries
   - Filter by: is_spam_flagged=true, status=new
   - See: sender_email, subject, message, spam_score, submission_date

2. ASSESS SPAM
   Heuristics checked by system:
   ✓ Excessive links (>3 links = suspicious)
   ✓ All-caps (ALL CAPS = spam signal)
   ✓ Keyword spam (pharmacy, casino, loan = auto-flag)
   ✓ Sender reputation (disposable email, new email = risk)
   ✓ Message quality (too short <10 chars or too long >5000 = suspicious)
   
   Moderator override:
   APPROVE (not spam):
   - Check "This is legitimate inquiry"
   - Unmark is_spam_flagged
   - Owner receives notification (can respond)
   
   REJECT (confirmed spam):
   - Mark is_spam_flagged=true
   - Do NOT notify owner (to avoid spam confirmation)
   - Add note: "Pharmacy spam link detected"
   - Sender email auto-added to block list (future inquiries auto-rejected)
   
   IGNORE:
   - Leave flagged (review later if needed)
   - No action taken

3. SLA
   - New inquiries: delivered to owner within 4 hours OR flagged as spam
   - Response rate target: Owner responds to 80% of non-spam inquiries

4. ACTION AGAINST REPEAT SPAMMERS
   - If same sender submits 5+ spam inquiries:
     → Block sender email
     → Block sender IP
     → Report to abuse team
```

### Review Moderation SOP

```
1. OPEN REVIEW QUEUE
   - Moderator views /admin/reviews
   - Filter by: status=pending, is_flagged=true
   - See: reviewer_name, rating, comment, submission_date, spam_score

2. ASSESS REVIEW QUALITY
   Check for:
   ✓ Explicit hate speech, slurs, profanity
   ✓ Defamatory claims (false accusation of fraud, abuse)
   ✓ Off-topic content (not about entity being reviewed)
   ✓ Spam/advertising (promoting competitor)
   ✓ Duplicate reviews (same reviewer reviewing same entity multiple times)
   
   Common rejection reasons:
   - HATE_SPEECH: "This business is run by [slur]"
   - DEFAMATORY: "Owner stole my money and is a criminal" (unsubstantiated)
   - SPAM: "Check out my business: www.competitor.com"
   - OFF_TOPIC: Review about restaurant but rating a hair salon
   - DUPLICATE: Same reviewer, similar comment, submitted twice

3. DECISION
   APPROVE:
   - Click APPROVE
   - Review published publicly
   - Owner can reply (optional)
   
   REJECT:
   - Select reason
   - Add feedback (NOT visible to reviewer, internal notes only)
   - Email sent to reviewer: "Your review was not published. Reason: [generic reason]"
   - Reviewer can APPEAL: "Explain why you think this was wrong"
   
   REQUEST REVISION:
   - Comment: "Please remove unsubstantiated claims about owner"
   - Deadline: 7 days
   - Reviewer gets email with request
   - Can update or abandon
   
4. OWNER CAN FLAG REVIEWS
   - Owner sees published review, clicks "Report"
   - Reason: Defamatory, Spam, Fake reviewer, Off-topic
   - Moderator prioritizes owner-flagged reviews (SLA: 24 hours)
   - If approved flag: Review removed + reviewer warned
   - If rejected flag: Stays published + owner notified "Your report was reviewed"

5. ESCALATION
   - Reviews containing legal threats → immediate escalation to admin
   - Mass report on single entity → investigate coordinated attack
   - Patterns in review spam → report to INFRAMEET abuse team
```

### Entity Flagging SOP

```
1. WHEN TO FLAG ENTITY
   Trigger scenarios:
   ✓ Moderator detects fraudulent proof (fake awards)
   ✓ Multiple user reports for same issue
   ✓ Banned advertiser/spammer reappears with new account
   ✓ Legal threat/DMCA complaint about entity
   ✓ Network attack (sudden influx of positive reviews)
   
2. FLAG PROCESS
   - Moderator: POST /api/admin/entities/flag
   - Select severity: LOW (warning) | MEDIUM (investigation) | HIGH (immediate suspend)
   - Add detailed reason with evidence
   - Update omni_directory.verification_status = 'flagged'
   - Entity profile shows: "This listing is under review"
   
3. ADMIN INVESTIGATION
   - Admin reviews flag details
   - Check entity history: claims, proofs, reviews, inquiries
   - Look for patterns (spam, fraud, harassment)
   - Decision: 
     CLEAR: Unflag + restore status
     WARN: Send warning email to owner
     SUSPEND: Delete listing (soft delete)
     REPORT: Send to law enforcement (if illegal activity)
   
4. APPEAL PROCESS
   - Owner notified of flag + reason
   - Owner can file appeal: "Why this flag is wrong"
   - Different admin reviews appeal
   - Decision within 7 days
```

## 6.3 Moderation Metrics & Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Proof review SLA | 24-48 hours | Avg time pending → approved/rejected |
| Appeal response SLA | 72 hours | Avg time appeal filed → decision |
| False rejection rate | < 5% | Owner appeals + appeals successful |
| Spam detection accuracy | > 90% | True positives / all flagged |
| Moderator productivity | 50 items/day | Items reviewed per moderator |
| Quality score (internal) | > 8.5/10 | Supervisor audit of 10% of decisions |
| Uptime of queue | > 99.9% | Queue system availability |

---

### Daily Verification Checks
1. Log in to the verifier dashboard.
2. Filter the queue for `status = 'pending'` trust proofs.
3. Review uploaded files, match them against registered entity details, and confirm.
4. Execute decisions (Approve/Reject) using the dashboard panel.
