# Mitra Infrastruktur & Pertumbuhan Digital

**Platform Documentation & Infrastructure Repository**

Status: `In Development` | Last Updated: May 2026

---

## 📋 Project Overview

Ekosistem infrastruktur hibrida yang menggabungkan:
- **Enterprise & Brand Growth** (B2B high-ticket services)
- **Research & Academic Support** (B2C volume-driven services)

Platform ini dirancang sebagai **single point of contact** untuk transformasi entitas bisnis/riset menjadi mesin pendapatan terukur.

---

## 🗂️ Repository Structure

```
mitra-infrastruktur/
├── README.md                          # Hub dokumentasi (file ini)
│
├── docs/
│   ├── ARCHITECTURE.md               # C4 model & system design
│   ├── API_SPECIFICATION.md          # OpenAPI/Swagger spec (full)
│   ├── DATABASE_SCHEMA.md            # DDL, ERD, RLS policies
│   │
│   └── legal/
│       ├── MASTER_BRIEF.md           # Qualification checklist
│       ├── SCOPE_OF_WORK.md          # SoW template & generator
│       ├── CONTRACT_TEMPLATES.md     # IP, Retainer, Kemitraan
│       └── BAST_TEMPLATE.md          # Berita Acara Serah Terima
│
├── apps/
│   ├── frontend/                      # Next.js app
│   │   ├── components/
│   │   │   ├── SmartRouter/
│   │   │   ├── DirectoryGrid/
│   │   │   ├── RSSAggregator/
│   │   │   └── ...
│   │   ├── pages/
│   │   ├── lib/
│   │   └── styles/
│   │
│   └── api/                           # Supabase Edge Functions / Node.js backend
│       ├── functions/
│       │   ├── rss-aggregator/
│       │   ├── payment-webhook/
│       │   ├── project-intake/
│       │   └── ...
│       ├── migrations/                # Supabase DDL
│       └── schemas/                   # TypeScript types
│
├── config/
│   ├── .env.example                  # Environment variables
│   ├── supabase.json                 # Supabase project config
│   ├── github-actions.yml            # CI/CD pipeline
│   └── xendit-config.ts              # Payment integration
│
├── templates/
│   ├── brief-master.json             # Master Brief JSON schema
│   ├── sow-generator.json            # SoW dynamic template
│   ├── contract-kemitraan.docx       # Kontrak template
│   └── bast-signoff.docx             # BAST template
│
└── scripts/
    ├── setup.sh                       # Initial setup
    ├── deploy.sh                      # Deployment scripts
    └── seed-data.sql                  # Sample data for development

```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Git + GitHub CLI
- Supabase account (free tier supported)
- Xendit API key (payment)

### Initial Setup

```bash
# 1. Clone repository
git clone https://github.com/devapenseo/mitra-infrastruktur.git
cd mitra-infrastruktur

# 2. Install dependencies
npm install

# 3. Setup environment
cp config/.env.example .env.local
# Edit .env.local dengan credentials Anda

# 4. Initialize Supabase
supabase init
supabase db push

# 5. Run development server
npm run dev
```

Server akan berjalan di `http://localhost:3000`

---

## 📚 Documentation Guide

### **For Product/Strategy Folks**
1. Mulai dari `docs/ARCHITECTURE.md` → understand system design
2. Baca `docs/legal/MASTER_BRIEF.md` → project intake process
3. Review `docs/legal/SCOPE_OF_WORK.md` → deliverables & timelines

### **For Engineers/Developers**
1. `docs/API_SPECIFICATION.md` → full endpoint reference
2. `docs/DATABASE_SCHEMA.md` → data model & migrations
3. `apps/frontend/` → React/Next.js component structure
4. `apps/api/` → serverless functions & integrations

### **For Legal/Operations**
1. `docs/legal/CONTRACT_TEMPLATES.md` → all agreement templates
2. `templates/` → editable Word/JSON templates for projects
3. `docs/legal/BAST_TEMPLATE.md` → project signoff & reconciliation

