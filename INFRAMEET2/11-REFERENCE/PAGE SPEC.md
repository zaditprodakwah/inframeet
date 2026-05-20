\# INFRAMEET — PAGE SPEC \+ USER FLOWS \+ PERMISSIONS (DOC-3)  
\*\*Version:\*\* v1.0    
\*\*Status:\*\* Engineering Ready    
\*\*Scope:\*\* Page-by-page specification, user flows, permissions matrix, UI states, minimal UX contract    
\*\*Audience:\*\* AI Coder / Frontend \+ Backend integrator    
\*\*Goal:\*\* Menghilangkan ambiguity implementasi halaman, memastikan permission & state jelas.

\---

\# 1\) GLOBAL RULES

\#\# 1.1 Page Types  
INFRAMEET terdiri dari 3 domain UI:

1\) \*\*Public Pages\*\* (SEO, visitor-first)    
2\) \*\*Dashboard Pages\*\* (owner-first)    
3\) \*\*Admin/Verifier Pages\*\* (moderation-first)

\---

\#\# 1.2 Permission Levels (Global Roles)  
\- \*\*guest\*\* (tidak login)  
\- \*\*user\*\* (login)  
\- \*\*owner\*\* (user yang punya entity)  
\- \*\*verifier\*\* (role)  
\- \*\*admin\*\* (role)

\> Semua permission harus ditegakkan dua kali: UI gate \+ RLS/backend enforcement.

\---

\#\# 1.3 Global UI States  
Semua page wajib mendukung state berikut:  
\- loading  
\- empty  
\- error  
\- forbidden (403)  
\- disabled (feature flag off)

\---

\#\# 1.4 Feature Flag Enforcement  
Jika flag off:  
\- hide nav menu  
\- block API route (return 404/disabled)  
\- worker skip job

Flags:  
\- FEATURE\_PROOFS  
\- FEATURE\_CLAIMS  
\- FEATURE\_WIDGETS  
\- FEATURE\_ESCROW

\---

\# 2\) NAVIGATION STRUCTURE

\#\# 2.1 Public Navigation (Topbar)  
\- Search  
\- Explore Categories  
\- Sign In  
\- Submit Listing (optional CTA)  
\- About (optional)

\#\# 2.2 Dashboard Navigation (Sidebar)  
\- Overview  
\- Entities  
\- Proofs  
\- Claims  
\- Inquiries  
\- Widgets  
\- Reviews (optional)  
\- Escrow (optional)  
\- Settings

\#\# 2.3 Admin Navigation  
\- Proof Queue  
\- Claim Queue  
\- Moderation  
\- System Events

\---

\# 3\) PERMISSIONS MATRIX (PAGE LEVEL)

| Page | guest | user | owner | verifier | admin |  
|---|---|---|---|---|---|  
| /search | read | read | read | read | read |  
| /directory/\[slug\] | read | read | read | read | read |  
| /login | yes | redirect | redirect | redirect | redirect |  
| /dashboard | no | yes | yes | yes | yes |  
| /dashboard/entity/\[id\] | no | restricted | owner-only | yes | yes |  
| /dashboard/proofs | no | yes | yes | yes | yes |  
| /dashboard/claim | no | yes | yes | yes | yes |  
| /dashboard/inquiries | no | yes | yes | yes | yes |  
| /dashboard/widgets | no | yes | yes | yes | yes |  
| /dashboard/escrow | no | optional | optional | yes | yes |  
| /admin/\* | no | no | no | yes | yes |

\*\*Rule:\*\*    
Verifier/admin boleh akses dashboard modul tertentu hanya jika explicit role.

\---

\# 4\) PUBLIC PAGES — SPEC DETAIL

\---

\#\# 4.1 \`/\` (Landing)  
\*\*Goal:\*\* Jelaskan value proposition, dorong search & submit listing.

\#\#\# Sections  
1\. Hero  
   \- headline: "Trust Infrastructure for People & Businesses"  
   \- CTA primary: "Search Directory"  
   \- CTA secondary: "Create Profile"  
2\. Trust explainer  
   \- Proof system  
   \- Claim system  
   \- Verified reviews  
3\. Featured categories  
4\. Featured entities (top trust\_score)  
5\. Footer

\#\#\# States  
\- loading featured entities  
\- empty featured entities (fallback to categories)

