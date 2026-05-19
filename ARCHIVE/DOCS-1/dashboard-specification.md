# Dashboard Specification: Admin & User Panels
**Mitra Infrastruktur & Pertumbuhan Digital**  
**Version 2.0 | May 17, 2026**

---

## Executive Overview

Dual-panel system dengan pembagian role:

- **Admin Dashboard** — Untuk internal team (staff, managers, admins)
- **Client Portal** — Untuk external clients (enterprise & academic segments)

Keduanya dibangun dengan:
- Next.js 14+ (App Router)
- TypeScript + shadcn/ui + Tailwind CSS
- Zustand + TanStack Query (React Query)
- Dynamic form generation (react-hook-form + Zod)
- Advanced data visualization (Recharts, D3)
- Real-time updates (Supabase Realtime)

---

## 1. ADMIN DASHBOARD

### 1.1 Overall Architecture

```
/apps/admin
├── layout.tsx              # Root layout + auth guard
├── pages/
│   ├── dashboard/          # Main KPI view
│   ├── projects/           # Project management
│   ├── clients/            # Client directory
│   ├── invoices/           # Payment tracking
│   ├── team/               # Staff management
│   ├── templates/          # Document templates
│   ├── reports/            # Analytics & reporting
│   ├── content/            # RSS feeds & portfolio
│   ├── settings/           # System configuration
│   └── audit/              # Compliance & logs
├── components/
│   ├── DashboardLayout/    # Main layout wrapper
│   ├── Navigation/         # Top nav + sidebar
│   ├── DataTables/         # Advanced table components
│   ├── Charts/             # Data visualization
│   ├── Forms/              # Dynamic form builder
│   └── Modals/             # Reusable modals
├── hooks/                  # Custom React hooks
├── stores/                 # Zustand stores
├── lib/                    # Utilities & helpers
└── styles/                 # Global + component styles
```

### 1.2 Dashboard Home (KPI Overview)

**Route:** `/admin/dashboard`

**Key Metrics Displayed:**

```typescript
interface DashboardMetrics {
  // Financial
  revenue: {
    thisMonth: number;
    lastMonth: number;
    ytd: number;
    trend: 'up' | 'down' | 'flat';
  };
  
  // Projects
  projects: {
    active: number;
    completed: number;
    overdue: number;
    completion_rate: number;
  };
  
  // Clients
  clients: {
    total: number;
    new_this_month: number;
    churn_rate: number;
    retention: number;
  };
  
  // Payments
  invoices: {
    issued: number;
    paid: number;
    outstanding: number;
    overdue: number;
  };
  
  // Team
  team: {
    utilization: number;        // % of capacity
    billable_hours: number;
    active_staff: number;
    tasks_pending: number;
  };
}
```

**Charts & Visualizations:**

1. **Revenue Trend** (Line chart)
   - X-axis: Last 12 months
   - Y-axis: IDR (millions)
   - Series: Actual, Forecasted
   - Interactive: Hover for details

2. **Project Status Breakdown** (Donut chart)
   - Active (blue)
   - Completed (green)
   - Overdue (red)
   - On Hold (gray)

3. **Invoice Status Funnel** (Funnel chart)
   - Created → Sent → Paid
   - Total outstanding in red

4. **Team Utilization Heatmap** (Table + color)
   - Staff name | Utilization % | Billable hours

5. **Top Clients by Revenue** (Bar chart)
   - Top 10 clients
   - Sort by LTV or recent

**UI Components:**

```tsx
// Example: KPI Card with trend
<KPICard
  label="Monthly Revenue"
  value="IDR 125.5M"
  change="+12.5%"
  trend="up"
  period="vs last month"
  icon={<TrendingUp />}
  onClick={() => navigate('/admin/reports/revenue')}
/>

// Example: Data Grid with filters
<ProjectDataGrid
  columns={['title', 'client', 'status', 'value', 'timeline']}
  filters={[
    { key: 'status', type: 'select', options: PROJECT_STATUS },
    { key: 'segment', type: 'select', options: ['enterprise', 'academic'] },
    { key: 'date_range', type: 'daterange' }
  ]}
  actions={[
    { label: 'View', icon: <Eye /> },
    { label: 'Edit', icon: <Edit /> },
    { label: 'Delete', icon: <Trash /> }
  ]}
/>
```

