\# INFRAMEET — PRD \+ ENGINEERING SPEC (v6.2 FINAL, SINGLE SOURCE OF TRUTH)

\*\*Project Name:\*\* INFRAMEET    
\*\*Tagline:\*\* Adaptive Trust Infrastructure & Omni-Storefront Directory    
\*\*Document Version:\*\* v6.2 (Consolidated Final)    
\*\*Status:\*\* FINAL / IMPLEMENTATION-READY    
\*\*Target Runtime:\*\* Vercel Free \+ Supabase Free \+ GitHub Free Tier (Actions)    
\*\*Primary Goal:\*\* Build a scalable trust directory & visibility storefront with autonomous growth loops, proof-based verification, and anti-abuse hardening.

\---

\#\# TABLE OF CONTENTS

1\. Executive Summary    
2\. System Principles (Non-Negotiable)    
3\. Product Scope & Personas    
4\. Feature Modules (System Map)    
5\. Architecture Overview    
6\. Data Model (ERD)    
7\. Database Schema Spec (Tables & Constraints)    
8\. Security Model (RLS & Server Authority Rules)    
9\. Trust Score Engine (Final Rules)    
10\. Verification System (State Machine)    
11\. Proof System (Trust Proof Engine)    
12\. Claim System (Entity Ownership Lock)    
13\. Inquiry & Leads System    
14\. Reviews & Verified Buyer System    
15\. Escrow Ledger & BAST System (Optional MVP)    
16\. Widget Growth Loop (Referral Engine)    
17\. Worker Automation (GitHub Actions Architecture)    
18\. Anti-Abuse Layer (Captcha, Rate Limit, Spam Detection)    
19\. API Routes / RPC Requirements (Minimal Set)    
20\. UX Pages & User Flows (High-Level)    
21\. Sequence Diagrams (Mermaid)    
22\. External Integrations & Resource Map    
23\. Build Roadmap (Execution Order)    
24\. Acceptance Criteria (Definition of Done)    
25\. Risks & Mitigations    
26\. Repo Deliverables Checklist    
27\. AI Coder Implementation Rules (Hard Rules)

\---

\# 1\) EXECUTIVE SUMMARY

INFRAMEET adalah \*\*platform direktori publik \+ trust infrastructure\*\* yang menghubungkan:

\- \*\*User A (Owner/Provider):\*\* profesional, brand, SaaS, institusi  
\- \*\*User B (Visitor/Client):\*\* pencari jasa/produk/partner  
\- \*\*Verifier/Admin:\*\* pengawas bukti & anti-fraud

INFRAMEET bukan marketplace biasa. Fokus utamanya adalah:

\- \*\*Validasi kredibilitas\*\* (Proof System \+ Claim System \+ Verified Reviews)  
\- \*\*Trust Score transparan\*\* (log-based \+ decay)  
\- \*\*Storefront SEO-friendly\*\* (public profile pages)  
\- \*\*Growth loop otomatis\*\* (widget embed \+ referral reward)  
\- \*\*Autonomous pipeline\*\* (GitHub Actions worker sebagai engine gratis)  
\- \*\*Anti-abuse hardened\*\* (captcha \+ rate limiting \+ spam scoring)

\---

\# 2\) SYSTEM PRINCIPLES (NON-NEGOTIABLE)

\#\# 2.1 Domain Separation Rule

\#\#\# A) Client-Heavy Domain (Allowed)  
Boleh diproses di browser (hemat biaya server):  
\- PDF rendering (BAST/CV)  
\- ROI calculators  
\- UI logic / preview / form builder  
\- widget rendering (Shadow DOM)  
\- markdown formatting / display

\#\#\# B) Server-Authoritative Domain (Forbidden on Client)  
WAJIB dilakukan server-side (Supabase RPC / server route):  
\- escrow release/refund/dispute  
\- trust\_score update  
\- proof approval/rejection  
\- claim ownership transfer  
\- widget reward aggregation  
\- verification status escalation  
\- moderation / flagging

\> Semua hal yang menyangkut \*\*uang, badge, trust score, ownership\*\* harus bersifat server-authoritative.

