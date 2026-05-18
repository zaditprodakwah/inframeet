# 🚀 INFRAMEET Platform Hub

**Fondasi Presisi. Pertumbuhan Pasti.**

INFRAMEET adalah platform kemitraan digital B2B dan asistensi riset akademik yang beroperasi dengan model modular transparan. Kami membantu korporasi enterprise memigrasi sistem server konvensional ke arsitektur serverless cloud beban nol bulanan, serta memberikan asistensi riset ilmiah berkualitas dengan komitmen penuh menjunjung integritas akademik.

---

## 📝 Deskripsi Platform

### Esensi Platform: Dua Pilar Bisnis

INFRAMEET menjalankan dual-silo architecture yang memisahkan layanan berdasarkan segmentasi klien:

#### **Pilar 1: Enterprise B2B Growth** 🏢
- **Target:** Tech companies, startups, digital agencies
- **Budget:** IDR 5M - 500M+ per project
- **Core Value:** Transformasi infrastruktur dari server tradisional ke **Vercel Edge + Supabase serverless** (zero monthly bills)
- **Key Services:**
  - Landing page high-performance (Lighthouse >90)
  - Custom SaaS & headless CMS integration (Sanity/PayloadCMS)
  - Multi-role authentication system (Auth.js + RLS)
  - Payment gateway integration (Xendit)
  - Pitch deck designer & investor materials
  - Legal documentation (ToS, Privacy Policy, contracts)

#### **Pilar 2: Academic & Research Support** 🎓
- **Target:** Graduate students, researchers, academic institutions
- **Budget:** IDR 200K - 50M per service
- **Core Value:** **Anti-Joki Guarantee** - ZERO ghostwriting, ONLY technical assistance
- **Key Services:**
  - Document layouting (5K IDR per page)
  - Quantitative data analysis (SPSS, SEM analysis)
  - Plagiarism checking (Turnitin Premium)
  - Slide design untuk sidang (15K IDR per slide)
  - Citation management (Mendeley/Zotero sync)

### Core Value Proposition

| Feature | Benefit | Implementation |
|---------|---------|-----------------|
| **Modular Pricing** | Transparent cost structure, no hidden fees | Dynamic calculator via `services.json` |
| **Instant Quotation** | Within 5 minutes of quiz completion | Groq LLM scoring engine |
| **Serverless-First** | Zero monthly hosting costs, pay-per-use | Vercel hobby + Supabase free tier |
| **Escrow Protection** | Funds held until BAST acceptance | PostgreSQL escrow_ledger table |
| **Digital Contracts** | Legally binding signatures + timestamps | Docxtemplater DOCX generation |
| **Audit Trail** | Full compliance tracking (UU PDP, GDPR) | Immutable audit_log table |
| **AI-Powered Matching** | Smart project → staff allocation | Groq LLM integration |

---

## 🛠️ Tech Stack & Integrasi

### Frontend & UI Framework
- **Next.js** 16.2.6 (React 19.2.4) - App Router architecture
- **Tailwind CSS** 4 + PostCSS - Utility-first styling
- **Lucide React** - Icon library (60+ icons)
- **Framer Motion** 12.38.0 - Smooth animations
- **cmdk** 1.1.1 - Command palette (Cmd+K)
- **nuqs** 2.8.9 - URL state synchronization
- **Zustand** 5.0.13 - Lightweight state management

### Backend & Database
- **Supabase** (PostgreSQL)
  - Row-Level Security (RLS) for multi-tenant data isolation
  - Real-time subscriptions
  - Full-text search (FTS)
  - PostgreSQL extensions: pgvector, pg_trgm

### API Integrations & Services
- **Xendit** - Payment gateway (Virtual Account, E-Wallet, Credit Card)
- **SendGrid** + SMTP (emailforums.biz) - Transactional email
- **Groq SDK** 1.2.0 - LLM for lead scoring & AI insights
- **Docxtemplater** 3.68.7 + PizZip 3.2.0 - DOCX generation (SOW, contracts, BAST)
- **Turnitin** API - Plagiarism checking
- **UptimeRobot** - Keep-alive pings (free tier optimization)

### Validation & Schema
- **Zod** 4.4.3 - TypeScript-first schema validation
- **TypeScript** 5 - Type-safe development

### Configuration & Shared Packages
- **@inframeet/config** (workspace package)
  - `services.json` - Pricing catalog & service definitions
  - `quiz.json` - Lead qualification flow
  - `brand.json` - UI theme, colors, typography
  - `legal.json` - Terms, privacy policy, compliance clauses

### Package Manager & Monorepo
- **pnpm** 8+ - Fast, disk-efficient package manager
- **pnpm workspaces** - Monorepo structure

---

## 📂 Arsitektur Monorepo & Peta Folder

