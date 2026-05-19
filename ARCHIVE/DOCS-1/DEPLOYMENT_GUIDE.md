# GitHub Repository Setup & Deployment Guide

**For AI Coder Integration** | Version 1.0 | May 2026

---

## Phase 1: Repository Initialization

### 1.1 Create GitHub Repository

```bash
# Create repo on GitHub (https://github.com/new)
# Name: mitra-infrastruktur
# Description: Platform Infrastruktur & Pertumbuhan Digital
# Visibility: Private
# Initialize with: README.md, .gitignore (Node.js), MIT License

# Clone locally
git clone https://github.com/devapenseo/mitra-infrastruktur.git
cd mitra-infrastruktur
```

### 1.2 Project Structure

```
mitra-infrastruktur/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                    # Lint, test, build
│   │   ├── deploy-staging.yml        # Deploy to staging Vercel
│   │   └── deploy-production.yml     # Deploy to production
│   └── CODEOWNERS                    # PR review assignments
│
├── apps/
│   ├── frontend/                     # Next.js app
│   │   ├── pages/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── styles/
│   │   ├── public/
│   │   ├── package.json
│   │   ├── next.config.js
│   │   ├── tsconfig.json
│   │   └── .env.local.example
│   │
│   └── api/                          # Supabase Edge Functions + webhooks
│       ├── functions/
│       │   ├── rss-aggregator/
│       │   ├── payment-webhook/
│       │   ├── project-intake/
│       │   └── ...
│       ├── migrations/
│       ├── seeds/
│       └── supabase.json
│
├── docs/
│   ├── README.md
│   ├── ARCHITECTURE.md
│   ├── API_SPECIFICATION.md
│   ├── DATABASE_SCHEMA.md
│   ├── LEGAL_OPERATIONS_TEMPLATES.md
│   └── SECURITY.md
│
├── config/
│   ├── .env.example
│   ├── .env.production.example
│   ├── supabase.json
│   └── vercel.json
│
├── templates/
│   ├── master-brief-template.json
│   ├── sow-template.json
│   ├── contract-kemitraan.json
│   └── bast-template.json
│
├── scripts/
│   ├── setup.sh
│   ├── deploy.sh
│   ├── seed-data.sql
│   └── migrate.sh
│
├── .gitignore
├── package.json (root)
├── pnpm-workspace.yaml (or lerna config)
└── README.md
```

### 1.3 Initialize Dependencies

```bash
# Install pnpm globally (recommended for monorepo)
npm install -g pnpm

# Create root package.json
cat > package.json << 'EOF'
{
  "name": "mitra-infrastruktur",
  "version": "0.1.0",
  "private": true,
  "description": "Platform Infrastruktur & Pertumbuhan Digital",
  "scripts": {
    "setup": "pnpm install && ./scripts/setup.sh",
    "dev": "pnpm -r --parallel run dev",
    "build": "pnpm -r run build",
    "test": "pnpm -r run test",
    "lint": "pnpm -r run lint",
    "type-check": "pnpm -r run type-check",
    "format": "prettier --write ."
  },
  "dependencies": {
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "prettier": "^3.0.0",
    "husky": "^8.0.0",
    "lint-staged": "^14.0.0"
  }
}
EOF

# Initialize pnpm workspace
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'apps/*'
EOF

pnpm install
```

### 1.4 Git Configuration

```bash
# Setup git hooks (pre-commit linting)
npx husky install

cat > .husky/pre-commit << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
pnpm run lint
pnpm run type-check
EOF

chmod +x .husky/pre-commit

# Initial commit
git add .
git commit -m "chore: initial repository setup"
git push origin main
```

---

## Phase 2: Frontend Setup (Next.js)

### 2.1 Initialize Next.js App

```bash
cd apps/frontend

# Create Next.js app with TypeScript
pnpm create next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --use-pnpm \
  --no-git

# Install additional dependencies
pnpm add \
  @supabase/supabase-js \
  axios \
  react-hook-form \
  zod \
  zustand \
  @tanstack/react-query \
  recharts \
  date-fns \
  uuid

# Dev dependencies
pnpm add -D \
  @types/node \
  typescript \
  @typescript-eslint/eslint-plugin \
  tailwindcss \
  postcss \
  autoprefixer
```

### 2.2 Environment Setup

```bash
# Frontend .env.local
cat > .env.local.example << 'EOF'
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Third-party
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
XENDIT_SECRET_KEY=xnd_live_...
GROQ_API_KEY=gsk_...
GEMINI_API_KEY=AIza...

# Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-...
EOF

cp .env.local.example .env.local
```

