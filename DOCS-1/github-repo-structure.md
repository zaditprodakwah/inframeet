# GitHub Repository Structure & Integration Ecosystem
**Mitra Infrastruktur & Pertumbuhan Digital**  
**Complete Architecture | May 17, 2026**

---

## PART 1: MAIN REPOSITORY STRUCTURE

### Repository Name
```
mitra-infrastruktur
├── Main language: TypeScript
├── Framework: Next.js 14
├── Package manager: pnpm
└── Node: 18+
```

---

## 1.1 ROOT DIRECTORY STRUCTURE

```
mitra-infrastruktur/
│
├── README.md                          # Hub repo documentation
├── CONTRIBUTING.md                    # Contribution guidelines
├── LICENSE                            # Proprietary license
├── .gitignore                         # Git ignore rules
├── .env.example                       # Environment template
├── .env.local                         # Local env (git ignored)
├── .env.production                    # Production env
│
├── package.json                       # Dependencies & scripts
├── pnpm-lock.yaml                     # Lock file for pnpm
├── tsconfig.json                      # TypeScript config
├── next.config.js                     # Next.js config
├── tailwind.config.ts                 # Tailwind CSS config
├── postcss.config.js                  # PostCSS config
│
├── .github/
│   ├── workflows/
│   │   ├── lint.yml                   # Lint on push
│   │   ├── test.yml                   # Test on push
│   │   ├── build.yml                  # Build check
│   │   ├── deploy-staging.yml         # Deploy to staging
│   │   ├── deploy-production.yml      # Deploy to production
│   │   └── security-scan.yml          # Security scan
│   │
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── documentation.md
│   │
│   ├── pull_request_template.md       # PR template
│   └── codeowners                     # Code ownership rules
│
├── docs/                              # Documentation (from previous phase)
│   ├── ARCHITECTURE.md
│   ├── API_SPECIFICATION.md
│   ├── DATABASE_SCHEMA.md
│   ├── LEGAL_OPERATIONS_TEMPLATES.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── MASTER_CHECKLIST.md
│   ├── DASHBOARD_SPECIFICATION.md     # NEW
│   │
│   ├── api/
│   │   ├── endpoints.md               # Endpoint documentation
│   │   ├── authentication.md
│   │   └── webhooks.md
│   │
│   ├── frontend/
│   │   ├── components.md              # Component library docs
│   │   ├── form-system.md             # Form builder docs
│   │   └── styling-guide.md           # Design system docs
│   │
│   ├── database/
│   │   ├── migrations.md
│   │   ├── migrations/
│   │   │   ├── 0001_core_tables.sql
│   │   │   ├── 0002_financial_tables.sql
│   │   │   ├── 0003_legal_tables.sql
│   │   │   ├── 0004_content_tables.sql
│   │   │   └── 0005_supporting.sql
│   │   └── seed-data.sql
│   │
│   ├── deployment/
│   │   ├── vercel.md                  # Vercel deployment guide
│   │   ├── github-actions.md          # CI/CD guide
│   │   ├── env-variables.md
│   │   └── monitoring.md
│   │
│   ├── integrations/
│   │   ├── xendit.md                  # Payment integration
│   │   ├── supabase.md                # Database integration
│   │   ├── sendgrid.md                # Email integration
│   │   ├── google-drive.md            # Drive integration
│   │   └── rss-aggregator.md          # RSS integration
│   │
│   └── security/
│       ├── authentication.md
│       ├── data-protection.md
│       ├── api-security.md
│       └── secrets-management.md
│
├── scripts/
│   ├── setup.sh                       # Initial setup script
│   ├── dev.sh                         # Development start
│   ├── build.sh                       # Production build
│   ├── deploy.sh                      # Deployment script
│   ├── seed-database.js               # Seed script
│   ├── backup-database.sh             # Backup script
│   ├── generate-types.ts              # Generate TS types from DB
│   └── lint-staged.js                 # Pre-commit hook
│
├── config/
│   ├── constants.ts                   # App constants
│   ├── integrations.ts                # Integration configs
│   ├── logger.ts                      # Logger setup
│   ├── analytics.ts                   # Analytics config
│   └── feature-flags.ts               # Feature flags
│
├── apps/
│   ├── frontend/                      # Client-facing next app
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx               # Landing
│   │   │   ├── not-found.tsx
│   │   │   ├── error.tsx
│   │   │   │
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── signup/page.tsx
│   │   │   │   └── forgot-password/page.tsx
│   │   │   │
│   │   │   ├── (marketing)/
│   │   │   │   ├── pricing/page.tsx
│   │   │   │   ├── about/page.tsx
│   │   │   │   └── contact/page.tsx
│   │   │   │
│   │   │   ├── (public-forms)/
│   │   │   │   ├── [form-slug]/page.tsx   # Dynamic form page
│   │   │   │   └── [form-slug]/success/page.tsx
│   │   │   │
│   │   │   ├── portal/                # Client portal (protected)
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── projects/page.tsx
│   │   │   │   ├── projects/[id]/page.tsx
│   │   │   │   ├── invoices/page.tsx
│   │   │   │   ├── files/page.tsx
│   │   │   │   └── settings/page.tsx
│   │   │   │
│   │   │   └── admin/                 # Admin panel (protected)
│   │   │       ├── layout.tsx
│   │   │       ├── dashboard/page.tsx
│   │   │       ├── projects/
│   │   │       │   ├── page.tsx       # List
│   │   │       │   ├── [id]/page.tsx  # Detail
│   │   │       │   └── new/page.tsx   # Create
│   │   │       ├── clients/page.tsx
│   │   │       ├── invoices/page.tsx
│   │   │       ├── team/page.tsx
│   │   │       ├── templates/page.tsx
│   │   │       ├── reports/page.tsx
│   │   │       ├── content/page.tsx
│   │   │       ├── audit/page.tsx
│   │   │       └── settings/page.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                    # shadcn/ui + custom
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── form.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── sidebar.tsx
│   │   │   │   ├── dropdown.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   └── ...other UI components
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── AdminLayout.tsx
│   │   │   │   ├── PortalLayout.tsx
│   │   │   │   ├── PublicLayout.tsx
│   │   │   │   └── Navigation.tsx
│   │   │   │
│   │   │   ├── forms/                 # Form components
│   │   │   │   ├── DynamicFormRenderer.tsx    # Renders form config
│   │   │   │   ├── FormBuilder.tsx           # Form editor
│   │   │   │   ├── MasterBriefForm.tsx
│   │   │   │   ├── ProjectInquiryForm.tsx
│   │   │   │   ├── ContactForm.tsx
│   │   │   │   └── SurveyForm.tsx
│   │   │   │
│   │   │   ├── dashboard/            # Dashboard components
│   │   │   │   ├── KPICard.tsx
│   │   │   │   ├── MetricsGrid.tsx
│   │   │   │   ├── RevenueChart.tsx
│   │   │   │   ├── ProjectBreakdown.tsx
│   │   │   │   ├── TeamUtilization.tsx
│   │   │   │   └── RecentActivity.tsx
│   │   │   │
│   │   │   ├── tables/               # Data table components
│   │   │   │   ├── ProjectDataGrid.tsx
│   │   │   │   ├── ClientDataGrid.tsx
│   │   │   │   ├── InvoiceDataGrid.tsx
│   │   │   │   └── generic/DataGrid.tsx
│   │   │   │
│   │   │   ├── charts/               # Chart components
│   │   │   │   ├── RevenueChart.tsx
│   │   │   │   ├── ProjectTimeline.tsx
│   │   │   │   ├── ClientSegmentation.tsx
│   │   │   │   └── TeamHeatmap.tsx
│   │   │   │
│   │   │   ├── modals/               # Modal components
│   │   │   │   ├── CreateProjectModal.tsx
│   │   │   │   ├── CreateInvoiceModal.tsx
│   │   │   │   ├── AssignStaffModal.tsx
│   │   │   │   └── ConfirmActionModal.tsx
│   │   │   │
│   │   │   ├── marketing/            # Landing page components
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── Features.tsx
│   │   │   │   ├── Testimonials.tsx
│   │   │   │   ├── Pricing.tsx
│   │   │   │   ├── CTA.tsx
│   │   │   │   └── Footer.tsx
│   │   │   │
│   │   │   └── common/
│   │   │       ├── Header.tsx
│   │   │       ├── Sidebar.tsx
│   │   │       ├── LoadingState.tsx
│   │   │       ├── EmptyState.tsx
│   │   │       ├── ErrorState.tsx
│   │   │       └── PageTitle.tsx
│   │   │
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useProjects.ts
│   │   │   ├── useInvoices.ts
│   │   │   ├── useDashboardMetrics.ts
│   │   │   ├── useFormConfig.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── usePagination.ts
│   │   │   ├── useDebounce.ts
│   │   │   └── useAsync.ts
│   │   │
│   │   ├── stores/                   # Zustand stores
│   │   │   ├── authStore.ts
│   │   │   ├── projectStore.ts
│   │   │   ├── uiStore.ts           # UI state (sidebar, theme, etc)
│   │   │   ├── filterStore.ts
│   │   │   └── formStore.ts
│   │   │
│   │   ├── lib/
│   │   │   ├── api-client.ts         # Axios instance + interceptors
│   │   │   ├── supabase-client.ts
│   │   │   ├── form-builder.ts       # Form config to Zod schema
│   │   │   ├── validators.ts         # Zod schemas
│   │   │   ├── formatting.ts         # Number, date, currency formatting
│   │   │   ├── download.ts           # Download file helpers
│   │   │   ├── toast.ts              # Toast notifications
│   │   │   ├── analytics.ts
│   │   │   ├── seo.ts               # SEO helpers
│   │   │   └── utils.ts             # General utilities
│   │   │
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   ├── variables.css         # CSS custom properties
│   │   │   └── animations.css
│   │   │
│   │   ├── public/
│   │   │   ├── logo.svg
│   │   │   ├── favicon.ico
│   │   │   ├── robots.txt
│   │   │   ├── sitemap.xml
│   │   │   └── images/
│   │   │
│   │   └── __tests__/
│   │       ├── unit/
│   │       ├── integration/
│   │       └── e2e/
│   │
│   └── api/                           # API backend (serverless functions)
│       ├── auth/
│       │   ├── login.ts
│       │   ├── signup.ts
│       │   ├── logout.ts
│       │   ├── refresh-token.ts
│       │   └── password-reset.ts
│       │
│       ├── projects/
│       │   ├── [[...slug]].ts        # GET/POST /api/projects
│       │   ├── [id]/route.ts         # GET/PUT/DELETE /api/projects/[id]
│       │   ├── [id]/brief.ts         # Brief endpoints
│       │   ├── [id]/sow.ts           # SoW endpoints
│       │   ├── [id]/contract.ts      # Contract endpoints
│       │   ├── [id]/bast.ts          # BAST endpoints
│       │   └── [id]/timeline.ts      # Timeline data
│       │
│       ├── invoices/
│       │   ├── [[...slug]].ts        # GET/POST invoices
│       │   ├── [id]/route.ts
│       │   ├── [id]/payment-link.ts
│       │   └── reconciliation.ts     # Monthly reconciliation report
│       │
│       ├── clients/
│       │   ├── [[...slug]].ts
│       │   └── [id]/route.ts
│       │
│       ├── team/
│       │   ├── [[...slug]].ts
│       │   └── [id]/route.ts
│       │
│       ├── templates/
│       │   ├── [[...slug]].ts        # GET/POST templates
│       │   ├── [id]/generate.ts      # Generate DOCX from template
│       │   └── [id]/preview.ts       # Preview template
│       │
│       ├── forms/
│       │   ├── [[...slug]].ts        # GET/POST form configs
│       │   ├── [id]/submit.ts        # Form submission handler
│       │   └── [id]/settings.ts      # Form settings
│       │
│       ├── webhooks/
│       │   ├── xendit.ts             # Xendit payment webhooks
│       │   ├── supabase.ts           # Supabase auth webhooks
│       │   └── rss-sync.ts           # RSS aggregation scheduler
│       │
│       ├── content/
│       │   ├── feeds/route.ts        # GET RSS feeds
│       │   ├── tools/route.ts        # GET tools directory
│       │   └── portfolio/route.ts    # GET portfolio cases
│       │
│       ├── reports/
│       │   ├── revenue.ts
│       │   ├── projects.ts
│       │   ├── cash-flow.ts
│       │   ├── team.ts
│       │   └── clients.ts
│       │
│       ├── uploads/
│       │   ├── document.ts           # Upload document
│       │   ├── image.ts              # Upload image
│       │   └── bulk.ts               # Bulk upload
│       │
│       ├── health.ts                 # Health check endpoint
│       ├── [[...catch-all]].ts       # 404 handler
│       │
│       ├── middleware.ts             # Authentication, CORS, rate limit
│       ├── lib/
│       │   ├── auth.ts               # JWT validation
│       │   ├── database.ts           # Supabase client
│       │   ├── validators.ts         # Zod schemas for API
│       │   ├── errors.ts             # Error handling
│       │   ├── xendit.ts             # Xendit SDK wrapper
│       │   ├── storage.ts            # File storage helpers
│       │   ├── email.ts              # Email service (SendGrid)
│       │   ├── docx-generator.ts     # DOCX template rendering
│       │   ├── rss-parser.ts         # RSS feed parser
│       │   ├── form-processor.ts     # Form submission handler
│       │   └── logger.ts             # Logging utilities
│       │
│       └── __tests__/
│           ├── unit/
│           ├── integration/
│           └── fixtures/             # Mock data
│
├── packages/                         # Shared packages (monorepo)
│   ├── shared-types/
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── projects.ts
│   │   │   ├── invoices.ts
│   │   │   ├── clients.ts
│   │   │   ├── forms.ts
│   │   │   ├── auth.ts
│   │   │   └── api-response.ts
│   │   └── tsconfig.json
│   │
│   └── shared-ui/
│       ├── package.json
│       ├── src/
│       │   ├── index.ts
│       │   └── components/           # Shared UI components
│       └── tsconfig.json
│
├── docker/                           # Docker configuration
│   ├── Dockerfile                    # Production image
│   ├── Dockerfile.dev                # Development image
│   └── docker-compose.yml
│
├── nginx/                            # Reverse proxy config
│   └── nginx.conf
│
├── supabase/                         # Supabase configuration
│   ├── config.toml
│   ├── migrations/                   # Database migrations
│   │   ├── 0001_initial_schema.sql
│   │   ├── 0002_rls_policies.sql
│   │   └── 0003_views_and_triggers.sql
│   └── seed.sql                      # Development seed data
│
└── .env template structure:
    DATABASE_URL=postgresql://...
    SUPABASE_URL=https://...supabase.co
    SUPABASE_ANON_KEY=...
    SUPABASE_SERVICE_ROLE_KEY=...
    
    XENDIT_API_KEY=...
    XENDIT_WEBHOOK_TOKEN=...
    
    SENDGRID_API_KEY=...
    SENDGRID_FROM_EMAIL=...
    
    NEXTAUTH_SECRET=...
    NEXTAUTH_URL=https://...
    
    GOOGLE_DRIVE_CLIENT_ID=...
    GOOGLE_DRIVE_CLIENT_SECRET=...
    
    ANALYTICS_TRACKING_ID=...
    SENTRY_DSN=...
    
    NEXT_PUBLIC_API_URL=https://...
    NEXT_PUBLIC_APP_URL=https://...
```