\---

\#\# 4.2 \`/search\`  
\*\*Goal:\*\* menemukan entity.

\#\#\# Components  
\- search input (semantic search)  
\- filter: entity\_type  
\- filter: verification\_status  
\- sort: trust\_score desc / newest / most reviewed  
\- results list card  
\- pagination / infinite scroll

\#\#\# Result Card (minimum fields)  
\- name  
\- entity\_type badge  
\- verification badge  
\- trust\_score mini  
\- headline/short description  
\- location chips

\#\#\# States  
\- empty results → show "Try different keyword"  
\- error search API → show retry  
\- loading skeleton list

\#\#\# Permission  
\- public read

\---

\#\# 4.3 \`/directory/\[slug\]\` (Public Profile)  
\*\*Goal:\*\* visitor trust \+ contact.

\#\#\# Header Block (above the fold)  
\- Entity name (H1)  
\- verification badge  
\- trust score (big)  
\- location  
\- primary CTA: Send Inquiry  
\- secondary CTA: Copy Profile Link

\#\#\# Sections (order)  
1\) Proof Summary (approved only)  
2\) Services/Categories chips  
3\) About (markdown allowed)  
4\) Portfolio Links  
5\) Reviews  
6\) Inquiry Form  
7\) Trust widget info (optional)  
8\) Disclaimers \+ last updated

\#\#\# Inquiry Form Fields (minimal)  
\- name  
\- email  
\- message  
\- optional: budget, timeline  
\- Turnstile captcha required

\#\#\# Special Buttons  
\- "Claim this entity" muncul jika:  
  \- owner\_id null OR current user not owner  
  \- entity has claimable domain/email

\#\#\# States  
\- entity not found → 404 page  
\- flagged entity → show warning banner \+ disable inquiry  
\- unverified entity → show "Unverified" badge \+ disclaimer

\#\#\# Permission  
\- public read  
\- inquiry submit via API only

\---

\#\# 4.4 \`/directory/\[slug\]/proofs\` (Optional)  
\*\*Goal:\*\* menampilkan daftar proofs lebih detail.

\#\#\# Content  
\- list proofs approved  
\- each proof has:  
  \- type badge  
  \- title  
  \- issuer (if exists)  
  \- verified\_at  
  \- excerpt (optional)  
  \- source\_url/file\_url (if allowed)

\#\#\# Rule  
Jika proofs visibility private/verifier\_only → do not show.

\---

\# 5\) AUTH PAGES

\---

\#\# 5.1 \`/login\`  
\*\*Goal:\*\* login with Supabase Auth.

\#\#\# Methods  
\- email magic link  
\- OAuth (Google recommended)  
\- GitHub optional

\#\#\# States  
\- login loading  
\- invalid link  
\- expired link

\---

\# 6\) DASHBOARD PAGES — SPEC DETAIL

\---

\#\# 6.1 \`/dashboard\` (Overview)  
\*\*Goal:\*\* owner tahu status trust & next action.

\#\#\# Sections  
1\) Trust Score Card  
2\) Verification Progress (milestones)  
3\) Pending Tasks  
   \- pending proofs  
   \- pending claim  
   \- flagged warnings  
4\) Leads Summary  
5\) Widget Summary (if enabled)  
6\) Quick CTA Buttons  
   \- Upload Proof  
   \- Request Claim  
   \- Generate Widget

\#\#\# States  
\- no entities yet → show CTA "Create Entity"

\---

\#\# 6.2 \`/dashboard/entities\`  
\*\*Goal:\*\* manage multiple entities.

\#\#\# Components  
\- entity table/cards list  
\- create entity button  
\- quick edit link

\#\#\# Entity Card Minimum  
\- name  
\- slug  
\- trust\_score  
\- verification\_status badge  
\- leads count  
\- last updated

\#\#\# States  
\- empty → CTA create entity  
\- error fetch → retry

\---

\#\# 6.3 \`/dashboard/entity/\[id\]\` (Entity Editor)  
\*\*Goal:\*\* edit storefront.

\#\#\# Tabs  
1\) Profile  
   \- name  
   \- slug (locked after publish optional)  
   \- headline  
   \- description markdown  
2\) Services  
   \- categories chips  
   \- services list  
3\) Contact & Visibility  
   \- whatsapp  
   \- email  
   \- visibility toggles  