```
inframeet/
│
├── 📄 README.md                              # Dokumentasi utama (file ini)
├── 📄 llm.txt                                # Semantic map untuk LLM integration
├── 📄 .env.example                           # Template environment variables
├── 📄 .gitignore                             # Git ignore rules
├── 📄 package.json                           # Root workspace config (pnpm)
├── 📄 pnpm-workspace.yaml                    # Monorepo workspace definition
├── 📄 pnpm-lock.yaml                         # Dependency lock file (140+ KB)
│
├── 📁 apps/
│   └── frontend/                             # Next.js main application
│       ├── 📄 package.json                   # Frontend dependencies
│       ├── 📄 next.config.ts                 # Next.js build config
│       ├── 📄 tsconfig.json                  # TypeScript configuration
│       ├── 📄 eslint.config.mjs              # Linting rules
│       ├── 📄 postcss.config.mjs             # PostCSS (Tailwind)
│       ├── 📄 AGENTS.md                      # AI agent notes
│       ├── 📄 README.md                      # Frontend-specific docs
│       │
│       ├── 📁 public/                        # Static assets (favicon, fonts)
│       │
│       └── 📁 src/
│           ├── 📁 app/                       # Next.js App Router (file-based routing)
│           │   ├── 📄 layout.tsx             # Root layout + metadata
│           │   ├── 📄 page.tsx               # Homepage (hero, FAQ, mega menu)
│           │   ├── 📄 globals.css            # Global styles
│           │   ├── 📄 favicon.ico            # Brand favicon
│           │   │
│           │   ├── 📁 admin/                 # Dashboard (protected routes)
│           │   ├── 📁 api/                   # API endpoints (backend)
│           │   │   ├── invoices/create       # Create invoice (price validation)
│           │   │   ├── contracts/generate    # Generate DOCX contracts
│           │   │   ├── bast/accept           # BAST digital signing
│           │   │   ├── xendit/webhook        # Xendit payment webhook
│           │   │   └── leads/qualify         # Lead scoring via Groq
│           │   │
│           │   ├── 📁 calculator/            # Dynamic pricing configurator
│           │   ├── 📁 components/            # Shared React components
│           │   ├── 📁 contracts/             # Contract management pages
│           │   ├── 📁 insights/              # AI insights & RSS feeds
│           │   ├── 📁 layanan/               # Service pages
│           │   ├── 📁 search/                # Search & discovery
│           │   ├── 📁 tools/                 # Tools directory & reviews
│           │   └── 📁 [dynamic-routes]/      # Catch-all routes
│           │
│           └── 📁 lib/                       # Utility functions & hooks
│               ├── 📄 supabase.ts            # Supabase client (RLS + admin)
│               ├── 📄 pricingMath.ts         # Pricing calculation engine
│               ├── 📄 docxHelper.ts          # DOCX document generation
│               ├── 📄 mail.ts                # Email integration
│               └── 📄 useConfigurator.ts     # React state hook
│
├── 📁 packages/
│   └── config/                               # Shared configuration package
│       ├── 📄 package.json                   # Package metadata
│       ├── 📄 index.js                       # Main exports
│       ├── 📄 brand.json                     # UI theme (colors, fonts, contact)
│       ├── 📄 services.json                  # Pricing catalog (CRITICAL)
│       ├── 📄 quiz.json                      # Lead qualification flow (CRITICAL)
│       ├── 📄 legal.json                     # Terms, privacy, compliance
│       └── DOCS-1, DOCS-2, DOCS-3/           # Documentation placeholders
│
├── 📁 supabase/                              # Database schema & migrations
│   ├── 📄 config.toml                        # Supabase project settings
│   ├── 📄 .gitignore                         # Ignore local state files
│   │
│   └── 📁 migrations/                        # PostgreSQL DDL (version-controlled)
│       ├── 📄 20260518000000_inframeet_schema.sql
│       ├── 📄 20260518000001_portal_enhancements.sql
│       ├── 📄 20260518000002_crm_escrow_schema.sql
│       ├── 📄 20260518000003_crm_escrow_optimizations.sql
│       ├── 📄 20260518000004_fts_affiliate_masking.sql
│       └── 📄 20260518000005_rls_crm_escrow.sql
│
└── 📁 DOCS-1, DOCS-2, DOCS-3/                # Future documentation modules
```

---

## 🎛️ Fitur Utama Ekosistem

### 1. Dynamic Pricing Configurator
- Budget slider (reverse-engineer features from budget)
- Features matrix (toggle components)
- Real-time price recalculation
- Auto-generated SOW documents

### 2. Unified CMS & RSS Aggregator
- Headless CMS integration (Sanity/PayloadCMS)
- RSS feed aggregation (tech, AI, business news)
- Tools directory (500+ software tools)
- AI insights via Groq

### 3. Escrow & Revenue Sharing
- Atomic escrow ledger (HELD → RELEASED workflow)
- Configurable profit splitting (50:50 default)
- Digital BAST signatures
- Automated wallet payouts

### 4. Advanced UI/UX
- Sticky mega menu
- Command palette (Cmd+K)
- AI SERP page
- Soft dark mode

---

## ⚙️ Panduan Setup & Instalasi Lokal

### Prerequisites

```bash
node --version        # >=18.0.0
pnpm --version        # >=8.0.0
```

### Installation Steps

```bash
# 1. Clone
git clone https://github.com/zaditprodakwah/inframeet.git
cd inframeet

# 2. Setup env
cp .env.example .env.local
# Edit .env.local with your secrets

# 3. Install deps
pnpm install

# 4. Database setup
pnpm supabase link --project-ref YOUR_REF
pnpm supabase db push

# 5. Development
pnpm dev

# 6. Open browser
# http://localhost:3000
```

### Required Environment Variables

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
XENDIT_SECRET_KEY=
XENDIT_PUBLIC_KEY=
SENDGRID_API_KEY=
GROQ_API_KEY=
NEXTAUTH_SECRET=
```

### Build & Deploy

```bash
# Production build
pnpm build

# Test production build locally
pnpm start

# Deploy to Vercel
vercel deploy
```

---

## 🚀 Quick Links

- 📖 **llm.txt** - AI semantic map (for Cursor, Windsurf, Claude)
- 🔒 **AUDIT_FINDINGS.md** - Security & performance audit
- 📋 **services.json** - Pricing catalog
- ⚖️ **legal.json** - Terms & privacy policy

---

## 📞 Support

- **Email:** inframeet@emailforums.biz
- **WhatsApp:** +62-823-1636-3177
- **GitHub Issues:** Report bugs

---

**Made with ❤️ by INFRAMEET Team**  
*Last Updated: May 18, 2026*