---

## PART 2: SATELLITE REPOSITORIES

Each specialized system has its own repo for independent scaling & deployment.

### 2.1 Admin Dashboard Repository
```
mitra-admin-dashboard
├── Built with: Next.js 14 + TypeScript + TailwindCSS + shadcn/ui
├── Purpose: Enhanced admin controls, reporting, automation
├── Deployed to: Vercel (separate project)
├── Subdomains: admin.mitra-infrastruktur.id
├── Monorepo refs: @/packages/shared-types, @/packages/shared-ui
└── GitHub: github.com/devapenseo/mitra-admin-dashboard
```

**Key features in separate admin repo:**
- Advanced reporting & analytics
- Data export (Excel, PDF)
- Batch operations
- Custom dashboards
- Team collaboration tools
- Compliance & audit tools

---

### 2.2 Form Builder Repository
```
mitra-form-builder
├── Built with: React 18 + TypeScript + Tailwind
├── Purpose: Standalone form builder and renderer
├── Can be: Embedded in main app or standalone tool
├── API: REST endpoints for form config CRUD
├── Npm package: @mitra/form-builder
└── GitHub: github.com/devapenseo/mitra-form-builder
```

**Exports:**
```typescript
export { FormBuilder };      // Editor UI
export { FormRenderer };     // Render form from config
export { useFormConfig };    // Hook to manage config
export { formValidator };    // Validate submissions
```