4\) Links  
   \- social links  
   \- portfolio links  
5\) Preview  
   \- preview public page rendering

\#\#\# Required UX  
\- form validation (Zod)  
\- save button disabled if no changes  
\- toast success

\#\#\# Permission  
\- owner-only  
\- admin override allowed

\---

\#\# 6.4 \`/dashboard/proofs\`  
\*\*Feature Flag:\*\* FEATURE\_PROOFS

\*\*Goal:\*\* manage proof uploads.

\#\#\# Sections  
1\) Upload Proof Form  
2\) Proofs Table

\#\#\# Upload Proof Form Fields  
\- proof\_type (select)  
\- title  
\- description  
\- file upload OR source\_url  
\- visibility (public/private/verifier\_only)

\#\#\# Proof Table Fields  
\- title  
\- proof\_type  
\- status badge  
\- verified\_at  
\- action: view / delete (delete only if pending)

\#\#\# States  
\- pending proofs → show "waiting for verification"  
\- rejected → show reason  
\- expired → show expired warning

\#\#\# Permission  
\- owner creates proof  
\- verifier/admin approves

\---

\#\# 6.5 \`/dashboard/claim\`  
\*\*Feature Flag:\*\* FEATURE\_CLAIMS

\*\*Goal:\*\* request ownership claim.

\#\#\# Claim Methods UI  
\- email verification  
\- dns TXT verification  
\- document proof upload

\#\#\# Required Sections  
1\) Claim status timeline (pending/verified/rejected)  
2\) Request form  
3\) Instructions panel (dynamic)