### 2.3 Core Pages & Routes

```bash
mkdir -p pages/api pages/enterprise pages/academic pages/admin

# pages/index.tsx — Landing page with Smart Router
# pages/enterprise/index.tsx — Enterprise track
# pages/academic/index.tsx — Academic track
# pages/admin/dashboard.tsx — Internal dashboard
# pages/api/webhooks/xendit.ts — Payment webhook
```

### 2.4 next.config.js

```javascript
// apps/frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'supabase.co',
      'cdn.example.com'
    ]
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }
};

module.exports = nextConfig;
```

---

## Phase 3: Supabase Setup

### 3.1 Create Supabase Project

1. Go to https://supabase.com
2. Create new project
3. Save credentials:
   - Project URL
   - Public Anon Key
   - Service Role Key

### 3.2 Initialize Supabase CLI

```bash
cd apps/api

# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to project
supabase link --project-id=<project-id>

# Create migrations folder
mkdir -p supabase/migrations
```

### 3.3 Deploy Database Schema

```bash
# Copy migration files from docs/DATABASE_SCHEMA.md
# Create files in supabase/migrations/

# 0001_core_tables.sql
# 0002_financial_tables.sql
# 0003_legal_tables.sql
# 0004_content_tables.sql
# 0005_supporting.sql

# Push migrations
supabase db push

# Or manual: paste DDL into Supabase dashboard SQL editor
```

### 3.4 Seed Data (Optional)

```bash
# supabase/seeds/seed.sql
INSERT INTO rss_feeds (feed_name, feed_url, source_category) VALUES
  ('TechCrunch', 'https://techcrunch.com/feed/', 'technology'),
  ('CSS-Tricks', 'https://css-tricks.com/feed/', 'design');

# Run seed
psql -U postgres -f supabase/seeds/seed.sql
```

---

## Phase 4: Xendit Payment Integration

### 4.1 Xendit Setup

1. Create Xendit account at https://xendit.co
2. Generate API Keys (test + live)
3. Add to environment variables

### 4.2 Webhook Configuration

```bash
# In Xendit dashboard:
# Settings → Callbacks/Webhooks
# Add endpoint: https://yourdomain.com/api/webhooks/xendit

# Webhook signature verification in code:
# apps/frontend/pages/api/webhooks/xendit.ts
```

### 4.3 Sample Webhook Handler

```typescript
// apps/frontend/pages/api/webhooks/xendit.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).end();

  const signature = req.headers['x-xendit-webhook-token'];
  const computedSignature = crypto
    .createHash('sha256')
    .update(JSON.stringify(req.body) + process.env.XENDIT_SECRET_KEY)
    .digest('hex');

  if (signature !== computedSignature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const { id, status, amount, paid_at } = req.body;

  // Update invoice status in Supabase
  // Trigger final payment release if all invoices paid

  res.status(200).json({ success: true });
}
```

---

## Phase 5: Deployment (Vercel + Supabase)

### 5.1 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend folder
cd apps/frontend
vercel

# When prompted:
# Link to existing project or create new
# Set environment variables (copy from .env.local)

# Subsequent deployments:
git push origin main
# (Automatic via GitHub integration)
```

### 5.2 Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "pnpm run build",
  "installCommand": "pnpm install",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}
```

### 5.3 Environment Variables on Vercel

Dashboard → Settings → Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
XENDIT_SECRET_KEY=...
GROQ_API_KEY=...
GEMINI_API_KEY=...
```

### 5.4 Custom Domain & SSL

1. Vercel dashboard → Domains
2. Add custom domain (e.g., api.mitra-infrastruktur.id)
3. SSL automatically provisioned (Let's Encrypt)

---

## Phase 6: CI/CD Pipeline (GitHub Actions)

### 6.1 Setup GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm run lint
      - run: pnpm run type-check
      - run: pnpm run test
      - run: pnpm run build

  deploy-staging:
    needs: lint-and-test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_STAGING }}
          scope: ${{ secrets.VERCEL_ORG_ID }}

  deploy-production:
    needs: lint-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_PRODUCTION }}
          scope: ${{ secrets.VERCEL_ORG_ID }}
          production: true
```

### 6.2 GitHub Secrets Setup

Add to repo settings:
```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID_STAGING
VERCEL_PROJECT_ID_PRODUCTION
```

---

## Phase 7: AI Coder Integration

