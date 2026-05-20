\# INFRAMEET — DATA RETENTION \+ LIFECYCLE \+ COST CONTROL POLICY (DOC-5)  
\*\*Version:\*\* v1.0    
\*\*Status:\*\* Engineering Ready    
\*\*Scope:\*\* Data retention rules, cleanup schedules, lifecycle policies, storage strategy for Supabase Free Tier    
\*\*Audience:\*\* AI Coder / Backend Engineer / Operator    
\*\*Goal:\*\* Mencegah Supabase free tier cepat penuh, menjaga performa DB, dan menjaga keamanan data.

\---

\# 1\) PRINCIPLES

\#\# 1.1 Free Tier Survival Rule  
Supabase free tier cepat penuh jika:  
\- event logs tidak dibersihkan  
\- widget events terus menumpuk  
\- system\_events tidak dipotong  
\- staging queue tidak dibersihkan

Maka retention wajib diterapkan sejak MVP.

\---

\#\# 1.2 Lifecycle \= Product Integrity  
Retention bukan hanya cost issue, tapi juga:  
\- privacy compliance  
\- attack surface reduction  
\- query performance improvement

\---

\# 2\) DATA CLASSIFICATION

\#\# 2.1 Public Permanent Data  
Data yang boleh disimpan lama (high value):  
\- omni\_directory  
\- approved trust\_proofs metadata (tanpa file)  
\- reviews  
\- verification status

Retention: \*\*indefinite\*\* (until deleted).

\---

\#\# 2.2 Sensitive Private Data  
Data yang perlu minim exposure:  
\- inquiries (email visitor)  
\- claim requests (token)  
\- private metadata (bank account)  
\- escrow ledger (financial logs)

Retention: \*\*limited\*\*, must be configurable.

\---

\#\# 2.3 High-Volume Event Data (Must Expire)  
Data yang volumenya besar:  
\- widget\_events  
\- rate\_limit\_events  
\- system\_events  
\- staging\_inbox

Retention: \*\*short\*\*, must be auto-cleaned.

\---

\# 3\) RETENTION POLICY (DEFAULTS)

\> Semua angka default dapat disimpan di APP\_CONFIG / worker config.

\#\# 3.1 widget\_events  
\- default retention: \*\*90 days\*\*  
\- aggregation job harus menyimpan summary sebelum deletion

\*\*Reason:\*\* widget clicks/impressions volume tinggi.

\---

\#\# 3.2 rate\_limit\_events  
\- default retention: \*\*7 days\*\*

\*\*Reason:\*\* hanya dipakai untuk throttling pendek.

\---

\#\# 3.3 staging\_inbox  
\- retention: \*\*60 days\*\*  
\- failed jobs: 30 days (optional shorter)

