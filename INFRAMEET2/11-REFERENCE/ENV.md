\# INFRAMEET — ENV \+ MODULAR CONFIG SPEC (DOC-1)  
\*\*Version:\*\* v1.0    
\*\*Status:\*\* Engineering Ready    
\*\*Scope:\*\* Environment variables, modular structure, feature flags, JSON schema contracts    
\*\*Audience:\*\* AI Coder / IDE Agent    
\*\*Goal:\*\* Menghindari konfigurasi liar, metadata liar, dan implementasi yang tidak konsisten.

\---

\# 1\) PRINCIPLES

\#\# 1.1 Single Source of Config Truth  
Semua konfigurasi runtime harus melalui:  
\- \`.env\` (secret)  
\- \`app.config.ts\` (non-secret)  
\- \`featureFlags\` (runtime switch)

Tidak boleh hardcode API keys atau domain di komponen.

\---

\#\# 1.2 Separation of Concerns  
Harus ada pemisahan jelas:  
\- \*\*apps/web\*\* \= frontend \+ API routes (Vercel)  
\- \*\*worker\*\* \= automation jobs (GitHub Actions)  
\- \*\*supabase\*\* \= migrations \+ RPC \+ RLS

\---

\#\# 1.3 Strict JSON Contracts  
Field JSONB (\`metadata\_public\`, \`metadata\_private\`, inquiry\_data, meta logs) harus punya schema yang terdokumentasi.

Tidak boleh JSON random tanpa contract.

\---

\# 2\) REPOSITORY STRUCTURE (RECOMMENDED)

/apps/web  
/app  
/(public)  
/(dashboard)  
/(admin)  
/api  
/embed  
/components  
/ui  
/directory  
/dashboard  
/widgets  
/lib  
env.ts  
config.ts  
supabase.ts  
validators.ts  
rateLimit.ts  
turnstile.ts  
constants.ts  
/types  
directory.ts  
proofs.ts  
claims.ts  
widget.ts  
inquiry.ts

/worker  
/jobs  
/lib  
index.ts

/supabase  
/migrations  
/seed  
/functions (optional)

/docs  
INFRAMEET\_PRD\_v6.2\_FINAL.md  
INFRAMEET\_ENV\_AND\_CONFIG\_SPEC.md (this doc)

\---

\# 3\) ENV CONTRACT (WEB APP)

\> Semua ENV harus tervalidasi saat build/runtime menggunakan Zod.    
\> Jika missing, aplikasi harus fail-fast.

\#\# 3.1 Public Env (Expose to Browser)  
Prefix: \`NEXT\_PUBLIC\_\`

| Key | Required | Example | Notes |  
|---|---|---|---|  
| NEXT\_PUBLIC\_SITE\_URL | YES | https://inframet.xyz | canonical base url |  
| NEXT\_PUBLIC\_SUPABASE\_URL | YES | https://xxx.supabase.co | Supabase project URL |  
| NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY | YES | ey... | safe anon key |  
| NEXT\_PUBLIC\_TURNSTILE\_SITE\_KEY | YES | 0x4AAAA... | captcha widget |  
| NEXT\_PUBLIC\_WIDGET\_VERSION | YES | v1 | widget cache-busting |  
| NEXT\_PUBLIC\_FEATURE\_ESCROW | NO | false | feature flag |  
| NEXT\_PUBLIC\_FEATURE\_WIDGETS | NO | true | feature flag |  
| NEXT\_PUBLIC\_FEATURE\_PROOFS | NO | true | feature flag |

\---

\#\# 3.2 Private Env (Server Only)  
| Key | Required | Notes |  
|---|---|---|  
| SUPABASE\_SERVICE\_ROLE\_KEY | YES | used by server routes (only if needed) |  
| TURNSTILE\_SECRET\_KEY | YES | captcha verification |  
| EMAIL\_PROVIDER\_API\_KEY | NO | optional for claim email |  
| EMAIL\_FROM | NO | claim email sender |  
| UPSTASH\_REDIS\_REST\_URL | NO | rate limit recommended |  
| UPSTASH\_REDIS\_REST\_TOKEN | NO | rate limit recommended |  
| CLOUDINARY\_CLOUD\_NAME | NO | proof file upload |  
| CLOUDINARY\_API\_KEY | NO | optional if server-side upload |  
| CLOUDINARY\_API\_SECRET | NO | secret |  
| GROQ\_API\_KEY | NO | optional summarization only |  
| INTERNAL\_WEBHOOK\_SECRET | NO | protect internal callbacks |

\*\*Hard Rule:\*\*    
Jika memakai Cloudinary direct upload preset, jangan taruh secret di frontend.

\---

\# 4\) ENV CONTRACT (WORKER / GITHUB ACTIONS)

Worker menggunakan env yang berbeda.

| Key | Required | Notes |  
|---|---|---|  
| SUPABASE\_URL | YES | same as NEXT\_PUBLIC\_SUPABASE\_URL |  
| SUPABASE\_SERVICE\_KEY | YES | service role key |  
| GROQ\_API\_KEY | NO | optional summarization |  
| OPENALEX\_EMAIL | NO | OpenAlex polite pool |  
| WORKER\_BATCH\_LIMIT | NO | default 50 |  
| WORKER\_LOG\_LEVEL | NO | info/warn/error |  
| DNS\_RESOLVER | NO | default system |  
| EMBEDDING\_MODEL | NO | sentence-transformers recommended |

\---

\# 5\) CONFIG FILES (NON-SECRET)

\#\# 5.1 \`/apps/web/lib/config.ts\`  
Berisi config non-secret:  
\- limits  
\- allowed enums  
\- UI constants  
\- feature flags default

\#\#\# Example Keys (Contract)  
\`\`\`ts  
export const APP\_CONFIG \= {  
  appName: "INFRAMEET",  
  defaultLocale: "id",  
  supportedLocales: \["id", "en"\],

  limits: {  
    inquiryMaxLength: 2000,  
    proofMaxUploadMB: 20,  
    maxProofsPerEntity: 50,  
    maxClaimsPerEntityPerMonth: 5,  
    maxWidgetInstallationsPerEntity: 20,  
  },

  trustScore: {  
    min: 0,  
    max: 100,  
    decayDays: 60,  
    decayPoints: 5,  
  },

  widget: {  
    clickRewardThreshold: 100,  
    clickRewardWindowDays: 30,  
    uniqueClickTTLHours: 24,  
  }  
};

---

# **6\) FEATURE FLAGS (MODULARITY SWITCH)**

Feature flags harus bisa:

* disable escrow entirely  
* disable widgets entirely  
* disable proofs (rare, but useful)  
* disable claims (should not in production)

## **6.1 Feature Flag Contract**

Lokasi: `/apps/web/lib/featureFlags.ts`

Flags:

* `FEATURE_ESCROW`  
* `FEATURE_WIDGETS`  
* `FEATURE_PROOFS`  
* `FEATURE_CLAIMS`  
* `FEATURE_ACADEMIC_SYNC`

**Rule:**  
Jika feature flag off:

* page tidak muncul di UI  
* API routes return 404 or disabled message  
* worker job skip

---

# **7\) VALIDATION LAYER (ZOD CONTRACT)**

## **7.1 Env Validator**

File: `/apps/web/lib/env.ts`

Must validate:

* required keys exist  
* URL format valid  
* boolean flags parse correctly

**Rule:**  
Jika env invalid → throw error at boot.

---

## **7.2 Request Validator**

File: `/apps/web/lib/validators.ts`

Semua endpoint publik harus pakai Zod.

Contoh:

* inquiry submit payload  
* widget event payload  
* claim request payload  
* proof metadata payload

---

# **8\) JSON SCHEMA CONTRACTS (STRICT)**

## **8.1 omni\_directory.metadata\_public (JSONB)**

Tujuan: data publik untuk storefront.

### **Schema: `DirectoryPublicMetadata`**

{  
  "location": {  
    "country": "ID",  
    "province": "Jawa Barat",  
    "city": "Cirebon"  
  },  
  "categories": \["seo", "software", "education"\],  
  "services": \["Web Development", "SEO Audit"\],  
  "pricing": {  
    "starting\_from\_idr": 500000  
  },  
  "social\_links": {  
    "instagram": "https://instagram.com/...",  
    "linkedin": "https://linkedin.com/in/...",  
    "youtube": "https://youtube.com/..."  
  },  
  "contact": {  
    "whatsapp": "+62...",  
    "telegram": "@..."  
  },  
  "languages": \["id", "en"\],  
  "portfolio\_links": \[  
    {  
      "title": "Case Study A",  
      "url": "https://..."  
    }  
  \]  
}

**Rules:**

* semua URL harus valid  
* categories max 10  
* services max 20  
* whatsapp optional  
* portfolio\_links max 20

---

## **8.2 omni\_directory.metadata\_private (JSONB)**

Tujuan: data internal untuk owner.

### **Schema: `DirectoryPrivateMetadata`**

{  
  "bank\_account": {  
    "bank\_name": "BCA",  
    "account\_name": "Nama",  
    "account\_number": "123..."  
  },  
  "internal\_notes": "catatan owner",  
  "lead\_routing": {  
    "email\_forward": "owner@email.com",  
    "telegram\_chat\_id": "12345"  
  }  
}

**Rules:**

* tidak boleh ditampilkan publik  
* tidak boleh di-index search

---

## **8.3 entity\_inquiries.inquiry\_data (JSONB)**

Tujuan: payload inquiry fleksibel tapi terstruktur.

### **Schema: `InquiryPayload`**

{  
  "topic": "partnership",  
  "budget\_idr": 5000000,  
  "timeline": "2 weeks",  
  "message": "Saya butuh audit SEO untuk website saya",  
  "contact\_preference": "whatsapp"  
}

---

## **8.4 reputation\_logs.meta (JSONB)**

Tujuan: audit transparansi.

### **Schema: `ReputationMeta`**

{  
  "source": "system",  
  "proof\_id": "uuid",  
  "escrow\_id": "uuid",  
  "widget\_installation\_id": "uuid",  
  "notes": "optional reason"  
}

---

## **8.5 trust\_proofs.meta (JSONB)**

Tujuan: menyimpan OCR, parsing, tag bukti.

### **Schema: `ProofMeta`**

{  
  "issuer": "Kemenkumham",  
  "issued\_date": "2024-01-10",  
  "document\_type": "NIB",  
  "confidence\_score": 0.82,  
  "tags": \["legal", "business"\]  
}

---

## **8.6 widget\_events.meta (JSONB)**

Tujuan: tracking minimal.

### **Schema: `WidgetEventMeta`**

{  
  "page\_path": "/about",  
  "utm\_source": "blog",  
  "utm\_campaign": "badge"  
}

---

# **9\) CONSTANT ENUMS (DO NOT DUPLICATE)**

Semua enum harus ditulis di satu tempat untuk mencegah mismatch.

Lokasi: `/apps/web/lib/constants.ts`

## **9.1 Enums Required**

* entity\_type  
* verification\_status  
* proof\_type  
* claim\_method  
* inquiry\_status  
* escrow\_status  
* widget\_type  
* widget\_event\_type

---

# **10\) STORAGE SPEC (PROOFS & ASSETS)**

## **10.1 Recommended Strategy**

* Upload file proof langsung ke Cloudinary/R2 dari client (signed upload optional).  
* DB hanya menyimpan `file_url` \+ `file_hash`.

## **10.2 File Hash Rule**

Setiap proof harus punya:

* sha256 hash  
* unique index untuk mencegah upload duplikat

---

# **11\) SEARCH EMBEDDING MODULARITY**

## **11.1 Embedding Dimension**

* vector(384) mandatory  
* cosine similarity index

## **11.2 Embedding Generation Rule**

* embeddings tidak boleh dibuat di Vercel API route  
* hanya worker yang generate embeddings

---

# **12\) RATE LIMIT MODULARITY**

## **12.1 Provider Options**

* Preferred: Upstash Redis  
* Fallback: Supabase `rate_limit_events`

## **12.2 Rate Limit Policy Contract (Default)**

* inquiry submit: max 3 per 10 menit per ip\_hash  
* claim request: max 3 per hari per user\_id  
* widget events: max 1000/day per installation\_id

Config disimpan di `APP_CONFIG.limits`.

---

# **13\) CAPTCHA MODULARITY**

## **13.1 Mandatory Forms**

Turnstile wajib untuk:

* inquiry submit  
* claim request  
* signup suspicious (optional)  
* review submit (recommended)

## **13.2 Captcha Failure Behavior**

Jika captcha invalid:

* return 403  
* log ke system\_events severity=warn

---

# **14\) LOGGING & SYSTEM EVENTS CONTRACT**

## **14.1 Logging Rules**

Setiap kejadian abnormal harus masuk ke `system_events`:

* invalid token  
* suspicious spam payload  
* excessive widget events  
* claim brute force attempt  
* repeated inquiry

---

# **15\) MIGRATION VERSIONING RULE**

Supabase migrations harus modular:

Recommended order:

* `001_core.sql` (profiles, directory)  
* `002_trust.sql` (reputation logs)  
* `003_verification.sql`  
* `004_proofs.sql`  
* `005_claims.sql`  
* `006_widgets.sql`  
* `007_anti_abuse.sql`  
* `008_rls.sql`  
* `009_rpc.sql`  
* `010_triggers.sql`

---

# **16\) DATA RETENTION DEFAULTS (CONFIG LEVEL)**

Walaupun detail retention policy ditulis di dokumen opsional, minimal config harus ada:

* widget\_events retention: 90 days  
* rate\_limit\_events retention: 7 days  
* staging\_inbox retention: 60 days  
* system\_events retention: 180 days

Worker cleanup wajib menggunakan parameter ini.

---

# **17\) PERSONALIZATION CONFIG (MINIMAL CONTRACT)**

Walaupun UX detail ada di DOC-2, minimal config perlu mendukung:

## **17.1 Directory Visibility Toggles**

* show\_contact\_email: boolean  
* show\_whatsapp: boolean  
* show\_proofs\_summary: boolean  
* show\_reviews: boolean

Lokasi: `metadata_public.contact` \+ UI toggles.

---

# **18\) AI CODER TASK CHECKLIST (DOC-1)**

AI coder wajib implement:

* env validator (web \+ worker)  
* config.ts constants (APP\_CONFIG)  
* enums centralized constants  
* zod schemas for JSON contracts  
* feature flags integration (UI \+ API \+ worker)  
* file upload strategy (store only file\_url \+ hash)  
* rate limit module (redis or db fallback)  
* captcha module  
* system\_events logger helper

---

# **END OF DOC-1**

Selanjutnya saya bisa tulis \*\*DOC-2 (UI Design System \+ Components \+ Theme)\*\* secara ringkas tapi lengkap, supaya AI Coder langsung punya style & struktur UI yang konsisten.