---

### 1.3 Projects Management

**Route:** `/admin/projects`

**Features:**

1. **Project List View**
   - Table dengan pagination, sorting, filtering
   - Columns: ID | Title | Client | Status | Value | Assigned To | Timeline | Actions
   - Bulk actions: Export, Reassign, Archive
   - Search: Project name, client, ID

2. **Project Detail View** (`/admin/projects/[id]`)
   - Tab 1: Overview (timeline, status, team)
   - Tab 2: Brief (client info, requirements)
   - Tab 3: SoW (deliverables, pricing)
   - Tab 4: Contract (agreement status, signatures)
   - Tab 5: Invoices (payment schedule, history)
   - Tab 6: BAST (QA checklist, completion)
   - Tab 7: Files (document storage)
   - Tab 8: Activity Log (audit trail)

3. **Quick Actions Modal**
   ```typescript
   const projectActions = [
     { action: 'generate_sow', label: 'Generate SoW', icon: <FileText /> },
     { action: 'create_contract', label: 'Create Contract', icon: <FileCheck /> },
     { action: 'create_invoice', label: 'Create Invoice', icon: <DollarSign /> },
     { action: 'send_to_client', label: 'Send to Client', icon: <Send /> },
     { action: 'create_bast', label: 'Create BAST', icon: <CheckCircle /> },
     { action: 'add_note', label: 'Add Internal Note', icon: <MessageSquare /> },
     { action: 'reassign', label: 'Reassign to Staff', icon: <Users /> },
     { action: 'archive', label: 'Archive Project', icon: <Archive /> },
   ];
   ```

4. **Project Timeline Gantt Chart**
   - X-axis: Timeline (weeks/months)
   - Y-axis: Project list
   - Interactive drag-to-reschedule
   - Color: Status (blue=active, green=completed, red=overdue)
   - Milestones: Brief approved, SoW approved, Contract signed, BAST signed

5. **Workflow Automation**
   ```typescript
   interface ProjectWorkflow {
     // Auto-generate SoW after brief approval
     auto_generate_sow: boolean;
     auto_generate_sow_delay_days: number;
     
     // Auto-create invoice after contract signing
     auto_create_deposit_invoice: boolean;
     
     // Auto-send reminders
     reminder_unpaid_invoice_days: number;
     reminder_overdue_project_days: number;
     
     // Auto-complete projects
     auto_complete_after_bast_days: number;
   }
   ```

---

### 1.4 Clients & Relationships

**Route:** `/admin/clients`

**Features:**

1. **Client Directory**
   - Cards or table view
   - Filter: Segment (enterprise/academic), Status (active/inactive), Region
   - Search: Company name, email, contact person
   - Quick view: Company logo, rating, total revenue, projects count

2. **Client Profile** (`/admin/clients/[id]`)
   - Section 1: Company info (name, logo, website, contact)
   - Section 2: Contact persons (multiple decision makers)
   - Section 3: Projects (all associated projects with status)
   - Section 4: Invoices (payment history)
   - Section 5: Retainers (monthly services)
   - Section 6: Notes (internal CRM notes)
   - Section 7: Files (contracts, agreements)

3. **Client Segmentation Analysis**
   - By segment: Enterprise vs Academic
   - By size: ARR (annual recurring revenue)
   - By churn risk: NRR, retention metrics
   - By growth potential: Expansion opportunities

4. **Client Portal Access Management**
   - Create/edit portal users
   - Set permissions (view projects, download files, pay invoices)
   - Track login activity

---

### 1.5 Invoicing & Payment Tracking

