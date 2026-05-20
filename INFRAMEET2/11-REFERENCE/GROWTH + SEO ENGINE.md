\# INFRAMEET — GROWTH \+ SEO ENGINE SPEC (DOC-6)  
\*\*Version:\*\* v1.0    
\*\*Status:\*\* Engineering Ready    
\*\*Scope:\*\* Programmatic SEO (pSEO), AEO/GEO, Google Discover engine, internal linking strategy, dynamic content, keyword/brand booster, analytics event schema, viral utility tools, quizzes/assessments, gamification loops    
\*\*Audience:\*\* AI Coder / Growth Engineer / SEO Engineer    
\*\*Goal:\*\* Menjadikan INFRAMEET mesin akuisisi organik (SEO \+ Discover \+ viral loops) dengan biaya minimal dan modular.

\---

\# 1\) GROWTH PRINCIPLES (NON-NEGOTIABLE)

\#\# 1.1 Distribution-First  
Setiap modul harus menghasilkan salah satu:  
\- indexable page  
\- shareable output  
\- backlink opportunity  
\- repeat visit reason

Jika tidak mendukung distribusi, modul dianggap “nice-to-have”.

\---

\#\# 1.2 Programmatic SEO Without Spam  
pSEO wajib punya:  
\- template unik per niche  
\- internal linking kuat  
\- noindex untuk low-quality pages  
\- update freshness via entity timeline

\---

\#\# 1.3 Trust as Content  
INFRAMEET bukan blog. Kontennya adalah:  
\- proofs  
\- verification events  
\- entity updates  
\- reviews  
\- milestone achievements

Konten harus otomatis terbentuk dari sistem.

\---

\# 2\) PROGRAMMATIC SEO (pSEO) ROUTE MAP

