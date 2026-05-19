# Dashboard Architecture & UI/UX Specification

**Admin Panel + User Portal + Analytics** | Version 1.0 | May 2026

---

## Overview

Platform memerlukan **3 dashboard tier** dengan berbagai komponen interaktif:

1. **Admin Dashboard** — Internal team control center
2. **User Dashboard** — Client project management portal
3. **Analytics Dashboard** — Real-time metrics + reporting

Semua built dengan **modern, familiar UI** — tidak berlebihan, accessible, fast.

---

## 1. ADMIN DASHBOARD (Internal Team)

### 1.1 Core Features

#### Sidebar Navigation
```
├── Dashboard (overview)
├── Projects
│   ├── Active Projects
│   ├── Completed Projects
│   ├── Project Intake (Master Brief)
│   └── SoW Generator
├── Financial
│   ├── Invoices
│   ├── Payments
│   ├── Reconciliation
│   └── Revenue Tracking
├── Legal & Contracts
│   ├── Contract Templates
│   ├── Active Contracts
│   ├── Signed Contracts (archive)
│   └── BAST Signoff
├── Content Management
│   ├── RSS Feeds Config
│   ├── Tools Directory
│   ├── Portfolio Cases
│   └── Manual Posts
├── Team & Roles
│   ├── Staff Members
│   ├── Permissions
│   ├── Availability/Allocation
│   └── Workload
├── Settings
│   ├── Company Info
│   ├── API Keys
│   ├── Webhooks
│   ├── Email Templates
│   └── System Config
└── Support & Logs
    ├── Audit Trail
    ├── Error Logs
    ├── API Monitoring
    └── Support Tickets
```

### 1.2 Dashboard Home (Overview)

**Key Metrics (Real-time cards):**

```
┌─────────────────────────────────────────────┐
│  Total Revenue (This Month)                 │
│  IDR 45,000,000  ↑ 12% from last month      │
├─────────────────────────────────────────────┤
│  Active Projects        5                   │
│  Pending Invoices       3 (IDR 7.5M)        │
│  Team Allocation        78%                 │
│  Payment Success Rate   94%                 │
└─────────────────────────────────────────────┘
```

**Widgets:**

1. **Project Pipeline (Kanban)** — Status overview
   - Brief Pending (2)
   - SoW Approved (1)
   - Contract Signed (2)
   - Active/Execution (5)
   - Completed (12)
   - Button to move/update status

2. **Revenue Chart** — Last 12 months
   - Stacked bar: Enterprise vs Academic segment
   - Deposit vs Final payment split
   - Monthly trend + growth rate

3. **Upcoming Milestones** — Next 14 days
   - Contract signings pending
   - Invoice due dates
   - Project deadlines
   - Retainer renewals

4. **Team Workload Matrix** — Current allocation
   - Staff member cards showing:
     - Current projects assigned
     - Available hours/capacity
     - Overallocated warning (if >100%)
     - Skill tags

5. **Payment Status** — Reconciliation
   - Paid invoices (✓)
   - Pending payments (⏳)
   - Overdue invoices (⚠️)
   - Failed/disputed (❌)

6. **Activity Feed** — Last 24 hours
   - Project status changes
   - Contract signings
   - Payments received
   - New project inquiries
   - Team actions (with timestamps + user)

### 1.3 Projects Management Panel

**List View (Filterable table):**

```
Columns:
- Project ID / Name
- Client Company
- Status (badge color-coded)
- Project Type (icon)
- Segment (Enterprise/Academic)
- Assigned To (staff member avatar + name)
- Total Value (IDR)
- Start Date
- End Date
- Progress % (visual progress bar)
- Actions (Edit, View, Archive)

Filters:
- Status dropdown
- Segment toggle
- Date range picker
- Assigned staff member
- Budget range slider
- Search by client name/project name

Sorting:
- By date, budget, status, progress
- Ascending/descending

Bulk Actions:
- Archive selected
- Assign to staff member
- Export to CSV
```