**Route:** `/admin/invoices`

**Features:**

1. **Invoice List**
   - Columns: Invoice # | Client | Amount | Status | Due Date | Days Overdue | Actions
   - Filters: Status (pending, paid, overdue, expired), Date range, Client
   - Bulk actions: Send reminder, Mark as paid, Cancel, Export
   - Grouping: By status or client

2. **Invoice Creation Flow**
   ```tsx
   <InvoiceCreationWizard
     step={1}
     fields={[
       { name: 'project_id', type: 'select', label: 'Select Project', required: true },
       { name: 'invoice_type', type: 'radio', options: ['deposit', 'progress', 'final'] },
       { name: 'amount_idr', type: 'number', label: 'Amount (IDR)' },
       { name: 'due_date', type: 'date', label: 'Due Date' },
       { name: 'items', type: 'repeater', fields: [...] },
       { name: 'notes', type: 'textarea' }
     ]}
     onSubmit={async (data) => {
       // Call POST /api/invoices
       // Display payment link
       // Send email to client
     }}
   />
   ```

3. **Payment Reconciliation**
   - Manual mark as paid
   - Automated reconciliation with Xendit
   - Payment method tracking (bank transfer, credit card, e-wallet)
   - Overpayment/underpayment handling

4. **Collections Management**
   - Aging report: Current, 30+ days, 60+ days, 90+ days
   - Send automated payment reminders (email + SMS)
   - Track payment follow-ups
   - Late payment penalties calculation

5. **Recurring Billing (Retainers)**
   - Auto-generate monthly invoices on billing day
   - Auto-charge logic (if enabled)
   - Track failed charges
   - Pause/resume subscriptions

---

### 1.6 Document & Template Management

**Route:** `/admin/templates`

**Features:**

1. **Template Library**
   - Master Brief template
   - SoW template
   - Contract templates (Kemitraan, Service, Retainer)
   - BAST template
   - Email templates (notifications, reminders)
   - Letter templates (invoice, receipt, thank you)

2. **Template Editor**
   - Rich text editor with variable insertion
   - Variables: {{client_name}}, {{project_title}}, {{total_amount}}, etc.
   - Preview mode with sample data
   - Version history
   - Approval workflow (draft → approved → published)

3. **Template Variables Registry**
   ```typescript
   interface TemplateVariable {
     key: string;              // e.g., "client_name"
     label: string;            // "Client Name"
     description: string;
     type: 'text' | 'number' | 'date' | 'currency' | 'array';
     required: boolean;
     examples: string[];
     source_table: string;     // e.g., "clients"
     source_field: string;
   }
   ```

4. **Generated Document Tracking**
   - List of all generated documents
   - Filter: Type, client, date range, status
   - Download, resend, delete
   - Audit log (who generated, when, from what template)

---

### 1.7 Team & Resource Management

**Route:** `/admin/team`

**Features:**

1. **Staff Directory**
   - Table: Name | Role | Email | Dept | Skills | Availability | Actions
   - Add/edit staff members
   - Skills management (tagging system)
   - Set hourly rate, allocation %, utilization tracking

2. **Project Assignment Board**
   - Kanban board: Backlog → Assigned → In Progress → Completed
   - Drag-to-assign tasks to staff
   - Filter by role, skills, availability
   - Real-time capacity view

3. **Utilization Analytics**
   - Monthly utilization rate per staff
   - Billable vs non-billable hours
   - Availability vs actual allocation
   - Cost analysis (hourly rate × hours)

4. **Skills Matrix**
   - Staff vs skills heatmap
   - Identify skill gaps
   - Training recommendations
   - Cross-functional team planning

---

### 1.8 Analytics & Reporting

**Route:** `/admin/reports`

**Key Reports:**

1. **Revenue Report**
   - Gross revenue by month/quarter/year
   - By segment (enterprise vs academic)
   - By project type
   - By client
   - Forecast vs actual
   - Export: PDF, Excel, CSV

