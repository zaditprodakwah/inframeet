\# INFRAMEET — SUPABASE RLS POLICIES \+ RPC \+ TRIGGERS SPEC (DOC-9)  
\*\*Version:\*\* v1.0    
\*\*Status:\*\* Engineering Ready (Security Backbone)    
\*\*Scope:\*\* Supabase schema governance, RLS rules, policies per table, RPC contracts, triggers, audit logs, worker access model    
\*\*Audience:\*\* AI Coder / Backend Engineer / Supabase Operator    
\*\*Goal:\*\* Menutup semua celah akses data, memastikan semua operasi penting lewat jalur aman (RLS \+ RPC \+ triggers).

\---

\# 1\) SECURITY MODEL OVERVIEW

\#\# 1.1 Auth Model  
Supabase Auth menghasilkan:  
\- \`auth.uid()\` → user\_id

Profiles table menyimpan:  
\- \`profiles.id \= auth.uid()\`  
\- \`profiles.role\` enum: \`user | verifier | admin\`

\---

\#\# 1.2 Core Access Rules (Non-Negotiable)  
1\. \*\*Public hanya boleh READ data publik.\*\*  
2\. \*\*Owner hanya boleh CRUD entity miliknya.\*\*  
3\. \*\*Verifier hanya boleh approve/reject, tidak boleh mengambil ownership.\*\*  
4\. \*\*Admin bisa override semua.\*\*  
5\. \*\*Semua data sensitif harus RLS-protected.\*\*  
6\. \*\*Semua tindakan moderation harus audit-logged.\*\*

\---

\#\# 1.3 Service Role Usage  
Service role hanya dipakai oleh:  
\- worker cron jobs  
\- admin endpoints  
\- verification automation

Public endpoints tidak boleh menggunakan service role kecuali read-only view yang aman.

\---

\# 2\) REQUIRED TABLES (SECURITY CRITICAL)

RLS wajib aktif pada tabel:  
\- profiles  
\- omni\_directory  
\- trust\_proofs  
\- proof\_reviews  
\- entity\_claim\_requests  
\- entity\_inquiries  
\- widget\_installations  
\- widget\_events  
\- widget\_event\_daily\_stats  
\- reputation\_logs  
\- system\_events  
\- seo\_page\_cache  
\- entity\_updates  
\- rate\_limit\_events  
\- staging\_inbox

\---

\# 3\) PROFILES TABLE (AUTH BACKBONE)

\#\# 3.1 Table  
\`profiles\`  
\- id (uuid, pk, \= auth.uid())  
\- email  
\- role (user/verifier/admin)  
\- created\_at

\#\# 3.2 RLS  
Enable RLS.

\#\#\# Policies  
\- SELECT: user can read own profile  
\- UPDATE: user can update own profile (except role)  
\- INSERT: only via trigger on auth signup (recommended)  
\- role field update: admin only

\---

\# 4\) OMNI\_DIRECTORY TABLE (ENTITY OWNERSHIP)

\#\# 4.1 Table  
\`omni\_directory\`  
\- id (uuid pk)  
\- owner\_id uuid nullable  
\- slug unique  
\- name  
\- entity\_type  
\- headline  
\- description  
\- verification\_status  
\- trust\_score\_cached  
\- metadata\_public jsonb  
\- metadata\_private jsonb  
\- is\_deleted boolean default false  
\- is\_indexable boolean default true  
\- created\_at  
\- updated\_at

\---

\#\# 4.2 RLS  
Enable RLS.

\#\#\# SELECT Policy (Public Read)  
Public boleh SELECT jika:  
\- is\_deleted \= false  
\- verification\_status \!= flagged  
\- is\_indexable \= true

\> Jika flagged, public tidak boleh lihat (atau boleh lihat tapi limited). Default: block.

\#\#\# SELECT Policy (Owner Read)  
Owner boleh SELECT jika:  
\- owner\_id \= auth.uid()

\#\#\# SELECT Policy (Verifier/Admin Read)  
Verifier/admin boleh SELECT semua.

\---

\#\#\# INSERT Policy  
Authenticated user boleh INSERT entity baru jika:  
\- auth.uid() \!= null

Rule:  
\- owner\_id default auth.uid() (recommended auto assign on insert)

\---

\#\#\# UPDATE Policy (Owner)  
Owner boleh UPDATE jika:  
\- owner\_id \= auth.uid()  
\- is\_deleted \= false

Owner tidak boleh update field:  
\- trust\_score\_cached  
\- verification\_status  
\- is\_indexable (optional)  
\- owner\_id (ownership transfer forbidden)

Ini bisa enforced via trigger.

\---

\#\#\# UPDATE Policy (Verifier/Admin)  
Verifier/admin boleh update:  
\- verification\_status  
\- is\_indexable  
\- flagged state

Admin boleh update owner\_id (manual override).

\---

\#\#\# DELETE Policy  
Hard delete tidak disarankan.  
Jika dipakai:  
\- admin only

\---

\# 5\) TRUST\_PROOFS TABLE (UPLOAD \+ VERIFICATION PIPELINE)

\#\# 5.1 Table  
\`trust\_proofs\`  
\- id uuid pk  
\- directory\_id uuid fk  
\- created\_by uuid fk profiles  
\- proof\_type  
\- title  
\- description  
\- file\_url  
\- source\_url  
\- file\_hash  
\- file\_size  
\- mime\_type  
\- visibility enum (public/private/verifier\_only)  
\- status enum (pending/approved/rejected/expired/deleted)  
\- verified\_by uuid nullable  
\- verified\_at timestamp nullable  
\- reject\_reason text nullable  
\- meta jsonb  
\- created\_at

\---

\#\# 5.2 RLS Policies  
Enable RLS.

\#\#\# SELECT (Owner)  
Owner boleh SELECT jika:  
\- directory.owner\_id \= auth.uid()

\#\#\# SELECT (Public)  
Public boleh SELECT hanya jika:  
\- status \= approved  
\- visibility \= public  
\- directory is\_indexable true  
\- directory not deleted

\#\#\# SELECT (Verifier/Admin)  
Verifier/admin boleh SELECT semua.

\---

\#\#\# INSERT (Owner)  
Owner boleh INSERT proof jika:  
\- directory.owner\_id \= auth.uid()

\---

\#\#\# UPDATE (Owner)  
Owner boleh UPDATE hanya jika:  
\- status \= pending  
\- directory.owner\_id \= auth.uid()

Owner tidak boleh update:  
\- status (except delete request)  
\- verified\_by  
\- verified\_at

\---

\#\#\# UPDATE (Verifier/Admin)  
Verifier/admin boleh update:  
\- status  
\- verified\_by  
\- verified\_at  
\- reject\_reason  
\- meta

\---

\#\#\# DELETE  
Soft delete recommended.  
Jika hard delete:  
\- admin only

\---

\# 6\) PROOF\_REVIEWS TABLE (AUDIT TRAIL)

\#\# 6.1 Table  
\`proof\_reviews\`  
\- id uuid pk  
\- proof\_id fk trust\_proofs  
\- reviewer\_id uuid fk profiles  
\- action enum (approve/reject)  
\- notes text  
\- created\_at

\#\# 6.2 RLS  
\- INSERT: verifier/admin only  
\- SELECT: admin only (or owner read allowed)  
\- UPDATE/DELETE: admin only

\---

\# 7\) ENTITY\_CLAIM\_REQUESTS TABLE (OWNERSHIP VERIFICATION)

\#\# 7.1 Table  
\`entity\_claim\_requests\`  
\- id uuid pk  
\- directory\_id fk omni\_directory  
\- requester\_user\_id uuid fk profiles  
\- method enum (dns\_txt/email/document)  
\- claim\_target text  
\- token text (hashed recommended)  
\- status enum (pending/verified/rejected/expired)  
\- expires\_at timestamp  
\- verified\_at timestamp  
\- verified\_by uuid nullable  
\- reject\_reason text nullable  
\- created\_at

\---

\#\# 7.2 RLS  
Enable RLS.

\#\#\# SELECT  
\- requester can read own claims  
\- verifier/admin can read all claims  
\- owner can read claims related to directory if owner\_id matches (optional)

\#\#\# INSERT  
\- authenticated user can insert claim request  
\- enforce rate limit in API layer

\#\#\# UPDATE  
\- only verifier/admin can set status verified/rejected  
\- requester cannot self-verify

\#\#\# DELETE  
\- admin only (optional)  
\- worker may expire claims using service role

\---

\# 8\) ENTITY\_INQUIRIES TABLE (LEADS)

\#\# 8.1 Table  
\`entity\_inquiries\`  
\- id uuid pk  
\- directory\_id fk omni\_directory  
\- sender\_name  
\- sender\_email  
\- message  
\- inquiry\_data jsonb (topic/budget/timeline/utm)  
\- status enum (new/read/archived/spam)  
\- ip\_hash  
\- created\_at

\---

\#\# 8.2 RLS  
Enable RLS.

\#\#\# INSERT (Public)  
Public boleh insert jika:  
\- directory exists AND is\_deleted=false AND not flagged

\*\*Important:\*\*  
Public cannot SELECT inquiries.

\#\#\# SELECT (Owner)  
Owner boleh SELECT jika:  
\- directory.owner\_id \= auth.uid()

\#\#\# UPDATE (Owner)  
Owner boleh update status jika:  
\- directory.owner\_id \= auth.uid()

\#\#\# SELECT/UPDATE (Admin)  
Admin can read all.

\---

\# 9\) WIDGET\_INSTALLATIONS TABLE

\#\# 9.1 Table  
\`widget\_installations\`  
\- id uuid pk  
\- directory\_id fk  
\- created\_by uuid  
\- widget\_type  
\- domain  
\- token (hashed recommended)  
\- status enum (active/blocked/revoked)  
\- created\_at

\---

\#\# 9.2 RLS  
Enable RLS.

\#\#\# SELECT  
\- owner can read installations for own directory  
\- public cannot read token  
\- admin/verifier can read all

\#\#\# INSERT  
\- owner can insert for own directory  
\- optional rule: must have verified claim domain

\#\#\# UPDATE  
\- owner can revoke/block their installation  
\- admin can block any installation

\---

\# 10\) WIDGET\_EVENTS TABLE (HIGH VOLUME)

\#\# 10.1 Table  
\`widget\_events\`  
\- id uuid pk  
\- installation\_id fk widget\_installations  
\- event\_type enum (impression/click)  
\- page\_url  
\- referrer  
\- ip\_hash  
\- ua\_hash  
\- meta jsonb  
\- created\_at

\---

\#\# 10.2 RLS  
Enable RLS.

\#\#\# INSERT (Public)  
Public boleh INSERT jika:  
\- installation status active  
\- request passes rate limit (API layer)  
\- dedupe optional

\#\#\# SELECT  
No public SELECT.  
Owner SELECT allowed via join on installation directory.

\#\#\# DELETE  
Worker/admin only.

\---

\# 11\) WIDGET\_EVENT\_DAILY\_STATS TABLE (AGGREGATION)

\#\# 11.1 Table  
\`widget\_event\_daily\_stats\`  
\- id uuid pk  
\- installation\_id fk  
\- date  
\- impressions\_count  
\- clicks\_count  
\- unique\_clicks\_count  
\- updated\_at

\#\# 11.2 RLS  
\- SELECT: owner can read  
\- INSERT/UPDATE: worker/admin only

\---

\# 12\) REPUTATION\_LOGS TABLE (TRUST LEDGER)

\#\# 12.1 Table  
\`reputation\_logs\`  
\- id uuid pk  
\- directory\_id fk  
\- event\_type enum  
\- points\_delta int  
\- meta jsonb  
\- created\_at

\#\# 12.2 RLS  
Enable RLS.

\#\#\# SELECT  
\- public can read aggregated summary only (via view)  
\- owner can read full logs for own entity  
\- verifier/admin can read all

\#\#\# INSERT  
\- only RPC / admin / worker can insert  
Owner cannot insert directly.

\---

\# 13\) SYSTEM\_EVENTS TABLE (SECURITY LOGS)

\#\# 13.1 Table  
\`system\_events\`  
\- id uuid pk  
\- severity enum (info/warn/error)  
\- event\_type text  
\- actor\_user\_id uuid nullable  
\- ip\_hash nullable  
\- meta jsonb  
\- created\_at

\#\# 13.2 RLS  
Enable RLS.

\#\#\# SELECT  
\- admin only  
\- verifier optional read allowed

\#\#\# INSERT  
\- server routes / worker only (service role)  
Public cannot insert directly unless via API route.

\---

\# 14\) SEO\_PAGE\_CACHE TABLE

\#\# 14.1 Table  
\`seo\_page\_cache\`  
\- id uuid pk  
\- page\_type  
\- page\_key  
\- json\_payload jsonb  
\- updated\_at  
\- expires\_at

\#\# 14.2 RLS  
\- SELECT: public read allowed (safe payload only)  
\- INSERT/UPDATE: worker/admin only

\---

\# 15\) ENTITY\_UPDATES TABLE (DISCOVER ENGINE)

\#\# 15.1 Table  
\`entity\_updates\`  
\- id uuid pk  
\- directory\_id fk  
\- update\_type  
\- title  
\- summary  
\- payload jsonb  
\- is\_public boolean  
\- is\_indexable boolean  
\- created\_at

\#\# 15.2 RLS  
\- SELECT: public allowed if is\_public=true and is\_indexable=true  
\- INSERT: worker/admin only  
\- UPDATE: worker/admin only  
\- DELETE: admin only

\---

\# 16\) RATE\_LIMIT\_EVENTS TABLE (FALLBACK)

\#\# 16.1 Table  
\`rate\_limit\_events\`  
\- id uuid pk  
\- key text  
\- action text  
\- created\_at

\#\# 16.2 RLS  
\- INSERT: server route only (service role)  
\- SELECT: admin only  
\- DELETE: worker/admin only

\---

\# 17\) STAGING\_INBOX TABLE (WORKER QUEUE)

\#\# 17.1 Table  
\`staging\_inbox\`  
\- id uuid pk  
\- job\_type  
\- payload jsonb  
\- status enum (pending/done/failed)  
\- attempts int  
\- next\_run\_at timestamp  
\- created\_at  
\- updated\_at

\#\# 17.2 RLS  
\- SELECT/INSERT/UPDATE/DELETE: worker/admin only

\---

\# 18\) RPC FUNCTIONS (MANDATORY)

\> Semua RPC harus SECURITY DEFINER (careful) dan hanya callable oleh role tertentu.

\---

\#\# 18.1 RPC: recalculate\_trust\_score(directory\_id)  
\#\#\# Purpose  
Recompute trust score based on proofs/claims/reviews/widget stats.

\#\#\# Inputs  
\- directory\_id uuid

\#\#\# Output  
\- new\_score int  
\- updated\_at timestamp

\#\#\# Permissions  
\- callable by admin/verifier/worker only

\---

\#\# 18.2 RPC: add\_reputation\_event(directory\_id, event\_type, points\_delta, meta)  
\#\#\# Purpose  
Insert immutable reputation log entry.

\#\#\# Inputs  
\- directory\_id uuid  
\- event\_type text  
\- points\_delta int  
\- meta jsonb

\#\#\# Permissions  
\- worker/admin/verifier only

\---

\#\# 18.3 RPC: approve\_proof(proof\_id, reviewer\_id, meta, notes)  
\#\#\# Purpose  
Atomic approval \+ audit \+ trust update.

\#\#\# Steps  
1\. set proof status approved  
2\. set verified\_by \+ verified\_at  
3\. insert proof\_reviews  
4\. add reputation\_logs event  
5\. recalculate trust\_score

\#\#\# Permissions  
\- verifier/admin only

\---

\#\# 18.4 RPC: reject\_proof(proof\_id, reviewer\_id, reason)  
\#\#\# Purpose  
Atomic rejection \+ audit.

\#\#\# Steps  
1\. set status rejected  
2\. set reject\_reason  
3\. insert proof\_reviews  
4\. (optional) add negative reputation event

\#\#\# Permissions  
\- verifier/admin only

\---

\#\# 18.5 RPC: approve\_claim(claim\_id, reviewer\_id)  
\#\#\# Purpose  
Assign ownership securely.

\#\#\# Steps  
1\. update claim status verified  
2\. set verified\_by, verified\_at  
3\. set omni\_directory.owner\_id \= requester\_user\_id (if empty OR admin override)  
4\. add reputation event (claim verified)  
5\. recalculate trust score

\#\#\# Permissions  
\- verifier/admin only

\---

\#\# 18.6 RPC: expire\_claims()  
\#\#\# Purpose  
Expire pending claims older than expires\_at.

\#\#\# Permissions  
\- worker/admin only

\---

\#\# 18.7 RPC: expire\_proofs()  
\#\#\# Purpose  
Expire pending proofs older than threshold.

\#\#\# Permissions  
\- worker/admin only

\---

\# 19\) TRIGGERS (MANDATORY)

\---

\#\# 19.1 Trigger: auto\_create\_profile\_on\_signup  
On \`auth.users\` insert:  
\- create profiles row

\---

\#\# 19.2 Trigger: update\_omni\_directory\_updated\_at  
On update:  
\- set updated\_at \= now()

\---

\#\# 19.3 Trigger: prevent\_owner\_update\_protected\_fields  
On omni\_directory update:  
\- if role=user/owner → block changes to:  
  \- trust\_score\_cached  
  \- verification\_status  
  \- is\_indexable  
  \- owner\_id

\---

\#\# 19.4 Trigger: proof\_status\_change\_generate\_update  
On trust\_proofs update status approved:  
\- insert entity\_updates (proof approved event)

\---

\#\# 19.5 Trigger: claim\_verified\_generate\_update  
On entity\_claim\_requests status verified:  
\- insert entity\_updates (claim verified event)

\---

\#\# 19.6 Trigger: widget\_milestone\_generate\_update (optional)  
On widget stats update:  
\- if clicks reach threshold → insert entity\_updates

\---

\# 20\) VIEWS (PUBLIC SAFE ACCESS)

\#\# 20.1 View: public\_directory\_profile\_view  
Must exclude:  
\- metadata\_private  
\- owner\_id  
\- sensitive claim data

Include:  
\- slug, name, trust\_score\_cached, verification\_status, metadata\_public

\---

\#\# 20.2 View: public\_proof\_summary\_view  
Aggregated:  
\- approved proofs count  
\- last verified date  
No raw proof file\_url unless allowed.

\---

\# 21\) HARDENING RULES (IMPORTANT)

\#\# 21.1 Hash Tokens  
Claim token & widget token must be stored hashed:  
\- store \`token\_hash\`  
\- never store raw token in DB

\---

\#\# 21.2 IP Storage Rule  
\- store ip\_hash only  
\- never store raw IP

\---

\#\# 21.3 Prevent Enumeration  
Public endpoints must:  
\- not expose directory\_id sequentially  
\- use slug-based access

\---

\# 22\) SUPABASE POLICY CHECKLIST (DOC-9 DONE)

AI coder must ensure:

\- \[ \] RLS enabled on all sensitive tables  
\- \[ \] public read only via safe view  
\- \[ \] owner read/write limited by owner\_id join  
\- \[ \] verifier/admin moderation only  
\- \[ \] RPC functions atomic for approvals  
\- \[ \] triggers enforce updated\_at \+ protected fields  
\- \[ \] tokens stored hashed  
\- \[ \] inquiry table not readable by public  
\- \[ \] system\_events admin-only

\---

\# END OF DOC-9