**Project Detail View (Modal/Page):**

```
Tab 1: Overview
- Project title, description
- Client info + contact (click to email)
- Segment, type, budget
- Timeline (Gantt preview)
- Current status + last update timestamp
- Assigned team members

Tab 2: Master Brief
- Brief content (read-only, with edit button)
- Approval status + date
- Decision maker info
- Business context
- Key objectives

Tab 3: Scope of Work
- Line items table (deliverable, qty, price, notes)
- Subtotal, discount, net total
- Revision policy display
- Download SoW as DOCX
- Client approval status

Tab 4: Contract
- Contract type (Kemitraan/Service/Retainer)
- Document preview
- Signature status (Client: ✓/⏳, Company: ✓/⏳)
- Download contract
- Manage signoff links

Tab 5: Financial
- Invoice list (table with status badges)
- Payment schedule timeline
- Paid/pending/overdue amounts
- Reconciliation history
- Action: Create new invoice

Tab 6: Execution & BAST
- Timeline milestones
- Team assignments + hours logged
- QA checklist
- BAST document (if available)
- Handover checklist
- Action: Generate BAST, Sign BAST

Tab 7: Communications
- Project notes (timestamped)
- Email log (client emails sent/received)
- Meetings scheduled
- Documents shared
- Add note button
```

### 1.4 Financial Panel

**Invoices List:**

```
Columns:
- Invoice Number (INV-2026-001-DP format)
- Project / Client
- Amount (IDR)
- Status (Paid/Pending/Overdue/Failed)
- Invoice Date
- Due Date
- Payment Date (if paid)
- Paid Amount vs. Invoiced
- Actions

Filters:
- Status (paid, pending, overdue, all)
- Date range
- Payment method
- Client segment

Bulk Actions:
- Resend invoice (email)
- Mark as paid
- Export

Detail View:
- Full invoice preview (DOCX/PDF)
- QR code (if exists)
- Payment link (copy to clipboard)
- Xendit transaction details
- Webhook receipt history
- Refund option (if applicable)
```

**Reconciliation Report:**

```
Period selector: Month / Quarter / Year

Summary:
- Total invoiced
- Total paid
- Outstanding amount
- Payment rate %
- Average days to payment

Breakdown:
- By segment (Enterprise vs Academic)
- By payment method (Bank transfer, Card, E-wallet)
- By project status
- Aged receivables (current, 30 days, 60+ days)

Charts:
- Revenue trend (line chart)
- Payment status pie chart
- Segment comparison (bar)
- Cash flow forecast (next 3 months)

Export:
- PDF report
- Excel reconciliation template
- Accounting journal entries (CSV for accounting software)
```

### 1.5 Contract & BAST Management

**Contract Templates Editor:**

```
UI:
- Template selector (Kemitraan / Service / Retainer)
- Rich text editor for contract body
- Variable insertion ({{client_name}}, {{total_amount}}, etc.)
- Preview panel (rendered DOCX)
- Version history (git-like commits)
- Save, Publish, Archive buttons

Variables Available:
- Client data (name, address, signatory)
- Project data (title, type, timeline)
- Financial (total, payment terms, revisions)
- Company data (address, signatory, bank details)
```

**BAST Signing & Approval:**

```
BAST Status Page (table):
- BAST ID
- Project
- Client
- QA Pass Rate %
- Status (Draft/Pending/Signed/Complete)
- Actions (Edit, Preview, Request signature)

BAST Detail:
- QA checklist (editable if draft)
- Deliverables list
- Client signature link (share/copy)
- Signature status (pending/received)
- Signed date/time
- Post-signature actions (unlock payment, archive)
```

### 1.6 Content Management Panel

**RSS Feeds Configuration:**