2. **Project Performance Report**
   - Timeline accuracy (planned vs actual)
   - Budget variance (planned vs actual cost)
   - Completion rate (on-time vs overdue)
   - Quality metrics (from BAST)
   - Client satisfaction scores

3. **Cash Flow Report**
   - Invoice issued vs received
   - Payment timing (days to payment)
   - Outstanding receivables aging
   - Projected cash flow (30/60/90 days)

4. **Team Productivity Report**
   - Hours logged per person
   - Project assignments per person
   - Billable rate utilization
   - Overtime tracking
   - Cost per project

5. **Client Analytics**
   - Segmentation breakdown
   - LTV (lifetime value) per client
   - Repeat purchase rate
   - NRR (net revenue retention)
   - Churn analysis

6. **Custom Report Builder**
   - Drag-drop to select metrics
   - Time period selection
   - Filters (client, segment, project type)
   - Visualization: Table, chart, pivot
   - Schedule automated reports (email delivery)

---

### 1.9 Settings & Configuration

**Route:** `/admin/settings`

**Sections:**

1. **Business Settings**
   - Company info, legal entity, tax ID
   - Payment terms (default deposit %, payment methods)
   - Service pricing (hourly rate per role, project markups)
   - Billing settings (invoice prefix, due date defaults)

2. **Integrations**
   - Xendit credentials (API key, merchant ID)
   - Supabase connection
   - Email service (SendGrid, Mailgun config)
   - SMS service (Twilio, etc.)
   - Slack integration
   - Google Drive integration

3. **Automation Rules**
   - Auto-generate SoW after brief approval
   - Auto-create invoice after contract signing
   - Auto-send payment reminders
   - Auto-complete projects after BAST
   - Notification triggers (email, in-app, SMS)

4. **Email Templates**
   - Payment reminders
   - Invoice sent notification
   - Project completion notification
   - Welcome email for new clients
   - Custom email templates

5. **User Roles & Permissions**
   - Role definitions (admin, manager, analyst, viewer)
   - Permission matrix (create, read, update, delete, export)
   - Field-level permissions (who can see revenue, cost, etc.)

6. **API Keys & Webhooks**
   - Generate API keys for integrations
   - Webhook URL management
   - Webhook delivery logs
   - Retry policy configuration

7. **Backup & Security**
   - Database backup schedule
   - Data retention policy
   - GDPR/compliance settings
   - 2FA enforcement
   - Session timeout

---

### 1.10 Audit & Compliance

**Route:** `/admin/audit`

**Features:**

1. **Activity Log**
   - Timestamp | User | Action | Entity | Changes | IP Address
   - Filter: Date range, user, action type, entity type
   - Export: PDF, Excel, CSV

2. **Financial Audit Trail**
   - Every invoice creation/update
   - Every payment received
   - Every currency conversion
   - Refunds/cancellations

3. **Contract Audit Trail**
   - Contract generation
   - Signature events (who signed, when, IP)
   - Contract modifications
   - Contract terminations

4. **Compliance Reports**
   - Tax report (invoices by month/quarter)
   - PPN (VAT) compliance
   - Retainer revenue tracking
   - Data retention compliance (GDPR, IDPR)

---

## 2. CLIENT PORTAL

### 2.1 Client Dashboard

**Route:** `/portal/dashboard` (after login)

**Key Sections:**

1. **Project Status Overview**
   ```typescript
   interface ClientProjectView {
     project_title: string;
     status: ProjectStatus;
     progress_percent: number;        // Visual progress bar
     timeline: {
       expected_end: Date;
       days_remaining: number;
     };
     next_milestone: string;
     assigned_team: StaffMember[];    // Show visible team only
   }
   ```

2. **Quick Actions**
   - View all projects
   - Download files
   - Pay invoice
   - Message team (contact form)
   - Schedule meeting

