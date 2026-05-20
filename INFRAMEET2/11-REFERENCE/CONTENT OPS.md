\# INFRAMEET — CONTENT OPS \+ EDITORIAL AUTOMATION SPEC (DOC-10)  
\*\*Version:\*\* v1.0    
\*\*Status:\*\* Engineering Ready    
\*\*Scope:\*\* RSS sources ops, ingestion pipeline, dedupe/canonicalization, scoring/ranking, auto publishing cadence, editorial rules, content quality gating, internal linking automation, sitemap automation    
\*\*Audience:\*\* AI Coder / Growth Engineer / SEO Engineer    
\*\*Goal:\*\* Sistem publikasi autonomous berbasis RSS \+ signals directory, menghasilkan konten berkualitas tinggi untuk SEO/Discover tanpa spam.

\---

\# 1\) CONTENT OPS PHILOSOPHY (WHY THIS EXISTS)

INFRAMEET bukan media biasa.  
Konten bukan untuk “posting artikel”, tapi untuk:  
\- menjaga freshness signals  
\- memperkuat topical authority  
\- membangun internal linking graph  
\- menciptakan traffic loop menuju directory conversion

\*\*Rule:\*\* setiap konten harus berujung ke \*entity discovery\* atau \*trust conversion\*.

\---

\# 2\) CONTENT TYPES (AUTOPUBLISH CATALOG)

\#\# 2.1 Digest Pages (Primary)  
\- Daily digest per category  
\- Daily digest per city (optional)  
\- Weekly digest (optional)