---

### 2.3 RSS Aggregator Service Repository
```
mitra-rss-aggregator
├── Built with: Node.js + Express + TypeScript
├── Purpose: Scheduled RSS feed fetching, filtering, storage
├── Deployment: Cloud Function (Google Cloud Functions)
├── Trigger: Cloud Scheduler (every 6 hours)
├── Database: Supabase (same shared instance)
└── GitHub: github.com/devapenseo/mitra-rss-aggregator
```

**Key features:**
- Feed parser (multiple formats)
- Duplicate detection (content hashing)
- NLP filtering (keyword relevance)
- Scheduled cron jobs
- Error handling & retries
- Metrics logging

---

### 2.4 Document Generation Service Repository
```
mitra-docx-generator
├── Built with: Node.js + Handlebars + node-docx
├── Purpose: DOCX template rendering for contracts, briefs, BAST
├── API: REST endpoints for template rendering
├── Deployment: Vercel Serverless Functions
├── Database: Supabase (for template storage)
└── GitHub: github.com/devapenseo/mitra-docx-generator
```

**Endpoints:**
```
POST /api/render
  - Input: template_id, data_json
  - Output: binary DOCX stream
  
GET /api/templates
  - List available templates
  
POST /api/templates
  - Upload new template
```

---

### 2.5 CMS & Content Management Repository
```
mitra-cms
├── Built with: Next.js 14 (App Router)
├── Purpose: Landing page, blog, help docs, portfolio management
├── Content: Markdown + WYSIWYG editor
├── Database: Supabase (content stored in `cms_pages` table)
├── Deployed to: Vercel (subdomain: cms.mitra-infrastruktur.id)
└── GitHub: github.com/devapenseo/mitra-cms
```