3. **Invoice & Payment**
   - Current invoices (amount, due date, status)
   - Payment history
   - Pay now button (link to Xendit payment gateway)
   - Invoice download (PDF)

4. **File Downloads**
   - SoW document
   - Contract
   - Generated deliverables
   - Reports & analytics

5. **Updates & Communications**
   - Project milestone notifications
   - Payment reminders
   - File ready notifications
   - Team messages

---

### 2.2 Project Details View

**Route:** `/portal/projects/[id]`

**Tabs:**

1. **Overview**
   - Project title, description
   - Team members and contact info
   - Timeline and progress
   - Current status

2. **Deliverables**
   - List of deliverables from SoW
   - Status per deliverable (pending, in progress, completed)
   - Download links (when available)
   - Revision history

3. **Documents**
   - Download SoW, Contract, BAST
   - View document version history
   - Request document changes (form)

4. **Payments**
   - Invoice list for this project
   - Amount, due date, status
   - Payment link (for unpaid invoices)
   - Download invoices

5. **Communications**
   - Team contact information
   - Contact form to reach team
   - Schedule meeting/call (calendar integration)
   - FAQ section

6. **Updates**
   - Project milestone history
   - Status changes log
   - Uploaded files notification
   - Comments (if enabled)

---

### 2.3 Invoice & Payment Portal

**Route:** `/portal/invoices`

**Features:**

1. **Invoice List**
   - Invoice number | Date | Amount | Due Date | Status | Actions
   - View invoice (PDF)
   - Pay invoice (button)
   - Download receipt (if paid)

2. **Payment Flow**
   ```
   Click "Pay" 
     ↓
   Confirmation modal (amount, due date)
     ↓
   Redirect to Xendit payment gateway
     ↓
   Multiple payment methods: Bank transfer, credit card, e-wallet
     ↓
   Return to portal with success/failure message
     ↓
   Email receipt (auto-sent by Xendit)
   ```

3. **Payment History**
   - Table: Invoice | Amount | Paid Date | Payment Method | Receipt
   - Export payment history
   - Refund requests (if applicable)

---

### 2.4 Account Settings

**Route:** `/portal/settings`

**Sections:**

1. **Company Profile**
   - Company name
   - Contact persons (multiple)
   - Email addresses
   - Phone numbers

2. **Billing Settings**
   - Billing contact person
   - Billing email
   - Preferred payment method
   - Billing address

3. **Notifications**
   - Email notifications (toggle by type)
   - Payment reminders
   - Project updates
   - File ready notifications
   - Invoice received

4. **Portal Users**
   - List of users with portal access
   - Add/remove portal users
   - Reset password
   - Set user permissions (view projects, download files, pay invoices)

5. **Connected Services** (Optional)
   - Slack channel notifications
   - Webhook URL for updates
   - API keys (for developers)

---

## 3. UI/UX DESIGN SYSTEM

### 3.1 Component Library (shadcn/ui based)

```typescript
// Core components available
import {
  // Layout
  Card, CardContent, CardDescription, CardHeader, CardTitle,
  Container, Sidebar, TopNav,
  
  // Form
  Form, FormField, Input, Textarea, Select, Checkbox, Radio,
  DatePicker, DateRangePicker, TimePicker, SearchInput,
  
  // Data Display
  Table, DataGrid, Tabs, Accordion, Tree,
  Badge, Avatar, AvatarGroup,
  
  // Feedback
  Alert, Toast, Progress, SkeletonLoader,
  
  // Navigation
  Breadcrumb, Pagination, Tabs, Stepper,
  
  // Dialog & Modal
  Dialog, Modal, Drawer, Popover,
  
  // Charts
  BarChart, LineChart, AreaChart, PieChart, DoughnutChart,
  Heatmap, Gantt, Sankey,
  
  // Advanced
  FileUpload, RichTextEditor, CodeEditor,
  MapComponent, CalendarComponent
} from '@/components/ui';
```

### 3.2 Color Scheme & Tokens

