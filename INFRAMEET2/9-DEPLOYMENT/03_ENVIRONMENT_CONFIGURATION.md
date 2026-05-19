# INFRAMEET - Environment & Feature Flags

## Environment Template
---
# SECTION 3: ENVIRONMENT CONFIGURATION

## 3.1 `.env.example` Template

Create this file at project root for reference. DO NOT commit secrets.

```env
# ============================================================================
# INFRAMEET — ENVIRONMENT CONFIGURATION TEMPLATE
# ============================================================================
# CRITICAL: This file is an EXAMPLE. Create .env.local with actual secrets.
# DO NOT commit .env.local to git. Use GitHub Secrets or environment manager.

# ============================================================================
# SUPABASE (Database + Auth)
# ============================================================================
# Get these from: https://app.supabase.com/project/[PROJECT_ID]/settings/api

NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # KEEP SECRET
SUPABASE_JWT_SECRET=your-jwt-secret-from-settings

# OAuth Providers (for login)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx  # KEEP SECRET

# ============================================================================
# AUTHENTICATION & JWT
# ============================================================================
NEXTAUTH_SECRET=generated-by-openssl-rand-base64-32  # Use: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000  # Change in production to https://yourdomain.com

# ============================================================================
# CLOUDFLARE (CAPTCHA + CDN)
# ============================================================================
# Get from: https://dash.cloudflare.com/ > Turnstile

NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
CLOUDFLARE_TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA  # KEEP SECRET

# Optional: Cloudflare R2 for file storage
CLOUDFLARE_R2_ACCOUNT_ID=xxxxx
CLOUDFLARE_R2_ACCESS_KEY=v1.0c48ce...  # KEEP SECRET
CLOUDFLARE_R2_SECRET_KEY=abc123...  # KEEP SECRET
CLOUDFLARE_R2_BUCKET=inframeet-prod

# ============================================================================
# CLOUDINARY (File Upload Alternative to R2)
# ============================================================================
# Get from: https://cloudinary.com/console

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx  # KEEP SECRET
CLOUDINARY_API_SECRET=xxxxx  # KEEP SECRET

# Use either Cloudinary OR R2 (not both recommended)
FILE_STORAGE_PROVIDER=cloudinary  # or 'r2'

# ============================================================================
# PAYMENT GATEWAY (Stripe for escrow/subscription)
# ============================================================================
# Get from: https://dashboard.stripe.com/apikeys

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx  # KEEP SECRET
STRIPE_WEBHOOK_SECRET=whsec_xxxxx  # KEEP SECRET

# For Wise (alternative payment for payouts)
WISE_API_TOKEN=xxxxx  # KEEP SECRET
WISE_BUSINESS_ACCOUNT_ID=xxxxx

# ============================================================================
# EMAIL SERVICE (Transactional emails)
# ============================================================================
# Use SendGrid, Mailgun, Resend, or own SMTP

EMAIL_SERVICE_PROVIDER=sendgrid  # sendgrid | mailgun | resend | smtp
SENDGRID_API_KEY=SG.xxxxx  # KEEP SECRET (if using SendGrid)
MAILGUN_API_KEY=key-xxxxx  # KEEP SECRET (if using Mailgun)
MAILGUN_DOMAIN=mg.yourdomain.com

# For SMTP (if self-hosted)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com  # KEEP SECRET
SMTP_PASSWORD=app-specific-password  # KEEP SECRET
SMTP_FROM=noreply@inframeet.com

# ============================================================================
# THIRD-PARTY APIs
# ============================================================================

# OpenAlex (Academic profiles enrichment)
OPENALEX_API_URL=https://api.openalex.org
OPENÄLEX_EMAIL=your-email@company.com  # Required by OpenAlex

# For future: RSS feed ingestion, etc
RSS_INGEST_ENABLED=true
RSS_MAX_FEEDS=50

# ============================================================================
# GITHUB ACTIONS (Worker automation)
# ============================================================================
# For worker jobs triggered via GitHub Actions

GITHUB_TOKEN=ghp_xxxxx  # KEEP SECRET
GITHUB_OWNER=your-org
GITHUB_REPO=inframeet

# Secrets to pass to Actions workflow
WORKER_LOG_LEVEL=info  # debug | info | warn | error

# ============================================================================
# APPLICATION CONFIGURATION
# ============================================================================

# Environment
NODE_ENV=development  # development | production | test
NEXT_PUBLIC_ENVIRONMENT=development

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_WIDGET_CDN_URL=http://localhost:3000/widgets

# Database logging
DATABASE_LOG_QUERIES=false  # Enable in development for debugging
DATABASE_POOL_SIZE=10

# Rate limiting config
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MS=3600000  # 1 hour
RATE_LIMIT_MAX_REQUESTS=100

# Spam detection config
SPAM_CHECK_ENABLED=true
SPAM_SCORE_THRESHOLD=0.7  # Flag if >= 0.7

# Logging & monitoring
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx  # Error tracking
POSTSHOG_API_KEY=phc_xxxxx  # Product analytics

# ============================================================================
# SUBSCRIPTION & BILLING
# ============================================================================

# Plan limits
PLAN_FREE_PROOFS_LIMIT=3
PLAN_FREE_INQUIRIES_LIMIT=5
PLAN_FREE_WIDGETS_LIMIT=1

PLAN_PRO_PROOFS_LIMIT=99999
PLAN_PRO_INQUIRIES_LIMIT=99999
PLAN_PRO_WIDGETS_LIMIT=5

# Pricing (in USD cents)
PRICE_VERIFICATION_BASIC=9900  # $99
PRICE_VERIFICATION_PRIORITY=19900  # $199
PRICE_PRO_MONTHLY=4900  # $49/month
PRICE_BUSINESS_MONTHLY=29900  # $299/month

# ============================================================================
# OPTIONAL: ADVANCED FEATURES
# ============================================================================

# AI/ML for proof review automation (future)
OPENAI_API_KEY=sk-xxxxx  # KEEP SECRET (if using GPT for validation)

# Elasticsearch (if full-text search needed)
ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_USER=elastic
ELASTICSEARCH_PASSWORD=xxxxx  # KEEP SECRET

# Redis (for caching + rate limiting)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=  # Leave empty if no auth

# ============================================================================
# LEGAL & COMPLIANCE
# ============================================================================

# Data retention
DATA_RETENTION_DAYS=365  # Auto-delete soft-deleted records after N days

# GDPR / Privacy
GDPR_ENABLED=true
PRIVACY_POLICY_URL=https://inframeet.com/privacy
TERMS_URL=https://inframeet.com/terms

# ============================================================================
# END OF TEMPLATE
# ============================================================================
```