```
Feeds List:
- Feed name
- Feed URL
- Category (technology, marketing, etc.)
- Active status (toggle)
- Last synced time
- Next sync time
- Error count + message
- Actions (Edit, Resync, Delete)

Feed Detail:
- Feed URL (editable)
- Category (dropdown)
- Auto-sync enabled (toggle)
- Sync interval (hours)
- Keyword filters (add/remove)
- Active status
- Test sync button
- Sync history log
```

**Tools Directory Editor:**

```
Tools List (table):
- Tool name
- Category
- Logo (image preview)
- Website link
- Affiliate link
- Sponsor status (Featured/Standard/None)
- Ratings (performance, ease, docs, community)
- Actions (Edit, Delete)

Tool Detail:
- Name, category, description
- Logo upload
- Website URL
- Affiliate link + commission %
- Sponsor status + end date
- Ratings sliders (0-100 each)
- Internal notes
- Save / Delete buttons
```

**Portfolio Cases (BAST-verified):**

```
Cases List:
- Case title
- Client company name
- Segment
- Metrics (timeline accuracy, satisfaction, etc.)
- Published status
- Actions (Edit, Publish, Unpublish)

Case Detail:
- Project title, client name
- Description (rich text)
- Image gallery upload
- Metrics (5 sliders: 0-100)
- Deliverables list
- Tech stack tags
- Publish toggle
```

### 1.7 Team & Permissions

**Staff Directory:**

```
List:
- Name, email
- Role (admin, manager, developer, designer, analyst)
- Department
- Skills (tags)
- Availability % (0-100)
- Hourly rate (for costing)
- Active status
- Actions (Edit, Archive)

Detail:
- Name, email, phone
- Role dropdown
- Department
- Skills (multi-select)
- Availability % slider
- Hourly rate (currency)
- Active status toggle
- Authentication status (linked to Supabase auth)
- Last login date
- Assigned projects (read-only list)
```

**Permissions Matrix:**

```
Role-based Access Control (table):
- Role name (rows)
- Permissions (columns): 
  - View projects
  - Create projects
  - Manage contracts
  - Approve payments
  - View financials
  - Edit settings
  - Manage staff
  - Access logs

Cell: Dropdown (None / Read / Write / Admin)
```

### 1.8 System Settings

**Company Settings:**

```
- Company name
- Logo upload
- Address
- Phone, email
- Bank details (for payments)
- Logo, header colors
- Default timezone
```

**API Keys Management:**

```
Table:
- Key name
- Last used (date/time)
- Permissions (scope)
- Last rotated
- Status (active/revoked)
- Actions (Copy, Regenerate, Revoke, Delete)

Generate New:
- Key name input
- Permissions checkboxes
- Generate button
- Display secret once (copy warning)
```

**Webhook Configuration:**

```
Webhook URLs:
- POST /api/webhooks/xendit
- POST /api/webhooks/contracts
- POST /api/webhooks/projects

For each:
- URL editable
- Active toggle
- Events subscribed (checkboxes)
- Secret key (copy/regenerate)
- Recent deliveries log (last 100)
  - Timestamp, status, response time, payload
```

**Email Templates:**

```
Template list:
- Invoice notification
- Contract signing reminder
- Payment confirmation
- BAST request
- Project completion

For each:
- Subject line (editable)
- Body (rich text editor)
- Variable insertion ({{client_name}}, {{amount}}, etc.)
- Preview
- Test send (to team email)
```

### 1.9 Audit & Monitoring

**Audit Log:**

```
Columns:
- Timestamp
- User (staff member)
- Entity type (project, invoice, contract)
- Entity ID / Name
- Action (created, updated, deleted, signed)
- Changes (before/after values, if applicable)
- IP address
- Status (success, failed)

Filters:
- Date range
- User
- Entity type
- Action type
- Status

Sorting:
- Most recent first
```

**API Monitoring:**

```
Real-time metrics:
- Total requests (today)
- Success rate %
- Average response time (ms)
- Error rate %

Charts:
- Requests per hour (line)
- Response time trend (area)
- Error rate by endpoint (bar)
- Status codes breakdown (pie)

Error log:
- Timestamp
- Endpoint
- Status code
- Error message
- User (if authenticated)
```