```typescript
const designTokens = {
  colors: {
    primary: '#2563eb',        // Blue
    secondary: '#7c3aed',      // Purple
    success: '#10b981',        // Green
    warning: '#f59e0b',        // Amber
    error: '#ef4444',          // Red
    neutral: '#6b7280',        // Gray
    surface: '#ffffff',        // White
    background: '#f9fafb',     // Light gray
  },
  
  typography: {
    heading1: '32px / 1.2 / 700',
    heading2: '24px / 1.3 / 700',
    heading3: '20px / 1.4 / 600',
    body: '16px / 1.5 / 400',
    small: '14px / 1.5 / 400',
    tiny: '12px / 1.4 / 500',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
    xl: '0 20px 25px rgba(0,0,0,0.1)',
  },
};
```

### 3.3 Responsive Design

```typescript
// Mobile-first breakpoints
const breakpoints = {
  sm: '640px',   // Mobile
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large
  '2xl': '1536px', // Extra large
};

// Example usage in Tailwind
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns */}
</div>
```

---

## 4. DYNAMIC FORM SYSTEM

### 4.1 Form Builder Architecture

```typescript
interface DynamicFormConfig {
  id: string;
  name: string;
  sections: FormSection[];
  submission_behavior: 'api' | 'email' | 'database';
  redirect_on_success: string;
  email_notification: {
    enabled: boolean;
    recipients: string[];
    subject: string;
  };
}

interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  conditional?: ConditionalLogic;
}

interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'date' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'file' | 'repeater';
  validation: ValidationRule[];
  required: boolean;
  placeholder?: string;
  helper_text?: string;
  default_value?: any;
  options?: SelectOption[];  // For select, radio, checkbox
  conditional?: ConditionalLogic;
  metadata?: Record<string, any>;
}

interface ValidationRule {
  type: 'required' | 'minlength' | 'maxlength' | 'pattern' | 'email' | 'number' | 'custom';
  value: any;
  message: string;
}
```

### 4.2 Form Editor Interface

**Admin can create/edit forms via UI:**

```tsx
<FormBuilder
  initialConfig={formConfig}
  onSave={async (config) => {
    // Save to database
    await updateFormConfig(config);
  }}
  features={[
    'drag-and-drop-fields',
    'field-validation-rules',
    'conditional-logic',
    'email-notifications',
    'custom-styling',
    'success-page-redirect',
    'payment-integration'
  ]}
/>
```

### 4.3 Pre-built Form Templates

1. **Master Brief Form**
   - Client info, project type, budget, timeline
   - Auto-validation
   - Pre-fill from client database

2. **Project Inquiry Form**
   - Simple 5-field form for lead generation
   - Email notification to sales team

3. **Contact Form**
   - Name, email, subject, message
   - Spam protection (reCAPTCHA)

4. **Document Request Form**
   - Select documents to request
   - Email trigger

5. **Feedback/Survey Form**
   - Project satisfaction survey
   - Store results in database

---

## 5. DATA ACCESS & SECURITY

### 5.1 Row-Level Security (RLS) Policies

```sql
-- Admin can see all data
CREATE POLICY "admin_all_access" ON projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM staff 
      WHERE auth_user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Staff can see projects assigned to them
CREATE POLICY "staff_assigned_projects" ON projects
  FOR SELECT USING (
    assigned_to_staff_id = (
      SELECT id FROM staff WHERE auth_user_id = auth.uid()
    )
  );

-- Clients can only see their own projects
CREATE POLICY "client_own_projects" ON projects
  FOR SELECT USING (
    client_id = (
      SELECT id FROM clients WHERE auth_user_id = auth.uid()
    )
  );
```

### 5.2 Field-Level Permissions

```typescript
interface FieldPermissions {
  field_name: string;
  read: Role[];          // ['admin', 'manager']
  write: Role[];         // ['admin']
  edit_conditions?: {
    project_status: ProjectStatus[];
    user_role: Role[];
  };
}

// Example: Only admins can see project cost
const costFieldPermissions = {
  field_name: 'total_amount_idr',
  read: ['admin', 'manager'],
  write: ['admin'],
};
```