**Content types:**
- Blog posts (with tags, categories)
- Help documentation (nested pages)
- Landing page sections (hero, features, testimonials)
- FAQ pages
- Legal pages (privacy, terms, etc)

---

### 2.6 Legal & Compliance Repository
```
mitra-legal
├── Content: Markdown (version controlled)
├── Documents: Privacy policy, Terms of service, Data processing addendum
├── Contract templates: DOCX with variables
├── Compliance checklists: GDPR, IDPR, tax compliance
├── Updates: Reviewed by legal team before deployment
└── GitHub: github.com/devapenseo/mitra-legal (private)
```

---

### 2.7 Security & DevOps Repository
```
mitra-infrastructure
├── Contents:
│   ├── Terraform configurations (IaC)
│   ├── Supabase setup scripts
│   ├── Vercel deployment configs
│   ├── GitHub Actions workflows
│   ├── Docker configurations
│   ├── Security policies (OWASP)
│   └── Monitoring & alerting setup
│
├── Deployment: terraform apply (automated via GitHub Actions)
└── GitHub: github.com/devapenseo/mitra-infrastructure (private)
```

---

## PART 3: INTEGRATIONS ECOSYSTEM

### 3.1 Database Integrations

```typescript
// ✅ Supabase (Primary)
- PostgreSQL database
- Real-time subscriptions
- Built-in authentication
- File storage
- Vector search (for AI features)

// Connection in app/api/lib/database.ts
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
```