---

## 2. USER DASHBOARD (Client Portal)

### 2.1 Project Status Portal

**My Projects (List):**

```
Cards or Table:
- Project name + ID
- Current status (badge: Brief Pending, SoW Review, Contract Signing, Active, Completed)
- Progress % (visual bar)
- Team members assigned
- Start date, target end date
- Timeline countdown (or "Completed on date")
- Button: View Details

For Academic segment:
- Quick links: View Data, Check Layout, Download Files
```

**Project Detail (User View):**

```
Tab 1: Overview
- Project description (read-only)
- Current status + timeline
- Assigned team members (names, avatars, contact)
- Key deliverables checklist

Tab 2: Scope & Timeline
- SoW summary (what's being delivered)
- Deliverables list with dates
- Download SoW as PDF

Tab 3: Contract & Payments
- Contract status (Pending/Signed)
- Payment schedule (milestones)
  - DP amount, due date, status
  - Final amount, due date, status
- Invoice links (download/pay)
- Payment link (if applicable)

Tab 4: Deliverables & Handover
- Deliverables checklist (with dates)
- File downloads (if available)
- Server credentials (if applicable)
- BAST document (if project complete)

Tab 5: Messages
- Communication thread with team
- Message history
- Send message box (email-like)
- Shared files
```

### 2.2 Financial Portal

**Invoices:**

```
List:
- Invoice number
- Amount
- Due date
- Status (Paid/Pending/Overdue)
- Actions: Download PDF, Pay Now, View Details

Payment Link:
- QR code (scan to pay)
- Payment options (Bank transfer, Card, E-wallet)
- Amount, due date
- Status updates (real-time)
```

**Payment History:**

```
- Invoice date
- Amount invoiced
- Amount paid
- Payment date
- Payment method
- Receipt (if available)
```

### 2.3 Profile & Settings

**Client Profile:**

```
- Contact name, email, phone
- Company name (read-only)
- Notification preferences:
  - Email when invoice ready
  - Email when payment received
  - Email when project updated
  - Slack/Teams notification (if integrated)
```

---

## 3. ANALYTICS DASHBOARD (Executive/Manager View)

### 3.1 KPI Cards (Overview)

```
Month-to-Date:
- Total Revenue (with % change)
- Projects Completed
- Payment Success Rate %
- Team Utilization %
- Average Project Duration
```

### 3.2 Charts & Reports

**Revenue Trends:**
- Line chart: Last 12 months
- Breakdown: Enterprise vs Academic segment
- Breakdown: Deposit vs Final payment

**Project Health:**
- On-time completion rate %
- Average project duration (days)
- Projects by status (pie)
- Projects by segment (bar)

**Team Productivity:**
- Hours logged vs. estimated
- Utilization by staff member
- Skills breakdown (who does what)

**Financial Health:**
- Cash flow forecast (next 90 days)
- Receivables aging
- Payment health (success rate, days to payment)
- Margin analysis

**Customer Satisfaction:**
- NPS trend (if you collect it)
- Repeat customer rate
- Average project value trend

---

## 4. FORM BUILDER & CONFIGURATION

### 4.1 Dynamic Form System

**Goal:** Master Brief, SoW, intake forms, feedback forms **tidak hardcoded** — editable via UI.

### 4.2 Form Builder Interface

**Forms List:**

```
- Master Brief Intake Form
- Project Feedback Form
- Post-Launch Survey
- Support Ticket Form
- Feature Request Form

For each:
- Form name, description
- Active status (toggle)
- Fields count
- Last modified date/by
- Actions: Edit, Preview, Duplicate, View Responses
```

**Form Editor (Drag-and-Drop):**