\#\#\# DNS Instructions  
\- show TXT record:  
  \- name: \`\_inframet-claim\`  
  \- value: token  
\- show copy buttons

\#\#\# Permission  
\- requester must be logged in  
\- ownership transfer only via backend verification

\---

\#\# 6.6 \`/dashboard/inquiries\`  
\*\*Goal:\*\* inbox leads.

\#\#\# Table Columns  
\- sender\_name  
\- sender\_email  
\- topic  
\- status badge  
\- created\_at  
\- action: view

\#\#\# View Inquiry Modal  
\- message body  
\- metadata fields (budget/timeline)  
\- action:  
  \- mark read  
  \- archive  
  \- mark spam

\#\#\# States  
\- empty inbox  
\- spam view filter

\#\#\# Permission  
\- only owner of directory can read inquiries

\---

\#\# 6.7 \`/dashboard/widgets\`  
\*\*Feature Flag:\*\* FEATURE\_WIDGETS

\*\*Goal:\*\* generate embed snippet \+ analytics.

\#\#\# Sections  
1\) Widget generator  
   \- widget\_type select  
   \- preview  
   \- domain input  
   \- generate button  
2\) Embed code output  
3\) Installations table  
4\) Stats summary (30d clicks, impressions)

\#\#\# Installations Table  
\- domain  
\- status badge  
\- created\_at  
\- action: block/unblock

\#\#\# Rule  
\- only allow domain install if verified claim OR admin override (optional strict mode)

\---

\#\# 6.8 \`/dashboard/reviews\` (Optional)  
\*\*Goal:\*\* view reviews about entity.

\#\#\# Sections  
\- list reviews  
\- highlight verified buyer  
\- report abuse button

\---

\#\# 6.9 \`/dashboard/escrow\`  
\*\*Feature Flag:\*\* FEATURE\_ESCROW

\*\*Goal:\*\* show escrow ledger.

\#\#\# Sections  
\- escrow transactions list  
\- status badges  
\- release/refund actions (role-based)

\---

\#\# 6.10 \`/dashboard/settings\`  
\*\*Goal:\*\* account-level preferences.

\#\#\# Sections  
\- profile  
\- notifications (optional)  
\- security (logout all sessions optional)

\---

\# 7\) ADMIN / VERIFIER PAGES — SPEC DETAIL

\---

\#\# 7.1 \`/admin/proofs\`  
\*\*Goal:\*\* approve/reject proofs.

\#\#\# Components  
\- pending proofs table  
\- filter by proof\_type  
\- modal preview (file\_url)  
\- approve/reject form (reason required)

\#\#\# Rules  
\- approve triggers RPC add\_reputation\_points  
\- reject must store reason

\---

\#\# 7.2 \`/admin/claims\`  
\*\*Goal:\*\* approve/reject claim requests.

\#\#\# Components  
\- claims table  
\- view method details  
\- verify token (manual override)  
\- approve/reject with reason

\---

\#\# 7.3 \`/admin/moderation\`  
\*\*Goal:\*\* handle flagged entities.

\#\#\# Components  
\- flagged entities list  
\- actions:  
  \- flag entity  
  \- unflag entity  
  \- block widget installation  
  \- block inquiry submission

\---

\#\# 7.4 \`/admin/system-events\`  
\*\*Goal:\*\* audit security events.

\#\#\# Components  
\- logs table  
\- filter severity  
\- view JSON payload modal

\---

\# 8\) USER FLOWS (STEP-BY-STEP)

\---

\#\# 8.1 Flow A — New User Creates Entity  
1\. User registers/login  
2\. Dashboard shows empty state  
3\. User creates entity (name, slug, type)  
4\. User completes profile fields  
5\. Public page becomes accessible

Success condition:  
\- \`/directory/\[slug\]\` publicly reachable

\---

\#\# 8.2 Flow B — Visitor Searches and Sends Inquiry  
1\. Visitor opens \`/search\`  
2\. Finds entity  
3\. Opens profile  
4\. Click "Send Inquiry"  
5\. Submit inquiry with captcha

Success condition:  
\- inquiry appears in owner inbox

\---

\#\# 8.3 Flow C — Owner Upload Proof → Approved  
1\. Owner opens \`/dashboard/proofs\`  
2\. Upload file/url  
3\. Proof status pending  
4\. Verifier approves  
5\. trust\_score increases  
6\. public profile shows proof summary

\---

\#\# 8.4 Flow D — Claim via Email Domain  
1\. Owner goes to claim page  
2\. enters email @domain.com  
3\. receives verification email  
4\. clicks verify link  
5\. claim status becomes verified  
6\. owner\_id updated

\---

\#\# 8.5 Flow E — Claim via DNS TXT  
1\. Owner requests DNS claim  
2\. receives token  
3\. adds TXT record  
4\. worker checks DNS  
5\. claim verified automatically

\---

\#\# 8.6 Flow F — Widget Install Growth Loop  
1\. Owner generates widget snippet  
2\. installs on external website  
3\. widget events tracked  
4\. worker aggregates clicks  
5\. trust\_score rewarded

\---

\# 9\) REQUIRED UI VALIDATION RULES

\#\# 9.1 Slug Validation  
\- lowercase  
\- dash only  
\- unique  
\- max 60 chars

\#\# 9.2 Inquiry Validation  
\- message max 2000 chars  
\- email must be valid  
\- disallow \>3 links

\#\# 9.3 Proof Validation  
\- must have file\_url or source\_url  
\- proof\_type required  
\- max upload size 20MB

\---

\# 10\) ERROR PAGES (STANDARD)

\#\# 10.1 404 Page  
Copy:  
\- "Entity tidak ditemukan."  
CTA:  
\- "Back to Search"

\#\# 10.2 403 Page  
Copy:  
\- "Akses ditolak."  
CTA:  
\- "Login"

\#\# 10.3 500 Page  
Copy:  
\- "Terjadi error pada sistem."  
CTA:  
\- "Retry"

\---

\# 11\) NOTIFICATION UX (MINIMAL)

Owner harus menerima notifikasi minimal via dashboard badge.

Optional:  
\- email notification for inquiry  
\- telegram notification for inquiry

\---

\# 12\) MINIMUM ANALYTICS UX (OPTIONAL)  
Di dashboard widget stats:  
\- clicks 7d/30d  
\- top referrer domain list

\---

\# 13\) FINAL IMPLEMENTATION CHECKLIST (DOC-3)

AI coder wajib memastikan:

\- \[ \] Semua pages sesuai route map  
\- \[ \] Semua forms punya validation \+ captcha (public)  
\- \[ \] Semua pages punya loading/empty/error states  
\- \[ \] Permissions ditegakkan (UI \+ backend)  
\- \[ \] Feature flags hide/disable page properly  
\- \[ \] Public profile page above-the-fold menampilkan trust score \+ badge \+ CTA  
\- \[ \] Admin pages hanya untuk verifier/admin

\---

\# END OF DOC-3

