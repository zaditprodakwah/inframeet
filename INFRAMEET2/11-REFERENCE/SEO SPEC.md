\# INFRAMEET — SEO SPEC \+ INDEXING \+ JSON-LD TEMPLATES (DOC-4)  
\*\*Version:\*\* v1.0    
\*\*Status:\*\* Engineering Ready    
\*\*Scope:\*\* SEO architecture, canonical rules, sitemap strategy, robots policy, schema.org JSON-LD templates    
\*\*Audience:\*\* AI Coder / SEO Engineer    
\*\*Goal:\*\* Menjadikan INFRAMEET SEO-first, scalable indexing, dan tahan duplicate/spam pages.

\---

\# 1\) SEO PRINCIPLES (NON-NEGOTIABLE)

\#\# 1.1 SEO-First Routing  
\- Semua entity harus punya URL stabil:    
  \`/directory/\[slug\]\`  
\- Semua slug harus unique dan immutable (kecuali admin override).

\#\# 1.2 Canonical Discipline  
\- Semua halaman harus punya \`\<link rel="canonical"\>\`  
\- Query params tidak boleh menjadi canonical.

\#\# 1.3 Index Only High-Quality Pages  
Halaman dengan kualitas rendah harus:  
\- noindex  
\- atau diblokir dari sitemap

\---

\# 2\) URL STRUCTURE & ROUTING RULES

\#\# 2.1 Primary Public Routes  
\- \`/\` (landing)  
\- \`/search\`  
\- \`/directory/\[slug\]\`  
\- \`/directory/\[slug\]/proofs\` (optional)  
\- \`/category/\[categorySlug\]\` (recommended)  
\- \`/location/\[country\]/\[city\]\` (optional)

\#\# 2.2 Forbidden SEO Routes  
\- \`/dashboard/\*\` (noindex)  
\- \`/admin/\*\` (noindex)  
\- \`/api/\*\` (blocked)

\---

\# 3\) META TAGS SPEC (PUBLIC PAGES)

\#\# 3.1 Default Meta Template  
Every public page must include:  
\- title  
\- description  
\- canonical  
\- OpenGraph title/description  
\- og:image  
\- twitter card

\---

\#\# 3.2 Title Strategy

\#\#\# Directory Page Title  
Format:  
\`{EntityName} — Trust Profile | INFRAMEET\`

Example:  
\`NetizenSolusi — Trust Profile | INFRAMEET\`

\#\#\# Search Page Title  
\`Search Directory | INFRAMEET\`

\#\#\# Category Page Title  
\`{CategoryName} Directory — Verified Profiles | INFRAMEET\`

\---

\#\# 3.3 Meta Description Strategy

\#\#\# Directory Page Description  
Template:  
\`Lihat profil {EntityName} di INFRAMEET. Status verifikasi: {verification\_status}. Trust Score: {trust\_score}/100. Bukti & review tersedia.\`

Rules:  
\- max 160 chars  
\- jangan keyword stuffing

\---

\# 4\) INDEXING POLICY (NOINDEX RULESET)

\#\# 4.1 Index Allowed (index,follow)  
Index jika:  
\- verification\_status \!= flagged  
\- trust\_score \>= 10 (recommended threshold)  
\- entity memiliki minimal salah satu:  
  \- description length \>= 120 chars  
  \- proofs approved \>= 1  
  \- reviews count \>= 1

\#\# 4.2 Noindex Rules (noindex,nofollow optional)  
Noindex jika:  
\- verification\_status \== flagged  
\- entity is empty listing (metadata\_public kosong)  
\- spam suspected  
\- slug reserved/system  
\- entity soft-deleted

\*\*Implementation Rule:\*\*    
Set flag \`is\_indexable\` di DB untuk mempermudah.

\---

\# 5\) SITEMAP STRATEGY

\#\# 5.1 Required Sitemaps  
\- \`/sitemap.xml\` (index)  
\- \`/sitemap-directory.xml\` (entities)  
\- \`/sitemap-categories.xml\` (categories)  
\- \`/sitemap-static.xml\` (landing/search/about)

\#\# 5.2 Sitemap Inclusion Rules  
Include only:  
\- entities with \`is\_indexable \= true\`  
\- categories with at least 3 entities

Exclude:  
\- flagged  
\- unverified with low trust\_score  
\- empty listings

\---

\# 6\) ROBOTS.TXT POLICY

\#\# 6.1 Recommended robots.txt  
Allow public crawling, block internal pages:

Disallow:  
\- /dashboard/  
\- /admin/  
\- /api/  
\- /auth/  
\- /embed/ (optional)  
\- query-heavy paths

Allow:  
\- /directory/  
\- /search  
\- /category/

\---

\# 7\) OG IMAGE STRATEGY (SOCIAL SHARE LOOP)

\#\# 7.1 Dynamic OG Images  
Generate OG images dynamically:  
\- entity name  
\- trust score  
\- verification badge  
\- short tagline

Endpoint recommended:  
\- \`/api/og/entity?slug=...\`

Caching:  
\- Vercel edge caching recommended

\---

\# 8\) SCHEMA.ORG JSON-LD (MANDATORY FOR DIRECTORY)

\#\# 8.1 Entity Type Mapping  
\- personal → \`Person\`  
\- brand → \`Organization\`  
\- saas → \`SoftwareApplication\` (optional) \+ \`Organization\`  
\- institution → \`EducationalOrganization\` or \`Organization\`

\---

\#\# 8.2 JSON-LD: Person Template  
\`\`\`json  
{  
  "@context": "https://schema.org",  
  "@type": "Person",  
  "name": "{{entity\_name}}",  
  "url": "{{canonical\_url}}",  
  "image": "{{avatar\_url}}",  
  "description": "{{headline\_or\_description}}",  
  "sameAs": \[  
    "{{social.instagram}}",  
    "{{social.linkedin}}",  
    "{{social.youtube}}"  
  \],  
  "address": {  
    "@type": "PostalAddress",  
    "addressCountry": "{{country}}",  
    "addressLocality": "{{city}}"  
  }  
}

---

## **8.3 JSON-LD: Organization Template**

{  
  "@context": "https://schema.org",  
  "@type": "Organization",  
  "name": "{{entity\_name}}",  
  "url": "{{canonical\_url}}",  
  "logo": "{{logo\_url}}",  
  "description": "{{headline\_or\_description}}",  
  "sameAs": \[  
    "{{social.instagram}}",  
    "{{social.linkedin}}",  
    "{{social.website}}"  
  \],  
  "address": {  
    "@type": "PostalAddress",  
    "addressCountry": "{{country}}",  
    "addressLocality": "{{city}}"  
  }  
}

---

## **8.4 JSON-LD: Service Provider (Optional Enhancement)**

Jika entity punya services list:

{  
  "@context": "https://schema.org",  
  "@type": "Service",  
  "name": "{{service\_name}}",  
  "provider": {  
    "@type": "Organization",  
    "name": "{{entity\_name}}",  
    "url": "{{canonical\_url}}"  
  }  
}

---

## **8.5 JSON-LD: AggregateRating (Only if valid)**

Jika reviews count \>= 3:

{  
  "@context": "https://schema.org",  
  "@type": "Organization",  
  "name": "{{entity\_name}}",  
  "aggregateRating": {  
    "@type": "AggregateRating",  
    "ratingValue": "{{avg\_rating}}",  
    "reviewCount": "{{review\_count}}"  
  }  
}

**Hard Rule:**  
Jangan tampilkan AggregateRating jika review\_count kecil (spam risk).

---

# **9\) SEO CONTENT MODEL RULES**

## **9.1 Category System (Recommended)**

Category slug rules:

* lowercase  
* dash only  
* max 40 chars

Example:

* `seo`  
* `web-development`  
* `legal-consulting`

## **9.2 Internal Linking Rules**

Directory page harus link ke:

* category pages  
* location pages  
* related entities (semantic similarity)

Ini penting untuk crawl depth.

---

# **10\) SEARCH PAGE SEO HANDLING**

## **10.1 /search Must be indexable**

/search boleh indexable tetapi:

* canonical harus `/search`  
* query params tidak indexable

Meta rule:

* `noindex` jika query panjang \> 50 chars atau spam pattern

---

# **11\) DUPLICATE CONTENT PREVENTION**

## **11.1 Slug Collision Prevention**

* slug unique index  
* reserved slugs:  
  * admin, dashboard, api, search, directory, login, register

## **11.2 Canonical Enforcement**

Jika slug berubah:

* buat redirect 301  
* simpan old\_slug table (optional)

---

# **12\) PAGE PERFORMANCE RULES (CORE WEB VITALS)**

* LCP \< 2.5s target  
* avoid heavy JS on public pages  
* images must be optimized  
* use lazy loading for reviews list

---

# **13\) INTERNATIONALIZATION (OPTIONAL)**

Jika multilingual:

* add `<link rel="alternate" hreflang="id">`  
* default locale \= id

---

# **14\) SEO AUDIT CHECKLIST (DOC-4)**

AI coder wajib implement:

* canonical tags  
* robots.txt with disallow rules  
* sitemap.xml index \+ child sitemaps  
* JSON-LD injection on directory pages  
* noindex policy for low-quality/flagged pages  
* OG tags \+ dynamic OG image endpoint  
* reserved slug protection

---

# **END OF DOC-4**