```
Layout:
- Left panel: Field types (Text, Email, Textarea, Select, Checkbox, Date, Number, File, Rating, etc.)
- Center: Canvas (drag fields, reorder)
- Right panel: Field settings (label, placeholder, required, validation rules)

Field Settings:
- Label
- Placeholder text
- Help text
- Field type
- Required toggle
- Validation (regex, min/max length, email format, etc.)
- Options (for select/radio/checkbox)
- Default value

Form Settings:
- Form title, description
- Success message (after submission)
- Redirect URL (after submission)
- Send email notification on submit
- SPAM protection (reCAPTCHA)
- Style/theme (light/dark)

Actions:
- Save form
- Publish (make live)
- Duplicate
- Delete
- Preview button (show form as user sees it)
```

### 4.3 Form Responses

**Submissions List:**

```
Table:
- Submission timestamp
- Submitter name (if captured in form)
- Status (new, reviewed, archived)
- Actions (View, Export, Delete)

Detail View:
- All responses in readable format
- Timestamp
- IP address
- Device (desktop/mobile)
- Referrer (which page)
- Action: Mark as reviewed, Email to team, Export as PDF
```

**Export & Analytics:**

```
- Export submissions (CSV, JSON, PDF)
- Submission rate over time (chart)
- Field-by-field response analysis
- Time to complete (average)
- Completion rate %
```

---

## 5. UI/UX DESIGN SYSTEM