\#\# 2.1 Required pSEO Routes (High ROI)  
\#\#\# A) Category Directory  
\- \`/category/\[categorySlug\]\`  
\- \`/category/\[categorySlug\]/verified\`  
\- \`/category/\[categorySlug\]/top\`  
\- \`/category/\[categorySlug\]/new\`

\#\#\# B) Location Directory  
\- \`/city/\[country\]/\[citySlug\]\`  
\- \`/city/\[country\]/\[citySlug\]/verified\`

\#\#\# C) Combined Intent Pages (Money Pages)  
\- \`/best/\[categorySlug\]/in/\[citySlug\]\`  
\- \`/top/\[categorySlug\]/in/\[citySlug\]\`

\#\#\# D) Entity Comparison Pages (Viral \+ High CTR)  
\- \`/compare/\[slugA\]-vs-\[slugB\]\`

\#\#\# E) Alternatives Pages (Sticky internal linking)  
\- \`/directory/\[slug\]/alternatives\`

\#\#\# F) Trust Proof Listing Pages (optional)  
\- \`/proofs/\[proofType\]\`  
\- \`/proofs/\[proofType\]/in/\[citySlug\]\`

\---

\#\# 2.2 Optional pSEO Routes (Long Tail Scaling)  
\- \`/directory/\[slug\]/reviews\`  
\- \`/directory/\[slug\]/services\`  
\- \`/directory/\[slug\]/history\` (timeline)  
\- \`/tags/\[tagSlug\]\`

\---

\# 3\) INDEXING & QUALITY GATING (ANTI-SPAM pSEO)

\#\# 3.1 Indexable Rules (Per Page Type)  
\#\#\# Directory Page \`/directory/\[slug\]\`  
Index if:  
\- verification\_status \!= flagged  
\- description length \>= 120 chars OR proofs \>= 1 OR reviews \>= 1

\#\#\# Category Page \`/category/\[slug\]\`  
Index if:  
\- entities count \>= 5  
\- at least 2 entities have trust\_score \>= 20

\#\#\# City Page \`/city/\[country\]/\[city\]\`  
Index if:  
\- entities count \>= 5

\#\#\# Best Page \`/best/\[cat\]/in/\[city\]\`  
Index if:  
\- entities count \>= 3 with trust\_score \>= 30

\#\#\# Compare Page \`/compare/\*\`  
Index if:  
\- both entities exist and not flagged

\#\#\# Alternatives Page  
Index if:  
\- alternatives \>= 5

\---

\#\# 3.2 Noindex Rules (Mandatory)  
Noindex if:  
\- entities count \< threshold  
\- page is empty template  
\- flagged entities dominate result  
\- query-like param page (avoid infinite index)

\---

\# 4\) SEO TEMPLATE SYSTEM (CONTENT CONTRACT)

\#\# 4.1 Category Page Template  
Sections order:  
1\. H1: “{CategoryName} Directory”  
2\. Intro paragraph (templated, not AI required)  
3\. Top entities list (trust\_score sort)  
4\. Verified-only highlight section  
5\. FAQ block (AEO)  
6\. Related categories links  
7\. Related cities links

\---

\#\# 4.2 City Page Template  
Sections:  
1\. H1: “Trusted Providers in {City}”  
2\. Intro paragraph  
3\. Category chips available in city  
4\. Top entities list  
5\. “Recently verified in {City}” (freshness feed)  
6\. FAQ block  
7\. Nearby cities internal links

\---

\#\# 4.3 Best Page Template (High Commercial Intent)  
Sections:  
1\. H1: “Best {Category} in {City}”  
2\. How ranking works (transparency)  
3\. Top list (top 10\)  
4\. Verified badge explanation  
5\. FAQ  
6\. CTA: “Submit/Claim your profile”

\---

\#\# 4.4 Compare Page Template (CTR Monster)  
Sections:  
1\. H1: “{A} vs {B}”  
2\. Comparison table:  
   \- trust\_score  
   \- verification\_status  
   \- proofs count  
   \- reviews count  
   \- widget verified (optional)  
3\. Strengths summary (short)  
4\. “Which should you choose?” (disclaimer)  
5\. Alternatives list (internal linking)

\*\*Hard rule:\*\* Jangan membuat klaim defamasi. Gunakan “Based on available proofs”.

\---

\#\# 4.5 Alternatives Page Template  
Sections:  
1\. H1: “Alternatives to {EntityName}”  
2\. Similar providers list (vector similarity)  
3\. Filters: city/category/verified-only  
4\. CTA inquiry

\---

\# 5\) INTERNAL LINKING ENGINE (CRITICAL)

\#\# 5.1 Mandatory Links on Directory Page  
Directory page harus link ke:  
\- category pages (all categories)  
\- city page  
\- best page (category+city)  
\- alternatives page  
\- compare suggestions (2-3 links)

\---

\#\# 5.2 Mandatory Links on Category Page  
Category page harus link ke:  
\- best pages by city (top 10 cities)  
\- related categories  
\- directory profiles featured

\---

\#\# 5.3 Mandatory Links on City Page  
City page harus link ke:  
\- best pages by category (top 10 categories)  
\- nearby city pages  
\- directory profiles featured

\---

\#\# 5.4 Similarity Engine for Internal Linking  
Similarity computed by:  
\- embedding similarity (pgvector)  
\- shared category overlap  
\- same city overlap

Worker harus generate “related entities” cache table.

\---

\# 6\) AEO/GEO LAYER (ANSWER ENGINE OPTIMIZATION)

\#\# 6.1 FAQ Blocks (Schema Driven)  
Setiap page pSEO harus punya FAQ block.

\#\#\# FAQ topics for Category Pages  
\- “Apa itu {Category}?”  
\- “Berapa biaya {Category}?”  
\- “Bagaimana memilih provider terpercaya?”  
\- “Apa bukti yang harus dicek?”  
\- “Apa beda verified vs unverified?”

\#\#\# FAQ topics for City Pages  
\- “Bagaimana mencari provider di {City}?”  
\- “Apakah ada provider legal verified di {City}?”

\---

\#\# 6.2 FAQ Schema (JSON-LD)  
AI coder wajib menambahkan \`FAQPage\` schema untuk:  
\- category pages  
\- city pages  
\- best pages  
\- directory pages (optional)

\---

\#\# 6.3 Answer Block Format (Snippet-Oriented)  
Format wajib:  
\- 1 paragraf ringkas (2-3 kalimat)  
\- bullet list  
\- short conclusion

Ini meningkatkan peluang snippet.

\---

\# 7\) GOOGLE DISCOVER ENGINE (DYNAMIC CONTENT)

\#\# 7.1 Discover Requirements  
Discover suka:  
\- fresh pages  
\- topical authority  
\- consistent publishing

INFRAMEET harus punya dynamic content feed.

\---

\#\# 7.2 Required Feed Routes  
\- \`/updates\`  
\- \`/updates/\[categorySlug\]\`  
\- \`/updates/\[citySlug\]\`  
\- \`/updates/\[entitySlug\]\`

\---

\#\# 7.3 Update Types (Content Source)  
Update bukan blog random, tapi event trust-based:

\- proof approved  
\- claim verified  
\- entity reached trust milestone (30/50/70)  
\- verified review posted  
\- escrow released milestone (optional)  
\- widget growth milestone

\---

\#\# 7.4 Updates Data Model (Recommended Table)  
Table: \`entity\_updates\`

Fields:  
\- id  
\- directory\_id  
\- update\_type  
\- title  
\- summary  
\- payload JSONB  
\- created\_at  
\- is\_public boolean  
\- is\_indexable boolean

Worker menghasilkan update otomatis setiap event besar.

\---

\#\# 7.5 Update Page Template  
\`/updates/\[id\]\` harus punya:  
\- H1 title  
\- summary paragraph  
\- entity link  
\- related updates  
\- disclaimer (“Based on verified activity logs”)

\---

\# 8\) KEYWORD \+ BRAND BOOSTER SYSTEM

\#\# 8.1 Entity Keyword Pack  
Setiap entity harus punya field:  
\- primary\_keyword  
\- secondary\_keywords\[\] (max 10\)  
\- topical\_tags\[\] (max 20\)

Disimpan di:  
\- \`metadata\_public.categories/services/tags\`

Worker menyarankan keyword pack via:  
\- category inference  
\- content extraction from description/proofs

\---

\#\# 8.2 SERP Association Strategy  
Directory page harus menampilkan:  
\- “Known for: {service chips}”  
\- “Works in: {city}”  
\- “Trusted for: {industry tags}”

Tujuan: Google memahami entity-context.

\---

\#\# 8.3 Entity Snippet Booster  
Tambahkan section:  
\- “Quick Facts”  
  \- verification status  
  \- trust score  
  \- proofs count  
  \- reviews count  
  \- last verified date

Ini membantu snippet extraction.

\---

\# 9\) PROGRAMMATIC CONTENT GENERATOR (WORKER SPEC)

\#\# 9.1 Worker Jobs for Growth Engine

\#\#\# Job A: generate\_category\_pages\_cache  
\- update stats per category  
\- precompute top entities

\#\#\# Job B: generate\_city\_pages\_cache  
\- update stats per city

\#\#\# Job C: generate\_best\_pages\_cache  
\- category+city combination

\#\#\# Job D: generate\_related\_entities\_cache  
\- precompute alternatives list

\#\#\# Job E: generate\_entity\_updates  
\- auto create update content when events happen

\#\#\# Job F: generate\_faq\_templates  
\- templated FAQ injection based on category/city

\---

\#\# 9.2 Caching Strategy (Mandatory)  
Karena Vercel serverless cost-sensitive:  
\- precompute lists daily  
\- store in table \`seo\_page\_cache\`

\---

\#\# 9.3 SEO Cache Table (Recommended)  
Table: \`seo\_page\_cache\`

Fields:  
\- page\_type (category/city/best/compare/alternatives)  
\- page\_key (slug identifiers)  
\- json\_payload (list of entity IDs \+ snippets)  
\- updated\_at  
\- expires\_at

\---

\# 10\) VIRAL UTILITY TOOLS (SEO MAGNET MODULES)

\> Utility tools dibuat sebagai "micro SaaS pages" untuk traffic \+ lead capture.

\#\# 10.1 Required Tools (High ROI)  
\#\#\# Tool A: Trust Score Checker  
Route:  
\- \`/tools/trust-score-checker\`  
Function:  
\- user input domain/name → search entity → show trust summary

\#\#\# Tool B: Contract / Invoice Generator  
Route:  
\- \`/tools/invoice-generator\`  
\- \`/tools/contract-generator\`  
Output:  
\- PDF preview \+ share link  
Growth loop:  
\- watermark “Generated by INFRAMEET”

\#\#\# Tool C: Partnership Readiness Checklist  
Route:  
\- \`/tools/partnership-checklist\`  
Output:  
\- score \+ recommendations \+ CTA inquiry

\#\#\# Tool D: SEO Audit Quick Scanner (Lite)  
Route:  
\- \`/tools/seo-audit-lite\`  
Output:  
\- checklist \+ CTA “Find SEO expert in directory”

\---

\#\# 10.2 Tool Output Must Be Shareable  
Every tool output should produce:  
\- unique URL result page  
\- OG image  
\- CTA embed widget / claim profile

\---

\# 11\) QUIZ / ASSESSMENT MODULE (LEAD CAPTURE ENGINE)

\#\# 11.1 Quiz Types (Templates)  
\- “Business Trust Readiness”  
\- “SEO Readiness”  
\- “Legal Compliance Readiness”  
\- “Brand Authority Score”

\---

\#\# 11.2 Quiz Flow UX  
1\. landing intro  
2\. 10-20 questions  
3\. result score page  
4\. recommended actions:  
   \- claim profile  
   \- upload proof  
   \- contact provider (inquiry)

\---

\#\# 11.3 Quiz Data Model (Minimal)  
Tables recommended:  
\- \`quizzes\`  
\- \`quiz\_questions\`  
\- \`quiz\_responses\`  
\- \`quiz\_result\_pages\`

Retention:  
\- responses anonymized or expire in 90 days.

\---

\#\# 11.4 Quiz as pSEO Content  
Quiz pages indexable.  
Result pages optionally noindex (prevent thin duplicates).

\---

\# 12\) GAMIFICATION & BUILT-IN MARKETING LOOPS

\#\# 12.1 Trust Levels  
\- Bronze (0-29)  
\- Silver (30-49)  
\- Gold (50-69)  
\- Platinum (70-100)

Displayed on profile.

\---

\#\# 12.2 Milestone Badges  
\- “Claim Verified”  
\- “First Proof Approved”  
\- “Top in Category”  
\- “100 Widget Clicks”  
\- “10 Verified Reviews”  
\- “Trusted This Month”

Milestones trigger \`entity\_updates\`.

\---

\#\# 12.3 Leaderboards (Highly Viral)  
Routes:  
\- \`/leaderboard\`  
\- \`/leaderboard/\[category\]\`  
\- \`/leaderboard/\[city\]\`

Indexing rules:  
\- index only if enough entities.

\---

\# 13\) REFERRAL PROGRAM (BEYOND WIDGET)

\#\# 13.1 Referral Link System  
Each user gets:  
\- referral code

Routes:  
\- \`/r/\[code\]\`

Rewards:  
\- trust\_score points or badge for referred verified claim

\---

\#\# 13.2 Anti Fraud Rules  
\- referral rewards only if referred user:  
  \- completes claim verified OR  
  \- has proof approved

No reward for just signup.

\---

\# 14\) TOPICAL BURST PUBLISHING (DISCOVER \+ SEO)

\#\# 14.1 RSS Aggregation Engine  
Worker ingests RSS sources:  
\- category relevant feeds  
\- local news feeds  
\- gov press releases

Output:  
\- \`/digest/\[category\]/\[date\]\`  
\- \`/digest/\[source\]/\[date\]\`

\---

\#\# 14.2 Digest Format  
\- 5-10 curated headlines  
\- short summary  
\- link to sources  
\- related providers in directory

This creates contextual pages linking to entities.

\---

\# 15\) ANALYTICS EVENT SCHEMA (TRACKING READY)

\#\# 15.1 Core Events (Mandatory)  
Events:  
\- page\_view  
\- search\_query  
\- directory\_view  
\- inquiry\_submit  
\- claim\_start  
\- claim\_verified  
\- proof\_upload  
\- proof\_approved  
\- widget\_install  
\- widget\_click  
\- widget\_impression  
\- tool\_used  
\- quiz\_completed

\---

\#\# 15.2 Event Payload Contract (Standard)  
All events must include:  
\`\`\`json  
{  
  "event": "directory\_view",  
  "timestamp": "ISO\_DATE",  
  "user\_id": "optional",  
  "session\_id": "required",  
  "page\_path": "/directory/slug",  
  "referrer": "optional",  
  "utm": {  
    "source": "optional",  
    "medium": "optional",  
    "campaign": "optional"  
  },  
  "meta": {}  
}

---

## **15.3 Analytics Providers (Recommended)**

* PostHog (best for product analytics)  
* Plausible (simple)  
* Umami (self-host)

Minimum requirement:

* server-side event endpoint optional  
* client-side lightweight tracking

---

# **16\) CONVERSION OPTIMIZATION (CRO) SPEC**

## **16.1 Inquiry CTA Placement**

On profile page:

* primary CTA always visible above fold  
* sticky CTA on mobile

## **16.2 Social Proof Placement**

Proof summary must appear before About text.

## **16.3 Trust Explainer Tooltip**

Trust score harus punya tooltip:

* “Based on verified proofs, claims, and activity logs.”

---

# **17\) PERFORMANCE & CACHING STRATEGY (GROWTH COMPATIBLE)**

## **17.1 Public Page Rendering Strategy**

* Directory pages: ISR revalidate 6h  
* Category/city/best pages: ISR revalidate 12h  
* Updates pages: ISR revalidate 1h

---

## **17.2 Widget Script Caching**

`/embed/widget/*.js` must:

* cache-control: public, max-age=86400  
* versioned by NEXT\_PUBLIC\_WIDGET\_VERSION

---

# **18\) OPEN SOURCE RESOURCES / APIs (CURATED LIST)**

## **18.1 Academic / Citation**

* OpenAlex API  
* Crossref API  
* ORCID OAuth

## **18.2 Company/Brand Enrichment**

* Clearbit Logo API (logo from domain)  
* faviconkit (favicon extraction)

## **18.3 SEO/Metadata Extraction**

* metascraper (Node)  
* link-preview-js

## **18.4 Disposable Email**

* open-source disposable domains list (GitHub)  
* email domain validator libraries

## **18.5 Rate Limit / Abuse**

* Upstash Redis  
* Cloudflare Turnstile

---

# **19\) IMPLEMENTATION ORDER (GROWTH ENGINE)**

## **Phase G1 — pSEO Core Pages**

* category pages  
* city pages  
* best pages  
* alternatives pages

## **Phase G2 — Internal Linking Engine**

* related entities cache  
* compare page suggestions

## **Phase G3 — Updates Feed Engine**

* entity\_updates table  
* updates routes

## **Phase G4 — Utility Tools**

* trust checker  
* contract generator  
* invoice generator

## **Phase G5 — Quiz/Assessment Module**

* quiz templates \+ result page

## **Phase G6 — Analytics \+ Attribution**

* event schema  
* UTM capture

---

# **20\) ACCEPTANCE CRITERIA (DOC-6 DONE)**

Growth Engine dianggap selesai jika:

* pSEO pages otomatis muncul & indexable (category/city/best)  
* internal linking kuat (directory → category → city → best → alternatives)  
* updates feed berjalan otomatis  
* utility tools menghasilkan shareable output pages  
* quiz module dapat menangkap leads  
* analytics events tercatat dengan schema konsisten  
* caching \+ ISR menjaga lighthouse score tinggi

---

# **END OF DOC-6**