Routes:  
\- \`/digest/\[category\]/\[date\]\`  
\- \`/digest/source/\[source\]/\[date\]\`

\---

\#\# 2.2 Entity Update Pages (Trust Events)  
Content berbasis sistem event (proof approved, claim verified, milestone).

Routes:  
\- \`/updates/\[id\]\`  
\- \`/updates/entity/\[slug\]\`

\---

\#\# 2.3 Explainer Pages (Template Only)  
Non-RSS, templated evergreen:  
\- “How to choose verified provider”  
\- “Proof types explained”  
\- “Trust score methodology”

Routes:  
\- \`/methodology\`  
\- \`/guides/\[slug\]\` (optional)

\---

\#\# 2.4 Tool Output Pages (User Generated Content)  
Output dari tools generator dianggap “content”.

Routes:  
\- \`/tools/\[tool\]/result/\[id\]\`

\---

\# 3\) RSS SOURCE MANAGEMENT (EDITORIAL DATABASE)

\#\# 3.1 Table: rss\_sources  
Fields:  
\- id uuid pk  
\- source\_name  
\- source\_url  
\- rss\_url  
\- category\_slug (primary)  
\- language (id/en)  
\- country\_code  
\- city\_slug (optional)  
\- trust\_level (low/medium/high)  
\- is\_active boolean  
\- crawl\_interval\_minutes (default 60\)  
\- last\_fetched\_at  
\- created\_at

\#\#\# Rules  
\- rss\_sources harus punya category mapping  
\- source trust\_level mempengaruhi scoring item

\---

\#\# 3.2 Source Governance  
Sources dibagi 3 tier:  
\- Tier A: gov / edu / big media  
\- Tier B: industry media / niche blog  
\- Tier C: unknown (strict filtering)

Tier C harus punya threshold lebih tinggi untuk publish.

\---

\# 4\) RSS INGESTION PIPELINE (WORKER FLOW)

\#\# 4.1 Pipeline Steps  
1\. fetch RSS  
2\. parse feed items  
3\. normalize fields  
4\. dedupe check  
5\. canonicalization  
6\. scoring  
7\. store raw item  
8\. decide publish/skip  
9\. add to digest queue

\---

\#\# 4.2 Table: rss\_items\_raw  
Fields:  
\- id uuid pk  
\- source\_id fk  
\- title  
\- description  
\- link\_url  
\- canonical\_url  
\- author  
\- published\_at  
\- content\_hash (sha256)  
\- language  
\- category\_slug  
\- city\_slug (optional)  
\- score float  
\- status enum (new/accepted/rejected/published)  
\- rejection\_reason text  
\- created\_at

\---

\# 5\) DEDUPE \+ CANONICALIZATION SYSTEM (CRITICAL)

\#\# 5.1 Dedupe Keys  
Dedupe harus dilakukan berdasarkan:  
\- canonical\_url  
\- content\_hash (title \+ domain \+ snippet)  
\- similarity match (optional embedding)

If duplicate found:  
\- update \`seen\_count\`  
\- store relation in \`rss\_item\_duplicates\`

\---

\#\# 5.2 Canonical URL Rules  
If \`link\_url\` has:  
\- UTM params  
\- fbclid/gclid  
\- session query

Then strip them.  
Store clean result as \`canonical\_url\`.

\---

\#\# 5.3 Duplicate Table (Optional)  
Table: \`rss\_item\_duplicates\`  
\- id  
\- primary\_item\_id  
\- duplicate\_item\_id  
\- reason  
\- created\_at

\---

\# 6\) CONTENT QUALITY FILTERING (ANTI-SPAM)

\#\# 6.1 Reject Conditions  
Auto reject jika:  
\- title \< 20 chars  
\- description empty  
\- domain blacklisted  
\- contains adult/gambling/phishing keywords  
\- too many uppercase  
\- contains clickbait patterns (optional)  
\- language mismatch

\---

\#\# 6.2 Blacklist / Blocklist Table  
Table: \`blocked\_domains\`  
\- domain  
\- reason  
\- created\_at

Worker must check this table before publish.

\---

\# 7\) SCORING ENGINE (WHAT GETS PUBLISHED)

\#\# 7.1 Base Score Formula  
\`score \= source\_weight \+ freshness\_weight \+ keyword\_weight \+ category\_match\_weight \+ geo\_weight\`

\#\#\# Source Weight  
\- Tier A: \+30  
\- Tier B: \+15  
\- Tier C: \+5

\#\#\# Freshness Weight  
\- \< 6h: \+20  
\- \< 24h: \+10  
\- \< 72h: \+5  
\- \> 7d: \-20

\#\#\# Keyword Weight (Category Dictionary)  
\- match high-intent keywords: \+10  
\- match generic keywords: \+3  
\- no match: \-5

\#\#\# Geo Weight  
If city\_slug matches:  
\- \+10

\---

\#\# 7.2 Publish Threshold  
\- category digest accepted if score \>= 25  
\- city digest accepted if score \>= 35  
\- tier C sources require score \>= 40

\---

\# 8\) DIGEST GENERATION ENGINE

\#\# 8.1 Digest Scheduling  
Daily digest per category:  
\- publish once per day (00:00 local timezone)  
\- optionally 2x per day for high volume categories

\---

\#\# 8.2 Table: digest\_pages  
Fields:  
\- id uuid pk  
\- digest\_type enum (category/source/city)  
\- category\_slug nullable  
\- source\_slug nullable  
\- city\_slug nullable  
\- digest\_date (YYYY-MM-DD)  
\- title  
\- summary  
\- is\_indexable boolean  
\- created\_at

Unique constraint:  
\- digest\_type \+ slug \+ digest\_date

\---

\#\# 8.3 Table: digest\_entries  
Fields:  
\- id uuid pk  
\- digest\_page\_id fk  
\- rss\_item\_id fk rss\_items\_raw  
\- headline  
\- snippet  
\- canonical\_url  
\- source\_name  
\- published\_at  
\- score float  
\- created\_at

\---

\#\# 8.4 Digest Output Rules  
Each digest page contains:  
\- 5–20 entries (depends category volume)  
\- each entry has:  
  \- headline  
  \- snippet 1-2 kalimat  
  \- source badge  
  \- external link

\---

\# 9\) CONTENT TEMPLATE RULES (PORTAL STYLE)

\#\# 9.1 Digest Page Template  
Required blocks:  
1\. H1: “{Category} Digest — {Date}”  
2\. Summary paragraph (templated)  
3\. Headlines list  
4\. “Top Verified Providers in {Category}” section  
5\. Related categories links  
6\. CTA inquiry/search  
7\. Footer

\---

\#\# 9.2 Source Page Template  
Blocks:  
\- Source profile  
\- Latest entries  
\- Related categories

\---

\# 10\) INTERNAL LINKING AUTOMATION (MOST IMPORTANT)

\#\# 10.1 Digest → Directory Linking Rules  
Digest page must auto inject:  
\- Top 5 providers in same category (trust\_score sorted)  
\- Top 5 verified providers in same category  
\- If city digest: providers filtered by city

\---

\#\# 10.2 Update → Directory Linking Rules  
Update page must always link:  
\- entity page  
\- category page  
\- city page  
\- alternatives page

\---

\#\# 10.3 Tool Results → Directory Linking  
Tool result page must link:  
\- best page by inferred category  
\- directory search query auto-filled

\---

\# 11\) AUTO ENTITY MENTION EXTRACTION (OPTIONAL ADVANCED)

\#\# 11.1 Entity Matching  
Worker scans RSS title/snippet for:  
\- entity names  
\- domains  
\- brand keywords

If match found:  
\- add relation table \`content\_entity\_mentions\`

Table:  
\- id  
\- rss\_item\_id  
\- directory\_id  
\- confidence float

\---

\#\# 11.2 Mention Usage  
If digest entry mentions an entity:  
\- show “Related verified profile” card inline

\---

\# 12\) CONTENT MODERATION \+ SAFE PUBLISHING

\#\# 12.1 Sensitive Content Handling  
If item contains:  
\- crime allegation  
\- defamation risk words  
\- “scam/fraud” etc

Then:  
\- mark \`status=rejected\`  
\- reason: \`legal\_risk\`

INFRAMEET must not publish defamation claims.

\---

\#\# 12.2 Neutral Tone Policy  
Digest pages must not add editorial judgment.  
Only:  
\- headline \+ short snippet  
\- link to source  
\- disclaimers

\---

\# 13\) SITEMAP \+ INDEXING AUTOMATION

\#\# 13.1 Sitemap Sources  
Sitemap generator must include:  
\- directory pages (indexable only)  
\- category pages  
\- city pages  
\- best pages  
\- updates pages (indexable)  
\- digest pages (indexable)  
\- tools hub \+ selected tool pages

Exclude:  
\- dashboard routes  
\- admin routes  
\- tool result pages if too many (optional: noindex)

\---

\#\# 13.2 Index Quality Gate  
Digest pages noindex if:  
\- entries \< 5  
\- majority entries from tier C  
\- duplicate-heavy day

\---

\# 14\) ROBOTS.TXT \+ LLM POLICY

\#\# 14.1 robots.txt Rules  
Disallow:  
\- /dashboard  
\- /admin  
\- /api  
\- /tools/\*/result/\* (optional)

Allow:  
\- /digest  
\- /updates  
\- /directory  
\- /category  
\- /city  
\- /best

\---

\#\# 14.2 llms.txt Rules  
\`/llms.txt\` must include:  
\- allowed routes for summarization  
\- canonical rules  
\- contact for takedown requests

\---

\# 15\) PUBLISHING CADENCE STRATEGY (DISCOVER BOOSTER)

\#\# 15.1 Cadence Defaults  
\- 5–20 digest pages/day (category-driven)  
\- 20–100 updates/day (trust event-driven)  
\- tools results: user-driven

\---

\#\# 15.2 Burst Publishing Mode  
Feature flag:  
\- \`FEATURE\_BURST\_MODE\`

If enabled:  
\- publish digest every 6 hours for top categories  
\- increase freshness signals

\---

\# 16\) ANALYTICS \+ CONTENT PERFORMANCE LOOP

\#\# 16.1 Track Content Events  
Events:  
\- digest\_view  
\- digest\_click\_external  
\- digest\_click\_directory  
\- update\_view  
\- update\_click\_directory  
\- rss\_source\_top\_clicked

\---

\#\# 16.2 Content Performance Dashboard (Admin)  
Admin panel \`/admin/content-ops\` (optional):  
\- top digest pages by clicks  
\- sources with highest CTR  
\- categories trending  
\- publish/reject ratio

\---

\# 17\) AUTOMATED CLEANUP / RETENTION

\#\# 17.1 Retention Defaults  
\- rss\_items\_raw older than 180 days → archive or delete  
\- digest\_pages older than 2 years → keep (SEO value)  
\- digest\_entries keep indefinitely (low size)

\---

\# 18\) WORKER JOBS (CONTENT OPS)

\#\# 18.1 Worker Jobs Required  
\- \`fetch\_rss\_sources\_job\`  
\- \`parse\_rss\_items\_job\`  
\- \`dedupe\_rss\_items\_job\`  
\- \`score\_rss\_items\_job\`  
\- \`generate\_daily\_digest\_job\`  
\- \`generate\_source\_digest\_job\`  
\- \`generate\_city\_digest\_job\` (optional)  
\- \`update\_sitemap\_job\`

\---

\#\# 18.2 Worker Failover Rules  
If fetch fails:  
\- retry 3 times  
\- exponential backoff  
\- log to system\_events

\---

\# 19\) OPEN SOURCE \+ LIBRARY RECOMMENDATIONS

\#\# 19.1 RSS Parsing  
\- \`rss-parser\` (Node)  
\- \`fast-xml-parser\`

\#\# 19.2 HTML Metadata Scraping (optional)  
\- \`metascraper\`  
\- \`link-preview-js\`

\#\# 19.3 Canonical URL Cleanup  
\- \`normalize-url\` npm package

\#\# 19.4 Deduping Similarity (optional)  
\- pgvector \+ embeddings  
\- cosine similarity threshold 0.92

\---

\# 20\) ACCEPTANCE CRITERIA (DOC-12 DONE)

Content Ops dianggap selesai jika:

\- RSS sources bisa dikelola via DB table  
\- worker ingestion berjalan otomatis  
\- dedupe \+ canonicalization bekerja  
\- scoring menentukan accepted vs rejected  
\- digest pages dibuat otomatis harian  
\- digest pages link ke directory providers otomatis  
\- sitemap otomatis update  
\- robots/llms policy diterapkan  
\- tidak ada konten spam / defamasi

\---

\# END OF DOC-10