### 3.2 Payment Integrations

```typescript
// ✅ Xendit (Primary)
- Invoice creation & sending
- Payment link generation
- Webhook for payment confirmation
- Support multiple payment methods

// ✅ Stripe (Optional backup)
- For international clients
- Additional payment methods
- Subscription management

// Implementation: apps/api/lib/xendit.ts
import { Xendit } from 'xendit-sdk';
const xendit = new Xendit({ secretKey: XENDIT_API_KEY });
```

### 3.3 Email Service Integrations

```typescript
// ✅ SendGrid (Primary)
- Transaction emails (invoices, password reset)
- Marketing campaigns
- Template management
- Delivery tracking

// Implementation: apps/api/lib/email.ts
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(SENDGRID_API_KEY);
```

### 3.4 File Storage Integrations

```typescript
// ✅ Supabase Storage (Primary)
- Document storage (DOCX, PDF)
- Image uploads
- File versioning
- Public/private buckets

// ✅ Google Drive (Optional)
- Long-term archival
- Sharing with clients
- Backup synchronization

// Implementation: apps/api/lib/storage.ts
const bucket = supabase.storage.from('documents');
await bucket.upload(path, file);
```

### 3.5 Analytics & Monitoring

```typescript
// ✅ PostHog (Product Analytics)
- Track user behavior
- Feature flag management
- A/B testing

// ✅ Sentry (Error Tracking)
- Error reporting & alerting
- Performance monitoring
- Release tracking

// ✅ LogRocket (Session Replay)
- User session recording (optional)
- Frontend error tracking
- Network logging

// ✅ Vercel Analytics
- Built-in Core Web Vitals tracking
- Edge function performance
- Deployment metrics

// Implementation: lib/analytics.ts
import posthog from 'posthog-js';
import * as Sentry from "@sentry/nextjs";

posthog.init(NEXT_PUBLIC_POSTHOG_KEY);
Sentry.init({ dsn: SENTRY_DSN });
```