### 5.3 Data Access Audit

```typescript
// Every data access logged
interface DataAccessLog {
  id: UUID;
  user_id: UUID;
  entity_type: string;         // 'projects', 'invoices', etc.
  entity_id: UUID;
  action: 'read' | 'create' | 'update' | 'delete' | 'export';
  timestamp: DateTime;
  ip_address: string;
  was_allowed: boolean;
  reason_if_denied?: string;
}
```

---

## 6. FORM DATA PROCESSING

### 6.1 Data Validation Pipeline

```typescript
async function processFormSubmission(data: any, formConfig: DynamicFormConfig) {
  // 1. Client-side validation (react-hook-form + Zod)
  const schema = buildZodSchema(formConfig);
  const validated = await schema.parseAsync(data);
  
  // 2. Server-side validation (Zod again, for security)
  const revalidated = await schema.parseAsync(validated);
  
  // 3. Business logic validation
  const businessLogicErrors = await validateBusinessRules(revalidated, formConfig);
  if (businessLogicErrors.length > 0) throw new ValidationError(businessLogicErrors);
  
  // 4. Data enrichment
  const enriched = await enrichFormData(revalidated, formConfig);
  
  // 5. Persistence
  const saved = await saveFormSubmission(enriched, formConfig);
  
  // 6. Notifications & workflows
  await triggerWorkflows(saved, formConfig);
  
  return saved;
}
```

### 6.2 Data Storage Strategy

```typescript
// Store form submissions with audit trail
interface FormSubmission {
  id: UUID;
  form_id: string;
  user_id: UUID;
  data: JSONB;                    // Original submission data
  data_hash: string;              // For tamper detection
  validation_errors: string[];    // Any validation issues
  processing_status: 'pending' | 'processed' | 'failed';
  created_at: DateTime;
  processed_at?: DateTime;
  stored_in_table?: string;       // e.g., 'projects', 'briefs'
  stored_record_id?: UUID;        // Foreign key to actual table
}
```

---

## 7. MODERN UI/UX PATTERNS

### 7.1 Real-time Updates

```typescript
// Use Supabase Realtime for live updates
useEffect(() => {
  const subscription = supabase
    .from('projects')
    .on('*', (payload) => {
      console.log('Project updated:', payload);
      refetchProjects();
    })
    .subscribe();
    
  return () => subscription.unsubscribe();
}, []);
```

### 7.2 Optimistic Updates

```typescript
// Update UI before API confirms
const updateProject = async (projectId, updates) => {
  // 1. Optimistically update local state
  setProject(prev => ({ ...prev, ...updates }));
  
  // 2. Call API in background
  try {
    await api.projects.update(projectId, updates);
  } catch (error) {
    // 3. Rollback if API fails
    setProject(originalProject);
    toast.error('Update failed');
  }
};
```

### 7.3 Loading States & Skeletons

```tsx
<Suspense fallback={<ProjectListSkeleton count={5} />}>
  <ProjectList />
</Suspense>

// Skeleton matches actual layout
const ProjectListSkeleton = ({ count = 5 }) => (
  <>
    {Array.from({ length: count }).map(i => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    ))}
  </>
);
```

### 7.4 Empty States & Error Boundaries

```tsx
// Empty state when no projects
<EmptyState
  icon={<Inbox />}
  title="No projects yet"
  description="Create your first project to get started"
  action={<Button onClick={goToCreateProject}>Create Project</Button>}
/>

// Error boundary for robustness
<ErrorBoundary
  fallback={<ErrorState error={error} retry={retry} />}
  onError={logErrorToSentry}
>
  <DashboardContent />
</ErrorBoundary>
```

---

## 8. SEO & PERFORMANCE

### 8.1 Next.js Optimization