### 5.1 Design Tokens (Tailwind Config)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      primary: '#185FA5',      // Brand blue
      secondary: '#0F6E56',    // Teal accent
      success: '#639922',      // Green
      warning: '#BA7517',      // Amber
      danger: '#A32D2D',       // Red
      neutral: '#5F5E5A',      // Gray
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      '2xl': '48px',
    },
    typography: {
      heading1: '32px',
      heading2: '24px',
      heading3: '18px',
      body: '16px',
      caption: '12px',
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      full: '999px',
    },
  },
};
```

### 5.2 Component Library (shadcn/ui)

**Use pre-built components:**
- Button
- Card
- Table
- Modal/Dialog
- Dropdown
- Tabs
- Sidebar
- Form controls (Input, Select, Checkbox, Radio, Textarea)
- Toast notifications
- Skeleton loaders

**Custom additions:**
- Status badge (project status color-coded)
- Progress bar (project progress)
- Timeline (project/payment timeline)
- Kanban column (project status pipeline)
- Metric card (KPI display)

### 5.3 Familiar, Modern Aesthetic

**Principles:**
- ✅ Clean, uncluttered layouts (whitespace is your friend)
- ✅ Consistent typography (2 weights: regular 400, semi-bold 500)
- ✅ Color-coded status (green = success, red = error, blue = info)
- ✅ Micro-interactions (hover states, loading spinners, transitions)
- ✅ Mobile-first responsive design
- ✅ Dark mode support (system preference)
- ✅ Keyboard navigation (tab, enter, escape)
- ✅ Accessible (ARIA labels, color contrast WCAG AA)

**Avoid:**
- ❌ Busy gradients, shadows, blur effects
- ❌ Jarring animations (stick to 200-300ms transitions)
- ❌ Too many colors (stick to 3-4 primary + semantic colors)
- ❌ Tiny text (minimum 16px on mobile)
- ❌ Poor contrast (check WCAG AA/AAA)

---

## 6. PERFORMANCE & SEO OPTIMIZATION

### 6.1 Core Web Vitals Targets

```
LCP (Largest Contentful Paint):    < 2.5s
FID (First Input Delay):           < 100ms
CLS (Cumulative Layout Shift):     < 0.1
TTFB (Time to First Byte):         < 600ms
```

### 6.2 Optimization Strategies

**Frontend:**
- ✅ Code splitting (lazy load dashboard components)
- ✅ Image optimization (next/image component)
- ✅ CSS minification (Tailwind purging)
- ✅ JS minification + tree-shaking
- ✅ Font optimization (subset, preload)
- ✅ Lighthouse score > 90 on all pages

**Database:**
- ✅ Query optimization (indexed fields)
- ✅ Pagination (don't load all rows at once)
- ✅ Caching (Redis for frequently accessed data)
- ✅ Connection pooling

**CDN & Delivery:**
- ✅ Vercel edge network (auto)
- ✅ Image CDN (next/image + Vercel)
- ✅ Static asset caching (1 year for versioned assets)
- ✅ Gzip compression

### 6.3 SEO for Marketing Site (Landing Page)

**Technical SEO:**
- ✅ Meta tags (title, description, robots)
- ✅ Open Graph (social sharing)
- ✅ Structured data (Schema.org, JSON-LD)
- ✅ XML sitemap
- ✅ robots.txt
- ✅ Canonical URLs

**Content SEO:**
- ✅ Keyword research (target "dokumentasi jasa", "SoW generator", etc.)
- ✅ H1-H6 hierarchy
- ✅ Internal linking (breadcrumbs, related links)
- ✅ Alt text on images
- ✅ Long-form content (blog posts, guides)

**Analytics:**
- ✅ Google Analytics 4
- ✅ Search Console integration
- ✅ Hotjar/LogRocket for session replay
- ✅ Conversion tracking (form submissions, CTA clicks)

### 6.4 Growth Hacking Tactics

**For Enterprise Segment:**
- Lead magnet: Free SoW template (PDF download, requires email)
- Case study popups (exit intent)
- Retargeting ads (Google, LinkedIn)
- Sales call CTA (Calendly embed)

**For Academic Segment:**
- Free data visualization sample (showcase capability)
- Academic pricing (discounted for students/researchers)
- Bulk discounts (departmental plans)
- Referral program (students refer friends = discount)

**General:**
- Email capture (newsletter)
- Slack community (for feedback, feature requests)
- Product Hunt launch (when ready)
- Twitter/LinkedIn thought leadership

---

## 7. GITHUB REPOSITORIES NEEDED

### 7.1 Main Application Repo
```
mitra-infrastruktur/
├── apps/
│   ├── frontend/              (Next.js + admin + user dashboards)
│   ├── api/                   (Supabase Edge Functions)
│   └── docs/                  (Docusaurus site)
├── packages/
│   ├── ui/                    (shadcn/ui component library)
│   ├── forms/                 (Form builder + validation schemas)
│   ├── database/              (Supabase client + types)
│   └── utils/                 (Shared utilities)
├── scripts/                   (Deployment, migration)
└── .github/workflows/         (CI/CD)
```

### 7.2 Satellite Repos (Recommended)

```
1. form-builder
   Purpose: Standalone form builder component (reusable)
   Stack: React + Tailwind + Zustand
   API: Export/import form JSON, handle submissions

2. dashboard-templates
   Purpose: Pre-built dashboard templates (reusable)
   Stack: Next.js + shadcn/ui + TanStack Query
   Exports: Admin, user, analytics layouts

3. rss-aggregator-service
   Purpose: Standalone RSS fetching + filtering service
   Stack: Node.js + Bull queues + Groq API
   API: REST endpoint + webhooks

4. cms-headless
   Purpose: Simple content management (blog, docs, FAQs)
   Stack: Next.js + Markdown + Supabase
   API: GraphQL or REST for content

5. design-system
   Purpose: Shared design tokens + component stubs
   Stack: TypeScript + Tailwind config
   Exports: Color tokens, typography, spacing