### 3.6 Search & Discovery

```typescript
// ✅ Supabase Full-Text Search (Primary)
- PostgreSQL FTS on projects, clients
- Simple implementation, no external service

// ✅ Algolia (Optional scale)
- Advanced search features
- Faceted navigation
- For large datasets

// Implementation: lib/search.ts
const { data } = await supabase
  .from('projects')
  .select()
  .textSearch('fts', searchQuery);
```

### 3.7 Authentication & Authorization

```typescript
// ✅ Supabase Auth (Primary)
- Email/password auth
- OAuth (Google, GitHub)
- JWT tokens
- Session management

// ✅ NextAuth.js (Optional wrapper)
- Middleware integration
- Session persistence
- Multiple auth providers

// Implementation: middleware.ts
import { auth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const session = await auth();
  if (!session && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

### 3.8 AI/ML Integrations

```typescript
// ✅ Groq (RSS content filtering)
- LLM for keyword extraction
- Relevance scoring
- Content summarization

// ✅ Google Gemini (Optional)
- Advanced NLP tasks
- Image recognition
- Multimodal processing

// ✅ OpenAI (Optional)
- GPT for content generation
- Embeddings for semantic search
- Fine-tuning capabilities

// Implementation: apps/api/lib/ai.ts
import Groq from "groq-sdk";
const groq = new Groq({ apiKey: GROQ_API_KEY });
```

### 3.9 Third-Party Services

```typescript
// ✅ Twilio (Optional SMS)
- Payment reminders via SMS
- Two-factor authentication

// ✅ Slack (Optional)
- Team notifications
- Invoice alerts
- Error notifications

// ✅ Google Workspace Integration
- Calendar for scheduling
- Docs for document collaboration

// ✅ Zapier (Optional)
- Workflow automation
- Connect to 5000+ apps
```

---

## PART 4: CI/CD PIPELINE

### 4.1 GitHub Actions Workflows

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: pnpm
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm format:check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: pnpm
      - run: pnpm install
      - run: pnpm test
      - uses: codecov/codecov-action@v3

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: pnpm
      - run: pnpm install
      - run: pnpm build
      - run: pnpm analyze  # Bundle size analysis

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: npm/action-package-json-validate@v1
      - run: npm audit
      - run: npx snyk test
```

