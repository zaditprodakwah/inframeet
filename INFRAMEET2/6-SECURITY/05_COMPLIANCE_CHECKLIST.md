# INFRAMEET - Compliance & Legal Frameworks

This checklist guarantees INFRAMEET aligns with international GDPR standards and local laws regarding user data safety.

---
# SECTION 5: COMPLIANCE & LEGAL FRAMEWORK

## 5.1 Legal Risks & Mitigations

| Risk | Mitigation | Responsible Party | Timeline |
|------|-----------|-------------------|----------|
| False/misleading verification badges | Publish verification methodology transparently | Legal + Product | Before launch |
| Defamatory reviews | Review moderation policy + appeal process + author identification requirement | Moderation team | Day 1 |
| Unauthorized data processing (GDPR) | Privacy policy + consent checkboxes + data deletion API | Legal + Engineering | Before launch |
| Impersonation via fake claims | Multi-factor claim verification (email + DNS + optional manual) | Product | Phase 1 |
| Dispute resolution (escrow) | Clear dispute policy + arbitration clause in ToS | Legal | Before monetization |
| Accessibility (WCAG) | WCAG 2.1 AA audit + screen reader testing | Design + QA | Phase 2 |
| Payment compliance (PCI) | Use Stripe tokenization (never store raw cards) | Engineering | Phase 1 |

## 5.2 Documents to Create (Legal)

### 1. Terms of Service (ToS)
Must include:
- User responsibilities (no impersonation, no spam proofs)
- Verification disclaimer: "Verification ≠ endorsement"
- Liability limitations
- Dispute resolution process (arbitration recommended)
- Proof rejection appeal rights
- Account suspension clause

### 2. Privacy Policy
Must include:
- What data we collect (email, claims, proofs, inquiries)
- Why we collect (account management, verification, moderation)
- Who we share with (payment processors, email service, analytics)
- Retention periods
- User rights (access, deletion, export)
- GDPR/CCPA compliance statements (if applicable)

### 3. Verification Methodology Document
Public document explaining:
- How claims are verified (email, DNS, manual review)
- What proofs we accept (awards, certifications, media mentions)
- Proof review criteria (5-10 criteria to publish)
- How trust scores are calculated (formula: simple examples)
- How long badges are valid
- How to appeal rejections

### 4. Dispute & Appeal Policy
For proof rejections:
- 7-day appeal window
- Appeals handled by different verifier
- Clear feedback provided
- Possible outcomes (approved, rejected, modified requirements)

For review flags:
- Owner can flag offensive reviews
- 48-hour moderator response SLA
- Reviews removed if legally defamatory
- False flag consequences

### 5. Data Deletion & GDPR Compliance
Must support:
- `DELETE /api/users/me` → Soft delete profile + all PII
- Data export: `GET /api/users/me/export` → JSON dump of user data
- Right to be forgotten: Delete claims, inquiries, reviews submitted by user (anonymize)
- Retention: Audit logs kept for 1 year (legal requirement)

## 5.3 Proactive Compliance Actions

### Before MVP Launch:
- [ ] Draft ToS (use Stripe's template as starting point)
- [ ] Draft Privacy Policy (use Vercel/Supabase templates)
- [ ] Consult with lawyer (1-2 hours) on jurisdiction (Indonesia-focused, but global)
- [ ] Add cookie consent banner (if using analytics)
- [ ] Set up GDPR compliance: Data deletion flow + export API
- [ ] Document moderation policy (auto-generated, available publicly)

### Phase 1 (First 100 users):
- [ ] Publish Verification Methodology (transparency builds trust)
- [ ] Create Dispute/Appeal policy
- [ ] Set up legal folder in repo: `/docs/legal/`

### Phase 2+ (Investor Due Diligence):
- [ ] Full legal audit by startup lawyer
- [ ] Liability insurance quotes (errors & omissions)
- [ ] Standard contract for business API users (if offering API)
- [ ] DPA (Data Processing Agreement) if handling EU user data

---