### 7.1 GitHub Connection in AI Coder

```
Google Antigravity IDE → Settings → GitHub
  Repository: devapenseo/mitra-infrastruktur
  Branch: develop (for feature work)
  Auto-sync: enabled
```

### 7.2 AI Coder Workflow

```
1. Open AI Coder
2. Select folder: apps/frontend (or apps/api)
3. Paste API spec from docs/API_SPECIFICATION.md
4. Paste component spec or endpoint requirements
5. AI generates code
6. Review diff
7. Commit to feature branch:
   git checkout -b feature/smart-router
   git add .
   git commit -m "feat: implement smart router component"
   git push origin feature/smart-router
8. Create PR on GitHub
9. CI/CD runs tests
10. Merge to develop (staging deploy)
11. Later: merge develop → main (production deploy)
```

### 7.3 Useful Prompts for AI Coder

**For Frontend Components:**
```
Based on the Smart Router spec in docs/ARCHITECTURE.md:
- Create a React component that displays the segment selection quiz
- Use TypeScript, Tailwind CSS, and React Hook Form
- Validate answers and navigate to /enterprise or /academic
- Store selection in Zustand state
```

**For API Endpoints:**
```
Based on the API_SPECIFICATION.md:
- Implement POST /api/projects/brief endpoint
- Validate request with Zod schema
- Insert into Supabase briefs table
- Return 201 with brief_id
- Include error handling
```

---

## Phase 8: Local Development

### 8.1 Setup Local Environment

```bash
# Clone repo
git clone https://github.com/devapenseo/mitra-infrastruktur.git
cd mitra-infrastruktur

# Install dependencies
pnpm install

# Copy environment files
cp apps/frontend/.env.local.example apps/frontend/.env.local
cp apps/api/.env.example apps/api/.env

# Start local Supabase (optional)
supabase start

# Run dev servers
pnpm dev

# Frontend: http://localhost:3000
# API: http://localhost:3001
```

### 8.2 Database Migrations (Local)

```bash
# In apps/api:
supabase db pull  # Pull latest schema from cloud
supabase db push  # Push local migrations to cloud
```

### 8.3 Testing

```bash
# Unit tests
pnpm test

# E2E tests (Playwright)
pnpm test:e2e

# Type checking
pnpm type-check
```

---

## Phase 9: Monitoring & Maintenance

### 9.1 Vercel Monitoring

- Vercel Dashboard → Analytics
- Monitor Core Web Vitals, errors, deployment history
- Set up error alerts via integration (Slack, email)

### 9.2 Supabase Monitoring

- Supabase Dashboard → Database → Logs
- Monitor query performance, failed connections
- Setup metric alerts for high query latency

### 9.3 Payment Reconciliation

```bash
# Weekly: Verify Xendit webhook receipts
curl https://api.mitra-infrastruktur.id/api/invoices/reconciliation?month=2026-05

# Log received payments vs. database
# Flag any discrepancies for manual review
```

---

## Checklist: Pre-Launch

- [ ] GitHub repo created & configured
- [ ] Vercel projects created (staging + production)
- [ ] Supabase project created & DB migrated
- [ ] Xendit account setup & webhooks configured
- [ ] Environment variables configured on Vercel
- [ ] GitHub Actions CI/CD passing
- [ ] Smart Router component implemented & tested
- [ ] API endpoints implemented for Projects domain
- [ ] Payment integration tested with Xendit test mode
- [ ] BAST template generation working
- [ ] Email notifications configured (SendGrid/Mailgun)
- [ ] Custom domain SSL certificate verified
- [ ] Security audit completed (RLS, API auth)
- [ ] Monitoring & logging configured
- [ ] Documentation reviewed & updated
- [ ] Internal team trained on platform

---

## Common Commands Reference

```bash
# Development
pnpm dev                  # Start all dev servers
pnpm build                # Build for production
pnpm lint                 # Run linter
pnpm type-check          # Check TypeScript errors

# Supabase
supabase start            # Start local Supabase
supabase db push          # Push migrations to cloud
supabase db pull          # Pull latest schema
supabase functions deploy # Deploy edge functions

# Deployment
vercel                    # Deploy to Vercel
git push origin main      # Trigger production deploy (auto)
git push origin develop   # Trigger staging deploy (auto)

# Database
psql -U postgres -h ...   # Connect to Supabase DB
\dt                       # List tables
\q                        # Exit psql
```

---

**Last Updated:** May 17, 2026  
**Status:** Ready for Implementation