### 4.2 Automated Deployments

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging

on:
  push:
    branches: [develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: pnpm
      - run: pnpm install
      - run: pnpm build
      
      - name: Deploy to Vercel Staging
        run: |
          vercel deploy --token=${{ secrets.VERCEL_TOKEN }} --prebuilt
        env:
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID_STAGING }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
      
      - name: Run E2E tests
        run: pnpm test:e2e
        env:
          TEST_URL: https://staging.mitra-infrastruktur.id
      
      - name: Notify Slack
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Staging deployment ${{ job.status }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## PART 5: DEVELOPMENT WORKFLOW

### 5.1 Branch Strategy

```
main (production)
  ├─ Only merge via PR from release/* or hotfix/*
  ├─ Require 2 code review approvals
  └─ Auto-deploy to production on merge

develop (staging)
  ├─ Main development branch
  ├─ Auto-deploy to staging on push
  └─ Merge feature branches via PR

feature/[name]
  ├─ Create from: develop
  ├─ Naming: feature/smart-router, feature/payment-integration
  └─ Delete after merge

bugfix/[name]
  ├─ Create from: develop
  └─ Naming: bugfix/invoice-calculation

hotfix/[name]
  ├─ Create from: main
  ├─ For production bugs only
  └─ Merge back to main & develop
```

### 5.2 Commit Message Convention

```
Format: <type>(<scope>): <subject>

Type:
  feat:     new feature
  fix:      bug fix
  docs:     documentation
  style:    code style (formatting, missing semicolons)
  refactor: refactoring
  perf:     performance improvement
  test:     tests
  ci:       CI configuration
  chore:    build, dependencies

Scope: component/area affected (projects, invoices, dashboard)

Example:
  feat(projects): add smart router component
  fix(invoices): correct payment reconciliation logic
  docs(api): update webhook documentation
```

### 5.3 Local Development Setup

```bash
# Clone repository
git clone https://github.com/devapenseo/mitra-infrastruktur.git
cd mitra-infrastruktur

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your values

# Setup database locally (using Supabase)
supabase start

# Run development server
pnpm dev

# In another terminal, run API server
cd apps/api
pnpm dev

# Open browser to http://localhost:3000
```

---

## PART 6: DEPLOYMENT CHECKLIST

### 6.1 Pre-Production Checklist

```
Code Quality:
  ☐ All tests passing (pnpm test)
  ☐ No linting errors (pnpm lint)
  ☐ No TypeScript errors (pnpm type-check)
  ☐ Code review approved (2+ reviewers)
  ☐ No security vulnerabilities (npm audit)

Performance:
  ☐ Core Web Vitals passing
    - LCP < 2.5s
    - FID < 100ms
    - CLS < 0.1
  ☐ Lighthouse score > 90
  ☐ Bundle size < acceptable limit
  ☐ API response time < 200ms (p95)

Testing:
  ☐ Unit tests > 80% coverage
  ☐ Integration tests passing
  ☐ E2E tests passing (staging)
  ☐ Manual QA on staging

Database:
  ☐ Migrations applied
  ☐ Data backup created
  ☐ RLS policies verified

Security:
  ☐ Secrets rotated
  ☐ HTTPS enabled
  ☐ CORS configured
  ☐ Rate limiting enabled
  ☐ API authentication verified

Documentation:
  ☐ API docs updated
  ☐ Deployment notes documented
  ☐ Known issues documented
  ☐ Rollback plan written
```

### 6.2 Rollback Plan

```bash
# Quick rollback to previous version
gh release list --limit 5

# Revert to previous release
vercel rollback --token=$VERCEL_TOKEN

# Or manually
git revert <commit-hash>
git push origin main
```

---

## IMPLEMENTATION ROADMAP

**Week 1:** Setup main repo structure
**Week 2:** Initialize satellite repos
**Week 3:** Configure CI/CD pipelines
**Week 4:** Integrate all services
**Week 5:** Testing & optimization
**Week 6+:** Continuous deployment

---

**Status:** ✅ Ready for GitHub Implementation  
**Last Updated:** May 17, 2026