\*\*Rule:\*\*  
\- status \`done\` harus dibersihkan lebih cepat (misal 14 hari).

\---

\#\# 3.4 system\_events  
\- retention: \*\*180 days\*\*  
\- severity=error boleh lebih lama (365 days optional)

\*\*Reason:\*\* audit penting tapi jangan infinite.

\---

\#\# 3.5 entity\_inquiries  
\- retention: \*\*365 days\*\*  
\- archived inquiries boleh dibersihkan lebih cepat (180 days)

\*\*Rule:\*\*  
Jika entity flagged spam → inquiries retention 30 days.

\---

\#\# 3.6 entity\_claim\_requests  
\- verified claims retention: indefinite (audit)  
\- pending claims retention: 30 days  
\- expired claims: auto delete after 30 days

\---

\#\# 3.7 trust\_proofs  
\- approved proof metadata: indefinite  
\- rejected proofs retention: 90 days  
\- pending proofs retention: 60 days (auto expire)

\---

\#\# 3.8 proof\_reviews (audit trail)  
\- retention: indefinite (audit)

\---

\#\# 3.9 escrow\_ledger (optional)  
\- retention: indefinite (audit compliance)  
\- dispute logs: indefinite

\---

\# 4\) DATA LIFECYCLE RULES (TABLE BY TABLE)

| Table | Type | Default Retention | Cleanup Method |  
|---|---|---:|---|  
| omni\_directory | core | indefinite | manual delete |  
| profiles | identity | indefinite | manual delete |  
| reputation\_logs | audit | indefinite | never delete (recommended) |  
| trust\_proofs | trust | mixed | expire \+ cleanup |  
| proof\_reviews | audit | indefinite | never delete |  
| entity\_claim\_requests | ownership | mixed | expire \+ cleanup |  
| entity\_inquiries | leads | 365 days | scheduled cleanup |  
| reviews | trust | indefinite | manual delete |  
| escrow\_ledger | finance | indefinite | never delete |  
| widget\_installations | growth | indefinite | manual delete |  
| widget\_events | growth volume | 90 days | scheduled cleanup |  
| rate\_limit\_events | abuse | 7 days | scheduled cleanup |  
| disposable\_email\_domains | config | indefinite | update overwrite |  
| staging\_inbox | worker queue | 60 days | scheduled cleanup |  
| system\_events | audit volume | 180 days | scheduled cleanup |

\---

\# 5\) CLEANUP JOB ARCHITECTURE (WORKER RESPONSIBILITY)

\#\# 5.1 Cleanup Must Be Worker-Based  
Cleanup tidak boleh dijalankan dari Vercel request lifecycle.

Cleanup dijalankan oleh:  
\- GitHub Actions cron worker

\---

\#\# 5.2 Required Worker Cleanup Jobs

\#\#\# Job: cleanup\_rate\_limit\_events  
\- delete rows older than 7 days

\#\#\# Job: cleanup\_widget\_events  
\- delete rows older than 90 days

\#\#\# Job: cleanup\_staging\_inbox  
\- delete done rows older than 14 days  
\- delete failed rows older than 30 days  
\- delete expired rows older than 60 days

\#\#\# Job: cleanup\_system\_events  
\- delete info/warn older than 180 days  
\- keep error longer (optional)

\#\#\# Job: cleanup\_expired\_claims  
\- delete expired claim requests older than 30 days

\#\#\# Job: cleanup\_expired\_proofs  
\- set pending proofs older than 60 days to expired  
\- optionally delete rejected proofs older than 90 days

\---

\# 6\) AGGREGATION BEFORE DELETION (MANDATORY)

\#\# 6.1 Widget Events Must Be Aggregated  
Sebelum widget\_events dihapus, sistem harus menyimpan ringkasan.

\#\#\# Recommended Summary Table  
\`widget\_event\_daily\_stats\`

Fields:  
\- installation\_id  
\- date  
\- impressions\_count  
\- clicks\_count  
\- unique\_clicks\_count  
\- lead\_submit\_count

Retention: indefinite (stats kecil, bukan raw logs).

\---

\#\# 6.2 Rate Limit Events Aggregation (Optional)  
Tidak perlu agregasi, karena nilainya transient.

\---

\# 7\) STORAGE POLICY (FILES)

\#\# 7.1 Proof Files Storage Rule  
Proof file tidak boleh disimpan di Supabase Storage (untuk free tier).

Recommended:  
\- Cloudinary  
\- Cloudflare R2

DB hanya menyimpan:  
\- file\_url  
\- file\_hash  
\- file\_size  
\- mime\_type

\---

\#\# 7.2 File Deletion Lifecycle  
Jika proof status:  
\- rejected → file boleh auto delete setelah 90 hari (optional)  
\- expired → file boleh auto delete setelah 180 hari (optional)

\*\*Hard Rule:\*\*  
Jika file dihapus, metadata harus tetap ada untuk audit (opsional).

\---

\# 8\) PRIVACY & SENSITIVE DATA HANDLING

\#\# 8.1 Inquiry Privacy  
Inquiry mengandung email visitor → data sensitif.

Rules:  
\- jangan tampilkan inquiry di public page  
\- hanya owner/admin bisa melihat  
\- mask email di UI list view (optional)

\---

\#\# 8.2 Claim Token Security  
Claim token wajib:  
\- random secure  
\- expire within 24h–72h  
\- delete token setelah verified

\---

\#\# 8.3 IP Hash Handling  
IP tidak boleh disimpan raw.

Rules:  
\- simpan \`ip\_hash\` salted  
\- rotate salt periodically (optional)  
\- ip\_hash retention pendek

\---

\# 9\) DB PERFORMANCE RULES

\#\# 9.1 Indexing for High Volume Tables  
Tables yang wajib index:  
\- widget\_events(created\_at, installation\_id)  
\- rate\_limit\_events(created\_at, action)  
\- system\_events(created\_at, severity)

\#\# 9.2 Partitioning (Optional)  
Jika traffic besar:  
\- widget\_events partition by month  
\- system\_events partition by month

MVP tidak wajib.

\---

\# 10\) SOFT DELETE VS HARD DELETE

\#\# 10.1 Omni Directory Deletion  
Jika entity dihapus:  
\- recommended soft-delete flag \`is\_deleted\`  
\- public page returns 404  
\- keep audit logs (reputation\_logs)

\---

\#\# 10.2 Proof Deletion  
Jika owner delete proof:  
\- status set to deleted  
\- keep proof\_reviews for audit

\---

\# 11\) BACKUP POLICY (MINIMAL)

\#\# 11.1 Free Tier Backup Reality  
Supabase free tier backup terbatas.

Minimum:  
\- export DB weekly via GitHub Actions (optional)  
\- backup config tables

\---

\# 12\) RETENTION CONFIG CONTRACT

\#\# 12.1 APP\_CONFIG Retention Block  
Config harus ada:  
\`\`\`ts  
retention: {  
  widgetEventsDays: 90,  
  rateLimitDays: 7,  
  stagingInboxDays: 60,  
  systemEventsDays: 180,  
  inquiriesDays: 365,  
  rejectedProofsDays: 90,  
  pendingProofExpireDays: 60,  
  pendingClaimExpireDays: 30  
}

Worker wajib membaca config ini.

---

# **13\) OPERATIONAL DASHBOARD (OPTIONAL)**

Admin panel dapat menampilkan:

* total widget\_events rows  
* total system\_events rows  
* storage usage estimate  
* last cleanup job status

---

# **14\) DOC-5 IMPLEMENTATION CHECKLIST**

AI coder wajib implement:

* cleanup jobs in worker cron  
* widget\_event\_daily\_stats aggregation table  
* retention config block in APP\_CONFIG  
* delete old widget\_events \+ rate\_limit\_events  
* expire pending proofs & claims automatically  
* never store raw IP, only hashed  
* indexes for high-volume tables

---

# **END OF DOC-5**