```

### 7.3 Integration Repos (Reference)

```
- stripe-integration (example payment provider)
- google-analytics-setup (tracking implementation)
- slack-webhook-handler (notifications)
- sendgrid-email-templates (transactional emails)
```

---

## 8. INTEGRATION CHECKLIST

### Required Integrations

- [ ] **Supabase** — Database, Auth, Real-time
- [ ] **Xendit** — Payment gateway (webhooks tested)
- [ ] **Groq / Gemini** — RSS aggregation + content filtering
- [ ] **Vercel** — Deployment + Edge Functions
- [ ] **GitHub** — Source control + CI/CD
- [ ] **Tailwind CSS** — Styling
- [ ] **shadcn/ui** — Component library
- [ ] **TanStack Query** — Server state management
- [ ] **Zustand** — Client state management
- [ ] **React Hook Form** — Form handling
- [ ] **Zod** — Validation
- [ ] **Sentry** — Error tracking
- [ ] **LogRocket** — Session replay
- [ ] **Google Analytics 4** — Analytics
- [ ] **SendGrid / Mailgun** — Email delivery

### Optional (Nice to Have)

- [ ] **Slack integration** — Notifications
- [ ] **Google Sheets integration** — Export data
- [ ] **Zapier** — Automation workflows
- [ ] **Figma** — Design collaboration
- [ ] **Linear** — Issue tracking
- [ ] **Calendly** — Meeting scheduling (for sales)
- [ ] **Stripe** — Alternative payment provider

---

## 9. DATA ACCESS & SECURITY

### 9.1 Row-Level Security (RLS) Policies

Already specified in DATABASE_SCHEMA.md, but key points:

```sql
-- Client can only see their own projects
CREATE POLICY client_see_own_projects ON projects
  FOR SELECT USING (client_id = auth.uid()::uuid);

-- Staff can see all projects (or only assigned, depending on role)
CREATE POLICY staff_see_all_projects ON projects
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM staff 
            WHERE auth_user_id = auth.uid() 
            AND role IN ('admin', 'manager'))
  );

-- Only admin can edit staff
CREATE POLICY admin_manage_staff ON staff
  FOR ALL USING (
    EXISTS (SELECT 1 FROM staff 
            WHERE auth_user_id = auth.uid() 
            AND role = 'admin')
  );
```

### 9.2 API Authentication

```typescript
// Middleware to protect routes
import { createClient } from '@supabase/supabase-js';

export async function requireAuth(req) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new Error('Unauthorized');
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error) throw new Error('Invalid token');
  
  return user;
}
```

### 9.3 Permission Model

```
Admin:
  - Full access to all features
  - Can manage staff, settings, integrations
  - Can view all projects + financials

Manager:
  - View + edit assigned projects
  - View financial reports
  - Manage team workload
  - Cannot change system settings

Developer/Designer/Analyst:
  - View assigned projects only
  - Update project status
  - Log hours
  - Cannot access financial data

Client (User Portal):
  - View own project
  - Download deliverables
  - View invoices + payment status
  - Cannot modify anything
```

---

## 10. MONITORING & OBSERVABILITY

### 10.1 Key Metrics to Track

```
Application Health:
- API response time (p50, p95, p99)
- Error rate by endpoint
- Database query performance
- Auth success rate

Business Metrics:
- Projects completed per month
- Revenue per segment
- Payment success rate
- Average invoice payment time
- Client churn rate

User Behavior:
- Active users (daily, monthly)
- Feature usage heatmap
- Page load time by section
- Form completion rate
- Bounce rate
```

### 10.2 Alert Thresholds

```
🔴 Critical:
  - API error rate > 5%
  - Database connection pool exhausted
  - Xendit payment failures > 10%
  - Unhandled exceptions > 100/hour

🟠 Warning:
  - API response time p95 > 500ms
  - Database queries > 2s
  - Invoice overdue > 30 days
  - Unused API keys still active
```

---

## File References

| File | Purpose |
|------|---------|
| `apps/frontend/components/Admin/*` | Admin dashboard components |
| `apps/frontend/components/User/*` | User portal components |
| `apps/frontend/components/Form/*` | Form builder |
| `packages/ui/` | Shared component library |
| `packages/forms/` | Form schemas + validation |
| `supabase/rls.sql` | Row-level security policies |

---

**Status:** Ready for implementation  
**Next:** Create detailed component specs per dashboard section  
**Timeline:** Dashboard components can be built in parallel with API (Weeks 3-4)