\---

\#\# 2.2 Cost Constraints  
Sistem harus bisa berjalan dengan minimal biaya menggunakan:  
\- \*\*Vercel Free\*\*  
\- \*\*Supabase Free\*\*  
\- \*\*GitHub Actions Free\*\* sebagai worker pipeline  
\- \*\*Cloudflare Turnstile\*\* untuk captcha (gratis)  
\- \*\*Cloudinary / Cloudflare R2\*\* untuk file storage (recommended)

\---

\#\# 2.3 Data Integrity Rules  
\- Semua event reputasi harus masuk ke \`reputation\_logs\`  
\- trust\_score tidak boleh ditulis langsung oleh client  
\- Verified review harus terikat escrow release (jika escrow diaktifkan)  
\- Claim entity harus memiliki audit trail

\---

\# 3\) PRODUCT SCOPE & PERSONAS

\#\# 3.1 Persona A: Owner/Provider  
Tujuan:  
\- punya profile SEO-ready  
\- menaikkan trust score dengan bukti  
\- menangkap leads  
\- memasang badge di website eksternal

\#\# 3.2 Persona B: Visitor/Client  
Tujuan:  
\- mencari entitas terpercaya  
\- melihat bukti dan reputasi  
\- menghubungi via inquiry

\#\# 3.3 Persona C: Verifier/Admin  
Tujuan:  
\- approve/reject proofs  
\- approve/reject claims  
\- menangani spam/fraud  
\- menjaga integritas trust system

\---

\# 4\) FEATURE MODULES (SYSTEM MAP)

\#\# 4.1 Omni Directory (Core)  
\- entity profile listing (personal/brand/saas/institution)  
\- SEO pages  
\- metadata public/private

\#\# 4.2 Trust Score Engine  
\- reputasi log-based  
\- decay system  
\- clamp 0..100

\#\# 4.3 Proof System (Trust Proof Engine)  
\- upload bukti kredibilitas  
\- verifier approval workflow

\#\# 4.4 Claim System (Ownership Lock)  
\- domain/email/dns proof  
\- prevents impersonation  
\- enables UGC directory

\#\# 4.5 Inquiry & Leads System  
\- visitor submit inquiry  
\- anti spam mandatory

\#\# 4.6 Reviews \+ Verified Buyer  
\- rating & comment  
\- verified jika tied to escrow released

\#\# 4.7 Escrow Ledger \+ BAST (Optional MVP)  
\- ledger transaksi B2B  
\- settlement via RPC atomic

\#\# 4.8 Widget Growth Loop (Referral Engine)  
\- trust badge embed  
\- event tracking  
\- reward aggregation job

\#\# 4.9 Worker Automation (GitHub Actions)  
\- RSS ingestion  
\- OpenAlex sync  
\- embedding generation  
\- widget rewards  
\- spam scoring  
\- cleanup jobs  
\- decay jobs

\#\# 4.10 Anti-Abuse Layer  
\- Turnstile captcha  
\- rate limit  
\- disposable email detection  
\- spam scoring heuristics

\---

\# 5\) ARCHITECTURE OVERVIEW

\#\# 5.1 Frontend (Vercel)  
\- Next.js App Router  
\- TailwindCSS  
\- Framer Motion  
\- Zod validation  
\- Zustand caching (optional)

\#\# 5.2 Backend (Supabase)  
\- Postgres DB  
\- RLS policies  
\- RPC functions for critical logic  
\- pgvector for semantic search

\#\# 5.3 Worker Layer (GitHub Actions)  
\- scheduled cron pipeline  
\- processes staging queue  
\- generates embeddings  
\- aggregates widget events  
\- executes decay & cleanup

\#\# 5.4 Storage  
\- Cloudinary / Cloudflare R2 for files (proof docs, images)  
\- Supabase stores only URL references

\---

\# 6\) DATA MODEL (ERD CONSOLIDATED)

\#\# 6.1 Entity Relationship Summary

\#\#\# Identity & Access  
\- \`profiles (1:1) auth.users\`  
\- \`user\_roles (many) \-\> auth.users\`

\#\#\# Directory Core  
\- \`omni\_directory (many) \-\> auth.users(owner)\`

\#\#\# Trust Engine  
\- \`reputation\_logs (many) \-\> omni\_directory\`

\#\#\# Verification  
\- \`entity\_legal\_verifications (many) \-\> omni\_directory\`  
\- \`entity\_academic\_profiles (many) \-\> omni\_directory\`

\#\#\# Proof System  
\- \`trust\_proofs (many) \-\> omni\_directory\`  
\- \`proof\_reviews (many) \-\> trust\_proofs\`

\#\#\# Claim System  
\- \`entity\_claim\_requests (many) \-\> omni\_directory\`

\#\#\# Leads & Reviews  
\- \`entity\_inquiries (many) \-\> omni\_directory\`  
\- \`reviews (many) \-\> omni\_directory\`

\#\#\# Escrow  
\- \`escrow\_ledger (many) \-\> omni\_directory\`

\#\#\# Widget Growth  
\- \`widget\_installations (many) \-\> omni\_directory\`  
\- \`widget\_events (many) \-\> widget\_installations\`

\#\#\# Worker Queue  
\- \`staging\_inbox\`

\#\#\# Anti-Abuse  
\- \`rate\_limit\_events\`  
\- \`disposable\_email\_domains\`  
\- \`system\_events\`

\---

\#\# 6.2 Mermaid ERD  
\`\`\`mermaid  
erDiagram  
  profiles ||--|| auth\_users : "user\_id"  
  user\_roles }o--|| auth\_users : "user\_id"

  omni\_directory }o--|| auth\_users : "owner\_id"

  reputation\_logs }o--|| omni\_directory : "directory\_id"  
  entity\_inquiries }o--|| omni\_directory : "directory\_id"  
  reviews }o--|| omni\_directory : "directory\_id"  
  escrow\_ledger }o--|| omni\_directory : "directory\_id"

  entity\_legal\_verifications }o--|| omni\_directory : "directory\_id"  
  entity\_academic\_profiles }o--|| omni\_directory : "directory\_id"

  trust\_proofs }o--|| omni\_directory : "directory\_id"  
  proof\_reviews }o--|| trust\_proofs : "proof\_id"

  entity\_claim\_requests }o--|| omni\_directory : "directory\_id"

  widget\_installations }o--|| omni\_directory : "directory\_id"  
  widget\_events }o--|| widget\_installations : "installation\_id"

  staging\_inbox }o--|| omni\_directory : "directory\_id (optional)"

---

# **7\) DATABASE SCHEMA SPEC (ENGINEERING CONTRACT)**

NOTE: Ini bukan file SQL migration final, tapi kontrak skema wajib.  
AI Coder harus membuat migration sesuai spesifikasi ini.

## **7.1 Required Enums / Controlled Values**

### **omni\_directory.entity\_type**

* personal  
* brand  
* saas  
* institution

### **omni\_directory.verification\_status**

* unverified  
* basic\_verified  
* legal\_verified  
* academic\_verified  
* premium\_verified  
* flagged

### **trust\_proofs.status**

* pending  
* approved  
* rejected  
* expired

### **entity\_claim\_requests.status**

* pending  
* verified  
* rejected  
* expired

### **escrow\_ledger.status**

* HELD  
* RELEASED  
* REFUNDED  
* DISPUTED  
* CANCELLED

### **widget\_events.event\_type**

* install  
* impression  
* click  
* lead\_submit

---

## **7.2 Mandatory Tables (Core)**

### **profiles**

* user\_id PK (auth.users FK)  
* full\_name, avatar\_url  
* timestamps

### **user\_roles**

* user\_id FK auth.users  
* role: admin/moderator/verifier/user  
* unique(user\_id, role)

### **omni\_directory**

* id UUID PK  
* owner\_id FK auth.users  
* entity\_type, name, slug unique  
* metadata\_public JSONB  
* metadata\_private JSONB  
* verification\_status  
* trust\_score (0..100)  
* is\_escrow\_enabled boolean  
* search\_embedding vector(384)  
* timestamps

### **reputation\_logs**

* directory\_id FK  
* activity\_type string (should be whitelist)  
* points\_awarded int  
* meta jsonb  
* created\_at

### **entity\_inquiries**

* directory\_id FK  
* sender\_email, sender\_name  
* inquiry\_data JSONB  
* status (UNREAD/READ/ARCHIVED/SPAM)  
* spam\_score, is\_blocked  
* created\_at

### **reviews**

* directory\_id FK  
* escrow\_id FK (optional)  
* reviewer\_user\_id FK  
* rating, comment  
* is\_verified\_buyer boolean  
* created\_at

### **escrow\_ledger (optional MVP)**

* directory\_id FK  
* client\_user\_id, provider\_user\_id FK  
* amount\_idr, fee, net\_release  
* status \+ timestamps

### **staging\_inbox**

* source  
* payload JSONB  
* status pending/processing/done/failed  
* retry\_count, error\_log  
* expires\_at

---

## **7.3 Verification Tables**

### **entity\_legal\_verifications**

* directory\_id FK  
* nib, ahu\_number, haki\_brand\_number, halal\_certificate\_number (unique)  
* status pending/verified/rejected/expired  
* raw\_response JSONB

### **entity\_academic\_profiles**

* directory\_id FK  
* orcid unique  
* openalex\_author\_id unique  
* citation\_count, h\_index  
* raw\_response JSONB

---

## **7.4 Proof System Tables**

### **trust\_proofs**

* directory\_id FK  
* proof\_type enum-like string  
* title, description  
* source\_url, file\_url, file\_hash unique  
* extracted\_text  
* visibility public/private/verifier\_only  
* status pending/approved/rejected/expired  
* verifier\_user\_id FK  
* verified\_at

### **proof\_reviews**

* proof\_id FK trust\_proofs  
* action approve/reject/flag  
* reason  
* reviewer\_user\_id FK

---

## **7.5 Claim System Tables**

### **entity\_claim\_requests**

* directory\_id FK  
* requester\_user\_id FK  
* method email\_domain/dns\_txt/document\_proof/admin\_override  
* requested\_domain, email\_to\_verify  
* verification\_token \+ expires  
* proof\_file\_url  
* verifier\_user\_id \+ verified\_at

---

## **7.6 Widget Growth Tables**

### **widget\_installations**

* directory\_id FK  
* widget\_type  
* domain  
* secret\_token  
* status active/blocked/inactive  
* unique(directory\_id, widget\_type, domain)

### **widget\_events**

* installation\_id FK  
* event\_type install/impression/click/lead\_submit  
* ip\_hash, user\_agent\_hash  
* referrer\_url  
* created\_at

---

## **7.7 Anti Abuse Tables**

### **rate\_limit\_events**

* event\_key (action:iphash)  
* ip\_hash  
* user\_id FK  
* action string  
* created\_at

### **disposable\_email\_domains**

* domain PK

### **system\_events**

* event\_type  
* severity info/warn/error  
* payload JSONB

---

# **8\) SECURITY MODEL (RLS \+ SERVER AUTHORITY)**

## **8.1 Mandatory Security Rules**

### **Forbidden from Client**

* update trust\_score  
* update escrow status  
* set is\_verified\_buyer \= true  
* insert reputation\_logs directly  
* approve proofs directly  
* verify claims directly

### **Allowed from Client**

* submit inquiry (captcha \+ rate limit)  
* create directory (authenticated)  
* update directory owned  
* upload proof metadata (file upload via external storage)  
* create claim request

---

## **8.2 RLS Principles**

### **Public Read**

* omni\_directory: readable by all  
* reviews: readable by all  
* approved public proofs: readable by all

### **Owner-Only Read/Write**

* inquiries: only owner can read  
* directory updates: only owner

### **Escrow Confidential**

* escrow readable hanya oleh client/provider/admin

### **Reputation Logs**

* public read allowed (transparency)  
* insert only via RPC (SECURITY DEFINER)

---

## **8.3 RPC Mandatory Functions (High Level)**

AI Coder harus membuat RPC untuk:

* `add_reputation_points()`  
* `approve_proof()`  
* `release_escrow()` (optional)  
* `refund_escrow()` (optional)  
* `flag_entity()` (moderation)  
* `verify_claim()` (ownership transfer)

---

# **9\) TRUST SCORE ENGINE (FINAL RULESET)**

## **9.1 Score Formula**

Trust Score final \= clamp(0..100):

**Sources:**

* Proof approvals  
* Claim verified  
* Legal/academic verification  
* Escrow released (optional)  
* Verified review  
* Widget referral threshold  
* Activity streak

**Decay:**

* \-5 setiap 60 hari tanpa update

---

## **9.2 Recommended Point Weights**

### **Proof Approval**

* legal\_document: \+25  
* contract\_invoice: \+20  
* certificate: \+15  
* publication: \+15  
* portfolio: \+10  
* testimonial: \+10  
* identity: \+0 (private anti-fraud)

### **Claim**

* claim\_verified: \+20

### **Widget Growth**

* verified install: \+3  
* 100 unique clicks/30d: \+5  
* qualified lead\_submit threshold: \+10 (optional)

### **Escrow (optional)**

* escrow\_released: \+10  
* verified review: \+5

---

## **9.3 Anti Manipulation Rules**

* widget reward dihitung oleh worker cron (bukan real-time)  
* click harus unik per 24 jam per ip\_hash  
* trust score update hanya via RPC

---

# **10\) VERIFICATION SYSTEM (STATE MACHINE)**

## **10.1 verification\_status States**

* unverified  
* basic\_verified  
* legal\_verified  
* academic\_verified  
* premium\_verified  
* flagged

---

## **10.2 Transition Rules**

### **unverified → basic\_verified**

Jika:

* claim verified, atau  
* OAuth verified minimal

### **basic\_verified → legal\_verified**

Jika:

* legal API verified, atau  
* proof legal\_document approved

### **basic\_verified → academic\_verified**

Jika:

* ORCID/OpenAlex verified

### **legal\_verified/academic\_verified → premium\_verified**

Jika memenuhi kombinasi:

* proofs approved \>= threshold  
* widget installs verified \>= threshold  
* escrow released \>= threshold (jika escrow enabled)

### **any → flagged**

Jika:

* spam/fraud detection  
* duplicate NIB claim  
* manual moderation

flagged \= locked state until admin override.

---

# **11\) PROOF SYSTEM (TRUST PROOF ENGINE)**

## **11.1 Objective**

Menggantikan ketergantungan API legal pemerintah dengan sistem bukti yang lebih realistis.

## **11.2 Proof Lifecycle**

* owner upload proof → status `pending`  
* verifier review → approve/reject  
* approved → tampil publik (jika visibility public)  
* approved → menambah trust score  
* expired → menurunkan trust score

## **11.3 Proof UI Requirements**

Owner dashboard harus punya:

* upload proof (file \+ url)  
* list proof status (pending/approved/rejected)  
* notes dari verifier

Verifier dashboard harus punya:

* pending queue  
* approve/reject \+ reason  
* audit trail (proof\_reviews)

---

# **12\) CLAIM SYSTEM (ENTITY OWNERSHIP LOCK)**

## **12.1 Objective**

Mencegah impersonation dan memungkinkan UGC listing.

## **12.2 Claim Methods**

* email\_domain verification (fast)  
* DNS TXT verification (strong)  
* document proof (manual)  
* admin override

## **12.3 Claim Lifecycle**

* request pending  
* verify token/dns  
* verified → ownership transfer

## **12.4 Ownership Transfer Rule**

Jika claim verified:

* set `omni_directory.owner_id = requester_user_id`  
* add reputation points `claim_verified`

---

# **13\) INQUIRY & LEADS SYSTEM**

## **13.1 Visitor Submission**

Visitor bisa submit inquiry via public form.

**Mandatory requirements:**

* Turnstile captcha  
* rate limit  
* spam scoring

## **13.2 Inquiry States**

* UNREAD  
* READ  
* ARCHIVED  
* SPAM

## **13.3 Owner Inbox**

Owner dashboard harus bisa:

* melihat inquiry list  
* mark as read/archive  
* export JSON/CSV (optional)

---

# **14\) REVIEWS & VERIFIED BUYER SYSTEM**

## **14.1 Review Types**

* unverified review (public)  
* verified review (trusted)

## **14.2 Verified Buyer Rule**

Review verified jika:

* escrow\_id exists  
* escrow.status \== RELEASED

## **14.3 Anti Abuse**

* limit review per user per entity  
* rate limit creation  
* block if flagged entity

---

# **15\) ESCROW LEDGER & BAST (OPTIONAL MVP)**

## **15.1 MVP Approach**

Escrow dapat dimulai sebagai ledger internal tanpa payment gateway.

## **15.2 Escrow State Machine**

* HELD → RELEASED  
* HELD → REFUNDED  
* HELD → DISPUTED  
* DISPUTED → RELEASED / REFUNDED  
* CANCELLED only for failed payment init

## **15.3 Settlement Rule**

Settlement harus atomic via RPC:

* lock row FOR UPDATE  
* update status  
* add reputation points

---

# **16\) WIDGET GROWTH LOOP (REFERRAL ENGINE)**

## **16.1 Widget Types**

* trust\_badge  
* review\_badge  
* citation\_badge  
* audit\_badge  
* directory\_card

## **16.2 Widget Embed Requirements**

* output JS snippet  
* Shadow DOM rendering  
* cacheable endpoint  
* versioned script

## **16.3 Tracking Events**

* install  
* impression  
* click  
* lead\_submit (optional)

## **16.4 Reward Logic**

Reward dihitung periodic oleh worker:

* valid domain installs  
* unique click threshold  
* anti-bot heuristics

---

# **17\) WORKER AUTOMATION (GITHUB ACTIONS ARCHITECTURE)**

## **17.1 Worker Jobs**

* cleanup staging inbox expired  
* trust score decay job  
* RSS ingestion job  
* OpenAlex sync job  
* embedding generation job  
* widget reward aggregation job  
* disposable email list update job  
* DNS TXT claim verification job

## **17.2 Worker Input/Output**

Worker membaca dari:

* staging\_inbox  
* entity\_claim\_requests pending dns

Worker menulis ke:

* omni\_directory updates (trust\_score)  
* system\_events logs  
* reputation\_logs via RPC

## **17.3 Schedule**

Recommended cron:

* every 6 hours (main job)  
* daily (heavy aggregation/cleanup)

---

# **18\) ANTI-ABUSE LAYER (MANDATORY)**

## **18.1 Captcha**

Cloudflare Turnstile required for:

* inquiry submit  
* claim request  
* signup suspicious patterns (optional)

## **18.2 Rate Limiting**

Recommended:

* Upstash Redis (fast)

Fallback:

* Supabase `rate_limit_events`

## **18.3 Spam Scoring**

Heuristic spam scoring for inquiries:

* too many links  
* banned keywords  
* disposable email domain  
* repeated submission burst

If spam\_score \> threshold:

* mark inquiry as SPAM  
* optionally flag entity

## **18.4 Disposable Email Domains**

Worker periodically updates domain list into `disposable_email_domains`.

---

# **19\) API ROUTES & RPC REQUIREMENTS (MINIMAL)**

## **19.1 Public API Routes (Next.js)**

* `POST /api/inquiry/submit`  
* `POST /api/claim/request`  
* `GET /api/claim/verify?token=...`  
* `POST /api/widget/event`  
* `GET /embed/widget/[slug].js`

## **19.2 RPC Functions (Supabase)**

* add\_reputation\_points(directory\_id, activity\_type, points, meta)  
* approve\_proof(proof\_id)  
* verify\_claim(claim\_id)  
* release\_escrow(escrow\_id) (optional)  
* refund\_escrow(escrow\_id) (optional)  
* flag\_entity(directory\_id, reason)

---

# **20\) UX PAGES & USER FLOWS (HIGH LEVEL)**

## **20.1 Public Pages**

### **/directory/\[slug\]**

* entity identity header  
* trust badge \+ verification status  
* proof summary (approved only)  
* reviews  
* inquiry form  
* widget embed snippet  
* claim entity button

### **/search**

* semantic search input  
* filters entity\_type  
* sorting trust\_score  
* results cards

---

## **20.2 Dashboard Pages**

### **/dashboard**

* overview trust\_score  
* leads count  
* widget clicks summary

### **/dashboard/entity/\[id\]**

* edit profile  
* SEO preview

### **/dashboard/proofs**

* upload proof  
* status list

### **/dashboard/claim**

* claim request  
* dns/email instructions

### **/dashboard/widgets**

* widget snippet generator  
* installations list  
* click stats

### **/dashboard/inquiries**

* inbox

### **/admin/verifier**

* pending proofs  
* pending claims  
* flagged inquiries/entities

---

# **21\) SEQUENCE DIAGRAMS (MERMAID)**

## **21.1 Inquiry Submission Flow**

sequenceDiagram  
  participant V as Visitor  
  participant FE as Frontend  
  participant CF as Turnstile  
  participant API as /api/inquiry/submit  
  participant DB as Supabase

  V-\>\>FE: Fill inquiry form  
  FE-\>\>CF: Verify captcha token  
  CF--\>\>FE: ok  
  FE-\>\>API: submit inquiry  
  API-\>\>DB: rate limit \+ insert inquiry  
  DB--\>\>API: ok  
  API--\>\>FE: ok  
  FE--\>\>V: success message

## **21.2 Proof Upload & Approval**

sequenceDiagram  
  participant O as Owner  
  participant FE as Dashboard  
  participant ST as Storage  
  participant DB as Supabase  
  participant VR as Verifier

  O-\>\>FE: Upload proof file  
  FE-\>\>ST: Upload direct  
  ST--\>\>FE: file\_url  
  FE-\>\>DB: Insert trust\_proofs pending  
  DB--\>\>FE: ok

  VR-\>\>DB: View pending proofs  
  VR-\>\>DB: approve\_proof RPC  
  DB--\>\>VR: ok  
  DB--\>\>FE: trust\_score updated

## **21.3 Claim Email Verification**

sequenceDiagram  
  participant U as User  
  participant API as /api/claim/request  
  participant DB as Supabase  
  participant Mail as Email Provider

  U-\>\>API: Request claim (email\_domain)  
  API-\>\>DB: Insert claim pending \+ token  
  API-\>\>Mail: Send verification link  
  Mail--\>\>U: Email received

  U-\>\>API: Click verify link  
  API-\>\>DB: Validate token  
  API-\>\>DB: Transfer owner\_id  
  DB--\>\>API: ok

## **21.4 Claim DNS Verification (Worker)**

sequenceDiagram  
  participant U as User  
  participant DB as Supabase  
  participant GH as GitHub Worker  
  participant DNS as DNS Resolver

  U-\>\>DB: Insert claim pending dns\_txt  
  GH-\>\>DB: Fetch pending claims  
  GH-\>\>DNS: Query TXT  
  DNS--\>\>GH: TXT result  
  GH-\>\>DB: Verify claim \+ transfer owner\_id

## **21.5 Widget Reward Aggregation**

sequenceDiagram  
  participant W as Widget Script  
  participant API as /api/widget/event  
  participant DB as Supabase  
  participant GH as Worker

  W-\>\>API: Send click/impression  
  API-\>\>DB: Insert widget\_events

  GH-\>\>DB: Aggregate daily stats  
  GH-\>\>DB: Add reputation points via RPC

## **21.6 Escrow Release (Optional)**

sequenceDiagram  
  participant C as Client  
  participant FE as UI  
  participant DB as Supabase RPC

  C-\>\>FE: Sign BAST  
  FE-\>\>DB: call release\_escrow  
  DB--\>\>FE: ok

---

# **22\) EXTERNAL INTEGRATIONS & RESOURCE MAP**

## **22.1 Recommended APIs (Academic)**

* OpenAlex API (author, works, citations)  
* Crossref API (DOI metadata)  
* Semantic Scholar API (optional)  
* OpenCitations (optional)

## **22.2 Recommended Auth / Identity**

* ORCID OAuth  
* Google OAuth  
* GitHub OAuth (optional)

## **22.3 Storage**

* Cloudinary  
* Cloudflare R2

## **22.4 Anti Abuse**

* Cloudflare Turnstile  
* Upstash Redis (rate limiting)

## **22.5 Worker**

* GitHub Actions scheduled cron

## **22.6 Content Sources**

* RSS feeds (news, journals, press releases)

---

# **23\) BUILD ROADMAP (EXECUTION ORDER)**

## **Phase 1 — Directory Foundation**

* omni\_directory CRUD  
* public profile page  
* search page (basic)

## **Phase 2 — Inquiry \+ Anti Abuse**

* inquiry submit API  
* captcha \+ rate limit  
* dashboard inbox

## **Phase 3 — Proof System**

* trust\_proofs CRUD  
* verifier approval dashboard  
* trust score update via RPC

## **Phase 4 — Claim System**

* claim request  
* email verification  
* dns verification (worker)

## **Phase 5 — Widget Growth Loop**

* widget installation creation  
* embed script endpoint  
* widget events endpoint

## **Phase 6 — GitHub Actions Worker**

* reward aggregation  
* trust decay job  
* cleanup jobs  
* disposable email update

## **Phase 7 — Escrow (Optional)**

* escrow ledger UI  
* release RPC \+ verified reviews

---

# **24\) ACCEPTANCE CRITERIA (DEFINITION OF DONE)**

MVP INFRAMEET dianggap berhasil jika:

* user bisa membuat profile entity  
* profile bisa ditemukan via search  
* visitor bisa submit inquiry tanpa spam menghancurkan sistem  
* owner bisa upload proof  
* verifier bisa approve proof  
* claim system bisa memindahkan ownership dengan aman  
* widget bisa di-embed dan event tercatat  
* worker cron bisa berjalan (decay \+ cleanup \+ reward)  
* trust\_score tidak bisa dimanipulasi client

---

# **25\) RISKS & MITIGATIONS**

## **25.1 Government APIs Unstable**

Mitigasi: Proof System \+ manual verifier approval.

## **25.2 Spam Attack**

Mitigasi: Turnstile \+ rate limiting \+ spam scoring \+ disposable email list.

## **25.3 Widget Click Bot**

Mitigasi: reward threshold \+ uniqueness check \+ worker aggregation.

## **25.4 GitHub Actions Limitations**

Mitigasi: job batched, schedule per 6 jam, avoid heavy compute.

---

# **26\) REPO DELIVERABLES CHECKLIST**

AI coder harus menghasilkan:

* `/docs/INFRAMEET_PRD_v6.2_FINAL.md` (this file)  
* `/supabase/migrations/*` (schema \+ rls \+ rpc \+ triggers)  
* `/apps/web` (Next.js)  
* `/worker` (GitHub Actions scripts)  
* `/docs/SECURITY.md` (RLS \+ abuse rules)  
* `/docs/WIDGET_SPEC.md`  
* `/docs/WORKER_SPEC.md`

---

# **27\) AI CODER IMPLEMENTATION RULES (HARD RULES)**

1. Jangan pernah update `trust_score` dari client.  
2. Jangan pernah update `escrow_ledger.status` dari client.  
3. Jangan pernah allow insert `reputation_logs` tanpa RPC.  
4. Proof approval hanya via verifier/admin role.  
5. Claim verification harus audit trail.  
6. Semua public forms wajib Turnstile \+ rate limit.  
7. Widget reward hanya dihitung oleh worker cron.  
8. Semua file proof harus disimpan external storage (Cloudinary/R2).  
9. Semua embedding generation harus dilakukan oleh worker (bukan serverless Vercel).  
10. Semua endpoint publik wajib sanitize payload (Zod) \+ log ke system\_events jika suspicious.

---

# **END OF DOCUMENT**