## 3.2 Configuration Checklist for Deployment

Before deploying to production, verify all of:

```markdown
## Pre-Deployment Configuration Checklist

### Authentication & Security
- [ ] Supabase JWT secret is set (not default)
- [ ] NEXTAUTH_SECRET is generated (openssl rand -base64 32)
- [ ] All SECRET keys are stored in GitHub Secrets (not in code)
- [ ] Google OAuth credentials created and whitelisted
- [ ] NEXTAUTH_URL changed from localhost to production domain

### Database
- [ ] Supabase project created and database migrated
- [ ] RLS policies enabled on all tables
- [ ] Backup configured (automated daily snapshots)
- [ ] Connection pooling enabled for production load

### File Storage
- [ ] Cloudinary OR Cloudflare R2 configured (choose ONE)
- [ ] CORS policy set to allow only your domain
- [ ] Max file size limits enforced (50MB)
- [ ] Antivirus scanning enabled (if available)

### CAPTCHA
- [ ] Cloudflare Turnstile site key created
- [ ] Turnstile integrated on all public forms (inquiry, review, claim)
- [ ] CAPTCHA validation tested in staging

### Payment Processing
- [ ] Stripe production keys configured
- [ ] Webhook endpoint created and tested (/api/webhooks/stripe)
- [ ] Payout method configured (bank account for payouts)
- [ ] PCI compliance checklist reviewed

### Email
- [ ] SendGrid/Mailgun account created and API key set
- [ ] Sender domain verified (SPF, DKIM, DMARC)
- [ ] Email templates created (claim verification, proof approval, inquiry received)
- [ ] Transactional emails tested in staging

### Monitoring & Logging
- [ ] Sentry project created for error tracking
- [ ] PostHog configured for product analytics
- [ ] Log aggregation set up (CloudWatch, LogRocket, etc)
- [ ] Alerts configured for critical errors (database down, payment failure)

### Infrastructure
- [ ] Vercel project created, domain configured
- [ ] GitHub repo connected to Vercel for auto-deploy
- [ ] Environment variables set in Vercel project settings
- [ ] Preview deployments enabled for staging
- [ ] Caching strategy set (stale-while-revalidate for listings)

### Worker Jobs (GitHub Actions)
- [ ] GitHub Actions workflow created (.github/workflows/worker.yml)
- [ ] Schedule set for background jobs (decay: daily at 2 AM, widget rewards: daily at 1 AM)
- [ ] GitHub Token created with repo:write access
- [ ] Worker environment variables passed to Actions

### Legal & Compliance
- [ ] Privacy Policy created and published
- [ ] Terms of Service created and published
- [ ] Dispute/Appeal policy documented
- [ ] Data retention policy set
- [ ] GDPR consent management configured (if serving EU users)

### SEO & Analytics
- [ ] robots.txt configured to allow indexing
- [ ] sitemap.xml endpoint created (/sitemap.xml)
- [ ] Google Search Console property verified
- [ ] Google Analytics 4 configured (NEXT_PUBLIC_GA_ID)
- [ ] OG tags set for social sharing

### Performance
- [ ] Database indexes verified (critical: omni_directory, trust_proofs, entity_inquiries)
- [ ] API response times monitored (target < 200ms)
- [ ] Image optimization tested (Next.js Image)
- [ ] CDN caching verified for static assets

### Security Audit
- [ ] SSL/TLS certificate installed and auto-renewed
- [ ] CORS policy reviewed (only allow same-origin + widget domains)
- [ ] SQL injection prevention verified (parameterized queries)
- [ ] XSS prevention verified (all user inputs sanitized)
- [ ] Rate limiting configured and tested
- [ ] Disposable email list imported

### Final Production Tests
- [ ] Full user flow tested: sign up → claim → proof upload → approval
- [ ] Widget embed tested on external site
- [ ] Inquiry submission tested with CAPTCHA
- [ ] Review submission and moderation workflow tested
- [ ] Email deliverability tested (verification codes, notifications)
- [ ] Payment flow tested (create escrow → release → payout)
- [ ] Admin dashboard functional (metrics, moderation queue)
- [ ] Mobile responsiveness verified
- [ ] Performance tested under load (50 concurrent users)

### Post-Launch Monitoring
- [ ] Error rate baseline established
- [ ] User funnel metrics being tracked
- [ ] Database query performance being monitored
- [ ] Incident response plan documented
- [ ] On-call rotation established for critical issues
```

---

## Feature Flag Architecture
To support continuous integration without risking active directory services, INFRAMEET implements feature flags.

### 1. Feature Flag Enum Definition
```typescript
export enum FeatureFlags {
  ESCROW_SYSTEM = 'FF_ESCROW_SYSTEM',
  ACADEMIC_ENRICHMENT = 'FF_ACADEMIC_ENRICHMENT',
  SEMANTIC_SEARCH = 'FF_SEMANTIC_SEARCH',
  MAINTENANCE_MODE = 'FF_MAINTENANCE_MODE'
}
```

### 2. Configuration Matrix
Feature flags are managed using environment variables.

| Variable Name | Default Value | Purpose |
|---------------|---------------|---------|
| `NEXT_PUBLIC_FF_ESCROW_SYSTEM` | `false` | Toggles escrow ledger modules globally. |
| `NEXT_PUBLIC_FF_ACADEMIC_ENRICHMENT`| `true` | Enables OpenAlex data indexing workers. |
| `NEXT_PUBLIC_FF_MAINTENANCE_MODE` | `false` | Puts all public paths into maintenance view.|
