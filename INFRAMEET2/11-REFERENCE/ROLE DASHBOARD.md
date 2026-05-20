\# INFRAMEET — ROLE DASHBOARD PANELS \+ FULL STACK INTEGRATION SPEC (DOC-7)  
\*\*Version:\*\* v1.0    
\*\*Status:\*\* Engineering Ready    
\*\*Scope:\*\* Role dashboards, UI panels, backend API routes, Supabase tables, RLS, data flow FE↔BE↔DB, sync patterns    
\*\*Audience:\*\* AI Coder (Fullstack)    
\*\*Goal:\*\* Tidak ada mismatch antara UI, backend endpoints, database schema, dan permissions.

\---

\# 1\) ROLE DEFINITIONS & ACCESS MODEL

\#\# 1.1 Roles  
\- \*\*guest\*\*: anonymous visitor  
\- \*\*user\*\*: authenticated user (Supabase Auth)  
\- \*\*owner\*\*: user yang memiliki \`omni\_directory.owner\_id\`  
\- \*\*verifier\*\*: user dengan role \`verifier\`  
\- \*\*admin\*\*: user dengan role \`admin\`

\#\# 1.2 Role Storage (DB Contract)  
Role disimpan pada:  
\- \`profiles.role\` (enum: user, verifier, admin)  
\- ownership via \`omni\_directory.owner\_id\`

\*\*Rule:\*\*  
\- verifier/admin tetap bisa jadi owner juga.  
\- UI role gating hanya cosmetic, enforcement utama wajib via RLS \+ RPC.

\---

\# 2\) DASHBOARD ARCHITECTURE (HIGH LEVEL)

Dashboard terdiri dari:  
\- \*\*Dashboard Home\*\* (overview panel)  
\- \*\*Module Pages\*\* (proofs/claims/widgets/inquiries/etc)  
\- \*\*Role Panels\*\* (owner vs verifier vs admin)

Dashboard layout:  
\- sidebar menu dynamic (berdasarkan role \+ feature flags)  
\- server-side auth gate  
\- optimistic UI optional

\---

\# 3\) PANEL DASHBOARD PER ROLE (REQUIRED)

\---

\# 3.1 GUEST PANEL (Public Only)  
\*\*Routes:\*\*  
\- \`/\`  
\- \`/search\`  
\- \`/directory/\[slug\]\`  
\- \`/tools/\*\`  
\- \`/updates/\*\`

\*\*UI Modules:\*\*  
\- search bar  
\- trending categories  
\- leaderboards  
\- tool outputs

\*\*CTAs:\*\*  
\- "Claim Profile"  
\- "Create Profile"  
\- "Send Inquiry"

\---

\# 3.2 USER PANEL (Authenticated but Not Owner Yet)  
\*\*Goal:\*\* convert user menjadi owner (claim/create entity).

\#\# Required Dashboard Routes  
\- \`/dashboard\` (overview)  
\- \`/dashboard/entities\` (create first entity)  
\- \`/dashboard/claim\` (claim existing entity)

\#\# Dashboard Home Widgets  
\- Welcome card  
\- CTA card: "Create Entity"  
\- CTA card: "Claim Existing Entity"  
\- Recent activity logs (empty state)  
\- Referral program panel (optional)

\#\# Entities Page Widgets  
\- Create entity form  
\- Draft entity list (if any)

\*\*Primary KPI:\*\* create entity \+ claim verification.

\---

\# 3.3 OWNER PANEL (Core Dashboard)  
\*\*Goal:\*\* owner mengelola trust score & leads.

\#\# Required Owner Routes  
\- \`/dashboard\`  
\- \`/dashboard/entities\`  
\- \`/dashboard/entity/\[id\]\`  
\- \`/dashboard/proofs\`  
\- \`/dashboard/claim\`  
\- \`/dashboard/widgets\`  
\- \`/dashboard/inquiries\`  
\- \`/dashboard/settings\`

\#\# Owner Home (Overview Panel)  
\#\#\# Cards Required  
1\. Trust Score Card (large)  
2\. Verification Status Card (progress milestone)  
3\. Pending Tasks Card  
4\. Leads (inquiries) summary  
5\. Widget stats summary (30d)  
6\. Proof pipeline summary (pending/approved/rejected)  
7\. Claim status summary

\#\#\# Owner Quick Actions  
\- Upload Proof  
\- Generate Widget  
\- Copy Profile Link  
\- Request Claim  
\- Invite team member (optional future)

\---

\# 3.4 VERIFIER PANEL (Moderation Dashboard)  
\*\*Goal:\*\* memproses proofs & claims secara cepat dan audit-friendly.

\#\# Required Verifier Routes  
\- \`/admin/proofs\`  
\- \`/admin/claims\`  
\- \`/admin/moderation\`  
\- \`/admin/system-events\`

\#\# Verifier Home Widgets (Admin Overview)  
\- Pending Proofs Count  
\- Pending Claims Count  
\- Recently flagged entities  
\- Recent system\_events (security)

\#\#\# Proof Review Panel Must Support  
\- file preview (pdf/image/url)  
\- approve/reject with reason  
\- tag classification  
\- trust\_score impact preview

\---

\# 3.5 ADMIN PANEL (System Operator)  
\*\*Goal:\*\* kontrol penuh, audit logs, feature toggles.

\#\# Admin Exclusive Widgets  
\- Feature flags override  
\- Global rate limit monitor  
\- Worker job status table  
\- Storage usage estimate  
\- SEO cache refresh triggers  
\- Abuse IP/Domain blacklist

\---

\# 4\) SIDEBAR MENU MAP BY ROLE

\#\# guest  
No dashboard sidebar.

\#\# user  
\- Overview  
\- Entities  
\- Claim  
\- Settings

\#\# owner  
\- Overview  
\- Entities  
\- Proofs  
\- Claims  
\- Inquiries  
\- Widgets  
\- Settings

\#\# verifier  
\- Proof Queue  
\- Claim Queue  
\- Moderation  
\- System Events

\#\# admin  
\- Proof Queue  
\- Claim Queue  
\- Moderation  
\- System Events  
\- Worker Jobs  
\- Feature Flags  
\- Analytics Monitor

\*\*Rule:\*\* Sidebar generated dynamically dari \`role \+ feature flags\`.

\---

\# 5\) FULL STACK DATA FLOW (FE↔BE↔DB)

\#\# 5.1 Data Fetching Pattern (Recommended)  
Frontend Next.js memakai:  
\- Server Components untuk public pages & dashboard initial load  
\- Client Components untuk forms \+ interactive tables  
\- API routes untuk privileged operations

\#\#\# Allowed Methods  
\- Supabase client (anon) untuk public read-only  
\- Supabase client (auth) untuk owner read/write  
\- Server route (service role) untuk:  
  \- approve proof  
  \- claim verification  
  \- abuse actions  
  \- worker operations

\---

\#\# 5.2 Public Read Flow  
Public page calls:  
\- \`GET /api/public/entity?slug=...\`  
Backend:  
\- query \`omni\_directory\` \+ join summary tables  
\- return safe payload only

\*\*Rule:\*\*  
Public endpoint must NEVER leak metadata\_private.

\---

\#\# 5.3 Owner Write Flow  
Owner UI submits:  
\- POST /api/owner/entity/update  
\- POST /api/owner/proof/upload  
\- POST /api/owner/widget/create  
\- POST /api/owner/inquiry/mark

Backend:  
\- validate Zod  
\- check auth user\_id  
\- enforce ownership  
\- write to Supabase

\---

\#\# 5.4 Verifier Moderation Flow  
Verifier UI uses:  
\- POST /api/admin/proofs/approve  
\- POST /api/admin/proofs/reject  
\- POST /api/admin/claims/approve  
\- POST /api/admin/claims/reject

Backend:  
\- role check (verifier/admin)  
\- update status  
\- insert audit logs  
\- trigger reputation recalculation RPC

\---

\# 6\) API ROUTE MAP (ENGINEERING CONTRACT)

\#\# 6.1 Public API  
\- \`GET /api/public/search?q=\&filters=\`  
\- \`GET /api/public/entity?slug=\`  
\- \`GET /api/public/category?slug=\`  
\- \`GET /api/public/city?slug=\`  
\- \`POST /api/public/inquiry/submit\`

\#\# 6.2 Auth/User API  
\- \`POST /api/auth/create-entity\`  
\- \`POST /api/auth/referral/capture\` (optional)

\#\# 6.3 Owner API  
\- \`POST /api/owner/entity/update\`  
\- \`POST /api/owner/proof/create\`  
\- \`POST /api/owner/proof/delete\`  
\- \`POST /api/owner/claim/request\`  
\- \`POST /api/owner/widget/create\`  
\- \`POST /api/owner/widget/revoke\`  
\- \`POST /api/owner/inquiry/update-status\`

\#\# 6.4 Admin API  
\- \`POST /api/admin/proofs/approve\`  
\- \`POST /api/admin/proofs/reject\`  
\- \`POST /api/admin/claims/approve\`  
\- \`POST /api/admin/claims/reject\`  
\- \`POST /api/admin/moderation/flag-entity\`  
\- \`POST /api/admin/moderation/unflag-entity\`  
\- \`GET /api/admin/system-events\`  
\- \`POST /api/admin/feature-flags/set\` (optional)

\#\# 6.5 Embed/Widget API  
\- \`GET /embed/widget/\[entitySlug\].js\`  
\- \`POST /api/widget/event\`  
\- \`POST /api/widget/impression\`

\---

\# 7\) DATABASE SYNC CONTRACT (TABLE ↔ UI MODULE)

\#\# 7.1 Core Tables → UI Mapping  
| Table | UI Module |  
|---|---|  
| omni\_directory | directory page \+ entity editor |  
| trust\_proofs | proofs dashboard \+ proof summary |  
| proof\_reviews | verifier panel |  
| entity\_claim\_requests | claim dashboard \+ verifier claims |  
| entity\_inquiries | inquiries inbox |  
| widget\_installations | widgets dashboard |  
| widget\_events | widget analytics |  
| reputation\_logs | trust score transparency panel |  
| system\_events | admin logs |  
| seo\_page\_cache | pSEO pages |  
| entity\_updates | updates/discover feed |

\---

\# 8\) TRUST SCORE SYNC MECHANISM (CRITICAL)

\#\# 8.1 Trust Score is Derived, Not Manual  
trust\_score tidak boleh diedit manual oleh owner.

Sources:  
\- proofs approved  
\- claim verified  
\- review verified  
\- widget milestones  
\- escrow completion (optional)

\#\# 8.2 Calculation Strategy  
Recommended:  
\- RPC \`recalculate\_trust\_score(directory\_id)\`  
\- trigger call:  
  \- proof approved/rejected  
  \- claim verified  
  \- review verified  
  \- widget daily stats update

\#\# 8.3 Cache Field  
Store:  
\- \`omni\_directory.trust\_score\_cached\`  
\- \`omni\_directory.trust\_score\_updated\_at\`

Public UI uses cached field only.

\---

\# 9\) REALTIME VS CRON SYNC (IMPORTANT)

\#\# 9.1 Realtime (Supabase Realtime Optional)  
Realtime recommended only for:  
\- inquiry inbox updates  
\- proof status updates

Not recommended for:  
\- widget\_events raw stream (too heavy)

\#\# 9.2 Cron Sync (Worker Mandatory)  
Worker handles:  
\- embeddings  
\- seo cache regeneration  
\- widget aggregation daily  
\- cleanup retention  
\- DNS claim verification checks

\---

\# 10\) UI DATA FETCH SPEC (PER PAGE)

\---

\#\# 10.1 \`/dashboard\` (Owner Overview)  
Data required:  
\- entity list  
\- trust\_score\_cached  
\- verification\_status  
\- pending proofs count  
\- pending claim count  
\- inquiries unread count  
\- widget clicks last 30 days

Backend source:  
\- view \`dashboard\_owner\_summary\`

Recommended: create a DB view.

\---

\#\# 10.2 \`/dashboard/proofs\`  
Data required:  
\- proofs list by directory\_id  
\- status, title, proof\_type, verified\_at, reject\_reason

Backend:  
\- query trust\_proofs where owner\_id matches via join

\---

\#\# 10.3 \`/dashboard/claim\`  
Data required:  
\- claim requests list (active)  
\- current verified status  
\- dns/email token state

Backend:  
\- entity\_claim\_requests filtered by requester user\_id

\---

\#\# 10.4 \`/dashboard/widgets\`  
Data required:  
\- widget installations list  
\- daily stats summary

Backend:  
\- widget\_installations join widget\_event\_daily\_stats

\---

\#\# 10.5 \`/dashboard/inquiries\`  
Data required:  
\- inquiry list  
\- filters status

Backend:  
\- entity\_inquiries by directory\_id owner

\---

\#\# 10.6 \`/admin/proofs\`  
Data required:  
\- proofs pending  
\- proof file\_url/source\_url  
\- owner directory metadata minimal

Backend:  
\- trust\_proofs status=pending

\---

\#\# 10.7 \`/admin/claims\`  
Data required:  
\- claim pending  
\- method  
\- token/record needed

Backend:  
\- entity\_claim\_requests status=pending

\---

\# 11\) RLS \+ SECURITY ENFORCEMENT (MANDATORY)

\#\# 11.1 RLS Enforcement Rule  
Semua tabel owner-sensitive wajib punya RLS.

Tables requiring RLS:  
\- omni\_directory (update owner-only)  
\- trust\_proofs (insert owner-only, update verifier-only)  
\- entity\_inquiries (read owner-only)  
\- widget\_installations (owner-only)  
\- widget\_events (insert public but controlled)  
\- entity\_claim\_requests (insert user-only, update verifier-only)  
\- system\_events (admin-only)  
\- seo\_page\_cache (worker/admin-only)

\#\# 11.2 Service Role Usage Rule  
Service role hanya boleh dipakai pada:  
\- admin endpoints  
\- worker jobs  
\- claim verification

Public endpoints tidak boleh pakai service role.

\---

\# 12\) FRONTEND-BACKEND CONTRACT (STRICT RESPONSE TYPES)

\#\# 12.1 Response Envelope Standard  
Semua API harus return format sama:

\`\`\`json  
{  
  "ok": true,  
  "data": {},  
  "error": null,  
  "meta": {  
    "request\_id": "uuid",  
    "timestamp": "ISO\_DATE"  
  }  
}

Jika error:

{  
  "ok": false,  
  "data": null,  
  "error": {  
    "code": "RATE\_LIMITED",  
    "message": "Too many requests"  
  }  
}

---

## **12.2 Error Codes (Standard Enum)**

* UNAUTHORIZED  
* FORBIDDEN  
* NOT\_FOUND  
* VALIDATION\_ERROR  
* RATE\_LIMITED  
* CAPTCHA\_FAILED  
* INTERNAL\_ERROR

---

# **13\) SEQUENCE DIAGRAMS (TEXT SPEC)**

---

## **13.1 Inquiry Submit Flow (Public → Owner Inbox)**

1. visitor submit inquiry form \+ captcha token  
2. API verifies captcha  
3. API applies rate limit  
4. API inserts into `entity_inquiries`  
5. API writes `system_events` (optional info)  
6. owner sees inquiry in dashboard

---

## **13.2 Proof Upload Flow (Owner → Verifier)**

1. owner uploads proof file/url  
2. API validates payload  
3. API inserts trust\_proofs status=pending  
4. verifier sees in admin proof queue  
5. verifier approves/rejects  
6. trigger recalculates trust score  
7. directory page updates cached score

---

## **13.3 Claim Verification Flow (User → Worker → Verified)**

1. user requests claim DNS  
2. system generates token  
3. user sets TXT record  
4. worker cron checks DNS record  
5. if match → mark verified  
6. update `omni_directory.owner_id`  
7. trust\_score recalculated

---

## **13.4 Widget Tracking Flow (Public site → INFRAMEET)**

1. external site loads embed JS  
2. embed calls impression endpoint  
3. click triggers click endpoint  
4. API applies rate limit \+ dedupe  
5. store widget\_events  
6. worker aggregates daily stats  
7. owner dashboard shows summary

---

# **14\) REQUIRED DATABASE VIEWS (HIGHLY RECOMMENDED)**

## **14.1 dashboard\_owner\_summary**

Purpose: one query for dashboard overview.

Fields:

* owner\_id  
* directory\_id  
* trust\_score\_cached  
* verification\_status  
* pending\_proofs\_count  
* unread\_inquiries\_count  
* widget\_clicks\_30d  
* widget\_impressions\_30d

---

## **14.2 public\_directory\_profile\_view**

Purpose: safe public read.

Fields:

* slug  
* name  
* headline  
* description  
* verification\_status  
* trust\_score\_cached  
* proof\_count\_approved  
* reviews\_count  
* metadata\_public

---

# **15\) INTEGRATION STRATEGY (RECOMMENDED IMPLEMENTATION)**

## **15.1 FE Strategy**

* Use server components to fetch summary data  
* Use client components for:  
  * proof upload form  
  * claim request wizard  
  * inquiry inbox table  
  * widget generator

## **15.2 BE Strategy**

* API routes validate payload (Zod)  
* Use supabase auth session from cookies  
* For admin routes: verify role from profiles

## **15.3 DB Strategy**

* RLS enforced  
* RPC for trust\_score update  
* triggers insert audit logs

---

# **16\) MINIMUM PANEL REQUIREMENTS (ACCEPTANCE CRITERIA)**

System dianggap “integrated” jika:

* owner dashboard menampilkan summary yang konsisten dengan DB  
* verifier bisa approve proof dan trust\_score berubah  
* inquiry masuk dan hanya owner yang bisa lihat  
* claim verification update owner\_id dengan aman  
* widget events masuk dan statistik teragregasi  
* public directory page menampilkan data yang aman (no leak)  
* semua error state sesuai standard envelope

---

# **END OF DOC-7**