```typescript
// app/admin/layout.tsx
export const metadata = {
  title: 'Admin Dashboard | Mitra Infrastruktur',
  description: 'Manage projects, invoices, and team',
  robots: 'noindex, nofollow', // Don't index admin area
};

// Dynamic OG images
export async function generateOGImage() {
  return new ImageResponse(
    <div style={{ /* styling */ }}>
      Admin Dashboard
    </div>
  );
}
```

### 8.2 Core Web Vitals Optimization

```typescript
// Next.js 14 optimizations
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Lazy load heavy components
const AdvancedChart = dynamic(
  () => import('@/components/AdvancedChart'),
  { loading: () => <ChartSkeleton />, ssr: false }
);

// Image optimization
<Image
  src={clientLogo}
  alt="Client logo"
  width={100}
  height={100}
  priority={isAboveFold}
/>
```

### 8.3 Lighthouse Performance Targets

```
LCP (Largest Contentful Paint):  < 2.5s
FID (First Input Delay):         < 100ms
CLS (Cumulative Layout Shift):   < 0.1
FCP (First Contentful Paint):    < 1.8s
TTFB (Time to First Byte):       < 600ms
```

---

## 9. INTEGRATION POINTS

### 9.1 Third-Party Integrations

```typescript
// Email integration (SendGrid)
await sendEmail({
  to: client.email,
  template: 'invoice_reminder',
  data: { invoice_number, amount, due_date }
});

// Payment gateway (Xendit)
const paymentLink = await xendit.createInvoice({
  amount: invoiceAmount,
  description: `Invoice #${invoiceNumber}`,
  webhook_url: webhookUrl
});

// File storage (Supabase Storage)
const filePath = await uploadToStorage('documents', file);

// Analytics (PostHog or Mixpanel)
analytics.track('project_created', {
  project_id: projectId,
  segment: clientSegment,
  value: projectValue
});
```

### 9.2 Webhook Integration

```typescript
// Client dashboard receives real-time updates via webhook
POST /portal/webhooks/project-update
{
  "event": "project.status_changed",
  "project_id": "prj_123",
  "new_status": "active",
  "timestamp": "2026-05-17T10:30:00Z"
}
```

---

## 10. TESTING STRATEGY

### 10.1 Component Testing

```typescript
// Jest + React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectList } from '@/components/ProjectList';

describe('ProjectList', () => {
  it('renders project list with filters', () => {
    render(<ProjectList />);
    expect(screen.getByPlaceholderText('Search projects')).toBeInTheDocument();
  });
  
  it('filters projects by status', async () => {
    render(<ProjectList />);
    fireEvent.change(screen.getByDisplayValue('All statuses'), {
      target: { value: 'active' }
    });
    expect(screen.getAllByTestId('project-card')).toHaveLength(3);
  });
});
```

### 10.2 Integration Testing

```typescript
// E2E with Playwright
test('Complete invoice payment flow', async ({ page }) => {
  await page.goto('/admin/invoices');
  await page.click('button:has-text("Create Invoice")');
  await page.fill('input[name="amount"]', '5000000');
  await page.click('button:has-text("Generate")');
  expect(page.url()).toContain('/invoices/');
});
```

---

## IMPLEMENTATION PRIORITY

**Phase 1 (Week 3-4):** Admin dashboard core
- Home/KPI view
- Projects list & detail
- Basic navigation

**Phase 2 (Week 4-5):** Admin projects & invoicing
- Project creation & workflow
- Invoice management
- Simple reporting

**Phase 3 (Week 5-6):** Client portal
- Landing page
- Project view
- Invoice payment

**Phase 4 (Week 6-7):** Advanced features
- Dynamic forms
- Advanced reporting
- Team management

**Phase 5 (Week 7-8):** Optimization & Polish
- Performance tuning
- UI/UX refinement
- Integration testing

---

**Status:** ✅ Ready for Next.js Implementation  
**Last Updated:** May 17, 2026