---

## 🔧 Core Systems

### **1. Smart Router (Customer Segmentation)**
- Interactive quiz that routes users to Enterprise or Academic track
- Location: `apps/frontend/components/SmartRouter`
- Logic: Rules-based routing stored in Supabase

### **2. Credibility Engines**
- **Tech Directory:** Grid of tools with affiliate links + sponsorship slots
- **News Aggregator:** Auto-pulls RSS feeds, filters by relevance
- **Prestige Directory:** Portfolio showcase with vector ratings

### **3. Project Management**
- **Master Brief:** Client qualification & requirement gathering
- **SoW Generator:** Auto-generates scope with line items & pricing
- **BAST System:** QA checklist → fund release trigger

### **4. Payment Integration**
- **Xendit:** Invoice creation, payment tracking, webhook reconciliation
- **Stripe:** (Optional) For international clients
- Recurring revenue billing for Retainer agreements

---

## 📊 Key Metrics & Monitoring

Track these across both segments:
- **B2B:** ACV, sales cycle length, churn, NRR
- **B2C:** CAC, LTV, conversion rate, repeat purchase rate
- **Platform:** API uptime, invoice reconciliation accuracy, project completion rate

---

## 🔐 Security & Compliance

- [ ] Row-level security (RLS) on Supabase tables
- [ ] API key rotation (Xendit, Groq)
- [ ] Contract encryption at rest
- [ ] GDPR/IDPR compliance checklist
- [ ] Audit logging for financial transactions

See `docs/SECURITY.md` (to be created).

---

## 🤝 Contributing & Development

### **Using AI Coder (Google Antigravity)**
This repository is designed to be **AI-Coder-native**:
- All code is modular and self-documenting
- Comments follow JSDoc/Markdown conventions
- API specs are machine-parseable (OpenAPI)
- Database migrations are version-controlled

**Workflow:**
1. Pick a task from `docs/API_SPECIFICATION.md` or component in `apps/frontend`
2. Paste the relevant spec into AI Coder
3. AI Coder reads this repo structure, generates code
4. Code is committed to feature branch
5. Run `npm run lint && npm run test` before PR

### **Branch Strategy**
```
main (production)
├── develop (staging)
└── feature/[name] (feature branches)
```

---

## 🔗 Integration Points

### **External APIs**
- **Supabase:** Database, Auth, Realtime
- **Xendit:** Invoicing, payment processing, reconciliation
- **Groq/Gemini:** RSS aggregation, content filtering, NLP
- **GitHub:** Source control, Actions (CI/CD)

### **Webhooks**
- `POST /api/webhooks/xendit` — Payment status updates
- `POST /api/webhooks/rss-sync` — Scheduled feed refresh

---

## 📝 Documentation Maintenance

All docs are written in **Markdown + HTML** for GitHub rendering.
- Update docs when features change
- Use branch protection to require doc reviews
- Link to relevant docs in PR descriptions

---

## 🎯 Roadmap

### **Phase 1 (Now):** Foundation
- ✅ Repository scaffold & docs
- ✅ Database schema & migrations
- ✅ Authentication (Supabase)
- API skeleton (CRUD endpoints)

### **Phase 2:** Core Features
- Smart Router component
- Directory listing system
- RSS aggregator service
- Xendit payment integration

### **Phase 3:** Operations
- Master Brief intake system
- SoW generator
- Contract management
- BAST signoff workflow

### **Phase 4:** Scale
- Retainer billing automation
- Analytics dashboard
- Affiliate sponsorship tracking
- Compliance audit logging

---

## 📞 Support & Questions

- **Technical issues:** Create GitHub Issue with `[bug]` label
- **Feature requests:** Use `[feature]` label
- **Documentation gaps:** PR with markdown updates

---

## 📄 License

Internal proprietary. All rights reserved © 2026.

---

**Last Reviewed:** May 17, 2026  
**Maintainer:** Devapenseo  
**Status:** Ready for AI Coder Integration
