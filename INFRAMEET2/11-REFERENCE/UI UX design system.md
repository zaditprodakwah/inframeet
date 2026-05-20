\# INFRAMEET — UI/UX DESIGN SYSTEM \+ COMPONENT SPEC (DOC-2)  
\*\*Version:\*\* v1.0    
\*\*Status:\*\* Engineering Ready    
\*\*Scope:\*\* UI system, theme, layout, pages, components, copywriting tone, accessibility, personalization UX    
\*\*Audience:\*\* AI Coder / Frontend Builder    
\*\*Goal:\*\* Menghindari UI acak, memastikan konsistensi brand, mempercepat implementasi dashboard \+ public pages.

\---

\# 1\) UI PRINCIPLES (NON-NEGOTIABLE)

\#\# 1.1 Trust-First Visual Hierarchy  
Hal paling penting harus selalu terlihat:  
1\. Identity (nama entity)  
2\. Verification badge  
3\. Trust score  
4\. Proof summary  
5\. Reviews (verified emphasis)  
6\. Inquiry CTA

UI harus memprioritaskan "credibility clarity", bukan estetika semata.

\---

\#\# 1.2 SEO-First Public Pages  
Public pages harus:  
\- cepat render  
\- readable tanpa JS heavy  
\- punya struktur heading yang benar (H1-H2-H3)  
\- schema.org JSON-LD (opsional doc SEO)

\---

\#\# 1.3 Minimal Cognitive Load  
Dashboard harus:  
\- single sidebar navigation  
\- 1 primary CTA per page  
\- progressive disclosure (detail muncul jika dibutuhkan)

\---

\#\# 1.4 Component Reuse Rule  
Tidak boleh membuat button/card baru tanpa memakai komponen standar.

Semua UI wajib berasal dari:  
\- \`/components/ui/\*\` (base)  
\- \`/components/directory/\*\`  
\- \`/components/dashboard/\*\`  
\- \`/components/widgets/\*\`

\---

\# 2\) BRAND THEME SYSTEM

\#\# 2.1 Color System (Semantic Tokens)  
Gunakan semantic tokens, bukan hard-coded.

\#\#\# Required Tokens  
\- \`--bg\` (background)  
\- \`--fg\` (foreground text)  
\- \`--muted\`  
\- \`--muted-fg\`  
\- \`--card\`  
\- \`--border\`  
\- \`--primary\`  
\- \`--primary-fg\`  
\- \`--secondary\`  
\- \`--danger\`  
\- \`--warning\`  
\- \`--success\`  
\- \`--info\`

\#\#\# Usage Rules  
\- \`primary\` dipakai untuk CTA utama  
\- \`danger\` hanya untuk destructive action  
\- \`success\` untuk verified/approved  
\- \`warning\` untuk pending/unverified  
\- \`muted\` untuk meta text

\---

\#\# 2.2 Typography  
Font harus readable dan modern.

\#\#\# Recommended  
\- Inter / Geist / System UI

\#\#\# Type Scale  
\- H1: 32–40px (bold)  
\- H2: 24–28px (semibold)  
\- H3: 18–20px (semibold)  
\- Body: 14–16px  
\- Small: 12–13px

\#\#\# Rules  
\- jangan gunakan font kecil untuk trust score  
\- jangan gunakan all-caps untuk paragraph panjang

\---

\#\# 2.3 Layout Spacing  
\- Default padding card: \`p-4\` atau \`p-6\`  
\- Radius: \`rounded-2xl\` untuk card utama  
\- Shadow: soft shadow (tidak norak)  
\- Grid layout: gunakan \`gap-4\` atau \`gap-6\`

\---

\#\# 2.4 Dark Mode  
Harus tersedia.  
\- public pages default light  
\- dashboard boleh auto mengikuti system

\---

\# 3\) ICONOGRAPHY \+ BADGE SYSTEM

\#\# 3.1 Icon Set  
\- lucide-react recommended

\---

\#\# 3.2 Badge Types (UI Standard)  
Badge harus konsisten.

\#\#\# Badge: Verification Status  
\- \`unverified\` → gray "Unverified"  
\- \`basic\_verified\` → blue "Verified"  
\- \`legal\_verified\` → green "Legal Verified"  
\- \`academic\_verified\` → purple "Academic Verified"  
\- \`premium\_verified\` → gold "Premium Verified"  
\- \`flagged\` → red "Flagged"

\#\#\# Badge: Proof Status  
\- pending → yellow  
\- approved → green  
\- rejected → red  
\- expired → gray

\#\#\# Badge: Escrow Status  
\- HELD → yellow  
\- RELEASED → green  
\- REFUNDED → gray  
\- DISPUTED → red  
\- CANCELLED → muted

\---

\# 4\) CORE COMPONENT LIBRARY (REQUIRED)

\#\# 4.1 Base UI Components (\`/components/ui\`)  
AI coder harus membuat/menyediakan:

\#\#\# Inputs  
\- Button  
\- Input  
\- Textarea  
\- Select  
\- Switch  
\- Checkbox  
\- RadioGroup

\#\#\# Layout  
\- Card  
\- Tabs  
\- Table  
\- Dialog/Modal  
\- Drawer (mobile)  
\- Tooltip  
\- Badge  
\- Separator

\#\#\# Feedback  
\- Toast notifications  
\- Loading spinner  
\- Skeleton loaders  
\- Empty state component

\#\#\# Utilities  
\- CopyToClipboard button  
\- Pagination component  
\- SearchBar component

\---

\#\# 4.2 Domain Components (\`/components/directory\`)  
Harus tersedia:

\- \`TrustScoreCard\`  
\- \`VerificationBadge\`  
\- \`ProofSummary\`  
\- \`ReviewList\`  
\- \`InquiryForm\`  
\- \`EntityHeader\`  
\- \`EntityMetaGrid\`  
\- \`WidgetEmbedSnippet\`

\---

\#\# 4.3 Dashboard Components (\`/components/dashboard\`)  
\- \`DashboardSidebar\`  
\- \`DashboardHeader\`  
\- \`StatsCards\`  
\- \`InquiryInboxTable\`  
\- \`ProofUploadForm\`  
\- \`ClaimStatusCard\`  
\- \`WidgetInstallationsTable\`  
\- \`DangerZonePanel\`

\---

\#\# 4.4 Admin/Verifier Components (\`/components/admin\`)  
\- \`ProofQueueTable\`  
\- \`ClaimQueueTable\`  
\- \`ModerationActionsPanel\`  
\- \`SystemEventsLogTable\`

\---

\# 5\) UI STATES SPEC (MANDATORY)

\#\# 5.1 Loading States  
Semua page harus punya skeleton.

\#\#\# Rule  
\- Jangan pakai spinner full-screen kecuali auth gate.  
\- Gunakan skeleton cards sesuai layout final.

\---

\#\# 5.2 Empty States (Copy Standard)  
Empty state wajib punya:  
\- icon  
\- title  
\- short description  
\- CTA action

\#\#\# Example  
\*\*No proofs yet\*\*  
\- Title: "Belum ada bukti"  
\- Desc: "Upload dokumen atau link untuk meningkatkan trust score."  
\- CTA: "Upload Proof"

\---

\#\# 5.3 Error States  
Error state harus punya:  
\- message manusiawi  
\- retry button  
\- log ke system\_events (backend)

\---

\#\# 5.4 Disabled States  
Jika feature flag off:  
\- tampilkan UI "Feature Disabled" bukan crash.

\---

\# 6\) COPYWRITING STYLE GUIDE

\#\# 6.1 Tone  
\- clean, professional  
\- short sentences  
\- avoid hype  
\- trust-centric

\#\# 6.2 CTA Text Standards  
Gunakan CTA yang jelas:

\- "Send Inquiry"  
\- "Upload Proof"  
\- "Request Claim"  
\- "Generate Widget"  
\- "Copy Embed Code"  
\- "Verify Domain"  
\- "Approve Proof"  
\- "Reject Proof"

\---

\#\# 6.3 Trust Messaging  
Hindari klaim berlebihan seperti:  
\- "100% trusted"  
\- "guaranteed safe"

Gunakan wording:  
\- "Verified"  
\- "Proof Approved"  
\- "Claim Verified"  
\- "Based on submitted evidence"

\---

\# 7\) ACCESSIBILITY SPEC (WCAG BASELINE)

\#\# 7.1 Mandatory Requirements  
\- All buttons must have accessible label  
\- All form inputs must have labels  
\- Keyboard navigation for dialogs & tabs  
\- Contrast ratio minimal AA  
\- Focus ring visible  
\- Error messages attached to inputs

\---

\#\# 7.2 Semantic HTML Rules  
\- H1 hanya 1 di public profile page  
\- gunakan \`\<section\>\` untuk grouping  
\- jangan gunakan \`\<div\>\` untuk button

\---

\#\# 7.3 Table Accessibility  
\- table harus punya header row \`\<th\>\`  
\- pagination accessible

\---

\# 8\) PERSONALIZATION UX (MINIMAL REQUIRED)

\#\# 8.1 Directory Visibility Toggles (Owner)  
Owner harus bisa toggle:

\- show\_contact\_email  
\- show\_whatsapp  
\- show\_reviews  
\- show\_proof\_summary  
\- show\_pricing

Disimpan dalam \`metadata\_public.contact\` dan/atau \`metadata\_public.visibility\`.

\---

\#\# 8.2 Language Preference (Optional but Supported)  
\- ID default  
\- EN optional  
\- minimal string dictionary

\---

\#\# 8.3 Profile Display Mode (Optional)  
\- Formal mode (corporate)  
\- Creator mode (personal brand)

Ini hanya UI variation, bukan data model baru.

\---

\# 9\) PUBLIC PAGE SPEC (PAGE-BY-PAGE)

\#\# 9.1 \`/directory/\[slug\]\` — Entity Profile Page  
\*\*Primary Goal:\*\* Visitor langsung percaya \+ bisa kontak.

\#\#\# Layout Sections (Order)  
1\. \*\*Entity Header\*\*  
   \- Name \+ headline  
   \- Verification badge  
   \- Trust score (big)  
   \- Quick action: "Send Inquiry"  
2\. \*\*Proof Summary\*\*  
   \- Approved proofs only  
   \- Show proof count  
3\. \*\*Services / Categories\*\*  
   \- chips/tags  
4\. \*\*About\*\*  
   \- description long form  
5\. \*\*Reviews\*\*  
   \- Verified reviews highlight  
6\. \*\*Inquiry Form\*\*  
   \- Turnstile required  
7\. \*\*Widget Embed\*\*  
   \- show snippet if owner viewing  
8\. \*\*Footer meta\*\*  
   \- last updated, disclaimers

\#\#\# UI Requirements  
\- trust score harus terlihat tanpa scroll  
\- inquiry CTA harus sticky on mobile

\---

\#\# 9.2 \`/search\` — Search Directory  
\*\*Primary Goal:\*\* menemukan entitas terbaik.

\#\#\# Components  
\- Search bar  
\- Filter dropdown: entity\_type  
\- Sort: trust\_score desc, newest, verified-only  
\- Results list card

\#\#\# Result Card Required Fields  
\- name  
\- badge  
\- trust score mini  
\- short headline  
\- location chips

\---

\#\# 9.3 \`/embed/widget/\[slug\].js\`  
\- bukan halaman UI, tapi endpoint script  
\- harus cacheable dan versioned

\---

\# 10\) DASHBOARD PAGE SPEC

\#\# 10.1 \`/dashboard\` — Overview  
\*\*Sections\*\*  
\- trust score card  
\- verification status progress  
\- leads count  
\- widget click stats (30d)  
\- pending tasks reminders (proof pending, claim pending)

\---

\#\# 10.2 \`/dashboard/entity/\[id\]\` — Edit Profile  
\*\*Tabs\*\*  
\- Profile (name, headline, desc)  
\- Services & categories  
\- Contact & visibility  
\- Social links  
\- Preview public page

\*\*Rule\*\*  
\- auto-save optional  
\- preview must match public rendering

\---

\#\# 10.3 \`/dashboard/proofs\`  
\*\*Primary CTA:\*\* Upload Proof

\*\*Sections\*\*  
\- upload form (title, type, file\_url, source\_url)  
\- proofs table with status badge  
\- verifier notes

\---

\#\# 10.4 \`/dashboard/claim\`  
\*\*Primary CTA:\*\* Request Claim

\*\*Sections\*\*  
\- claim method selection (email / dns / document)  
\- instructions panel (dns TXT copy)  
\- claim status timeline

\---

\#\# 10.5 \`/dashboard/widgets\`  
\*\*Primary CTA:\*\* Generate Widget

\*\*Sections\*\*  
\- widget type selection  
\- preview widget  
\- embed snippet copy  
\- installations list by domain  
\- stats summary

\---

\#\# 10.6 \`/dashboard/inquiries\`  
\*\*Primary CTA:\*\* none (inbox)

\*\*Sections\*\*  
\- inbox table  
\- status filter  
\- view inquiry modal  
\- archive/spam buttons

\---

\#\# 10.7 \`/dashboard/settings\`  
\*\*Sections\*\*  
\- account profile  
\- notifications (optional)  
\- privacy toggles

\---

\# 11\) ADMIN/VERIFIER PAGE SPEC

\#\# 11.1 \`/admin/verifier/proofs\`  
\- pending proofs table  
\- proof preview modal  
\- approve/reject action with reason  
\- audit history

\#\# 11.2 \`/admin/verifier/claims\`  
\- pending claims table  
\- verify method info  
\- approve/reject action

\#\# 11.3 \`/admin/system-events\`  
\- logs table  
\- filter severity  
\- search payload

\---

\# 12\) UI PATTERNS (REUSABLE UX)

\#\# 12.1 Verification Progress UI  
Gunakan progress bar dengan milestone:  
\- basic  
\- legal  
\- academic  
\- premium

Tampilkan:  
\- "Next step" CTA (Upload proof / Claim domain)

\---

\#\# 12.2 Trust Score Visualization  
Gunakan:  
\- large numeric score  
\- label: "Trust Score"  
\- short description tooltip: "Based on approved proofs, claims, reviews, and activity."

Tidak perlu chart kompleks.

\---

\#\# 12.3 Proof Cards  
Proof card minimal:  
\- proof\_type badge  
\- title  
\- status badge  
\- verified\_at if approved  
\- action button: view

\---

\#\# 12.4 Widget Snippet UI  
\- code block monospace  
\- copy button  
\- show installation token hidden by default

\---

\# 13\) RESPONSIVE DESIGN RULES

\#\# 13.1 Mobile First Requirements  
\- sticky inquiry CTA on mobile profile page  
\- sidebar dashboard collapses to drawer  
\- tables become cards on small screens

\#\# 13.2 Layout Breakpoints  
\- sm: 640px  
\- md: 768px  
\- lg: 1024px  
\- xl: 1280px

\---

\# 14\) ANIMATION & MICROINTERACTIONS (LIGHT)

\#\# 14.1 Allowed  
\- hover scale small  
\- fade in cards  
\- slide in drawer  
\- toast notifications

\#\# 14.2 Forbidden  
\- heavy parallax  
\- animated background noise  
\- too many transitions

\---

\# 15\) DESIGN TOKENS (IMPLEMENTATION CONTRACT)

AI coder harus membuat \`tokens.ts\` atau CSS variables untuk:  
\- colors  
\- font sizes  
\- spacing  
\- border radius  
\- shadows

Semua komponen wajib menggunakan tokens.

\---

\# 16\) COMPONENT NAMING CONVENTION

\- PascalCase  
\- Prefix domain:  
  \- \`Directory\*\`  
  \- \`Dashboard\*\`  
  \- \`Admin\*\`  
  \- \`Widget\*\`

\---

\# 17\) REQUIRED UI CHECKLIST (DOC-2)

AI coder wajib implement minimal:

\- \[ \] Layout system (PublicLayout, DashboardLayout, AdminLayout)  
\- \[ \] Sidebar \+ mobile drawer  
\- \[ \] TrustScoreCard \+ VerificationBadge  
\- \[ \] Proof upload UI \+ list UI  
\- \[ \] Claim request UI \+ status UI  
\- \[ \] Inquiry form UI \+ inbox table UI  
\- \[ \] Widget snippet generator UI  
\- \[ \] Skeleton loaders & empty states  
\- \[ \] Toast notifications  
\- \[ \] Accessibility baseline (labels, focus, keyboard)

—

\*\*Scope:\*\* Full frontend UX system: public pages \+ dashboard UX \+ growth UX \+ performance UX    
\*\*Audience:\*\* AI Coder / Frontend Engineer    
\*\*Goal:\*\* UI modern minimalis elegan, cepat, interaktif, trust-first, SEO-ready, mobile-native feel.

\---

\# 1\) DESIGN INTENT (BRAND FEEL)

\#\# 1.1 Personality  
\- Modern, minimal, premium  
\- Familiar seperti SaaS (Stripe/Notion/Vercel vibe)  
\- Friendly tapi tidak “jualan”  
\- Trust-centric (credibility \> aesthetics)

\#\# 1.2 Key UX Feeling  
User harus merasa:  
\- “ini platform serius”  
\- “mudah menemukan yang terpercaya”  
\- “proses verifikasi jelas”  
\- “tidak membingungkan”

\---

\# 2\) UI PRINCIPLES (NON-NEGOTIABLE)

\#\# 2.1 Trust-First Layout  
Semua halaman entity harus menampilkan:  
\- Verification Badge  
\- Trust Score  
\- Proof Summary  
\- Inquiry CTA

Above the fold wajib.

\#\# 2.2 Fast \+ Calm UI  
\- animasi halus, bukan rame  
\- tidak boleh loading panjang tanpa skeleton  
\- gunakan micro-interaction subtle

\#\# 2.3 Progressive Disclosure  
Detail kompleks (proof detail, logs, audit trail) tidak ditampilkan sekaligus.  
Gunakan:  
\- collapsible sections  
\- tabs  
\- modal preview

\---

\# 3\) DESIGN SYSTEM (TOKENS \+ STYLE RULES)

\#\# 3.1 Spacing System  
Gunakan spacing scale konsisten:  
\- 4, 8, 12, 16, 24, 32, 48, 64

Card padding:  
\- desktop: 24px  
\- mobile: 16px

\#\# 3.2 Radius \+ Shadow  
\- Primary cards: rounded-2xl  
\- Inputs: rounded-xl  
\- Buttons: rounded-xl  
\- Shadow: soft shadow only

\#\# 3.3 Typography  
\- Headline bold  
\- Body readable (16px default)  
\- Line height 1.6 untuk readability

\*\*Rule:\*\* jangan buat font kecil untuk trust score.

\#\# 3.4 Color Semantics  
Token-based:  
\- primary (CTA)  
\- success (verified)  
\- warning (pending)  
\- danger (flagged)  
\- muted (meta)

\---

\# 4\) CORE LAYOUT COMPONENTS (MANDATORY)

\#\# 4.1 Layout Components  
\- \`PublicLayout\`  
\- \`DashboardLayout\`  
\- \`AdminLayout\`

\#\# 4.2 Global Elements  
\- Navbar (desktop)  
\- Mobile Navbar (bottom or drawer)  
\- Footer (public)  
\- Sidebar (dashboard/admin)  
\- Breadcrumb (optional but recommended)  
\- Progress indicator bar (verification steps)

\---

\# 5\) NAVIGATION SYSTEM (MODERN \+ MEGA MENU)

\#\# 5.1 Desktop Navbar  
Left:  
\- Logo  
\- Search (inline search bar)

Right:  
\- Explore (mega menu)  
\- Tools  
\- Updates  
\- Leaderboard  
\- Sign In / Dashboard CTA

\#\#\# Desktop Mega Menu (Explore)  
Mega menu harus menampilkan:  
\- Popular Categories (chips)  
\- Top Cities  
\- Featured Entities (top trust\_score)  
\- Quick links:  
  \- Verified only  
  \- Best in City  
  \- New listings

\*\*Interaction:\*\*  
\- hover open  
\- click to pin (accessible)  
\- keyboard navigation required

\---

\#\# 5.2 Mobile Navigation (Native App Feel)  
Mobile wajib punya:  
\- top minimal navbar (logo \+ search icon)  
\- bottom navigation bar (recommended)

\#\#\# Bottom Nav Tabs  
\- Home  
\- Search  
\- Tools  
\- Updates  
\- Profile/Dashboard

\*\*Rule:\*\*  
Jika user login, tab terakhir berubah jadi Dashboard.

\---

\#\# 5.3 Dashboard Sidebar  
Sidebar collapsible.  
Mobile dashboard sidebar harus menjadi drawer.

Menu harus role-aware:  
\- owner menu  
\- verifier menu  
\- admin menu

\---

\# 6\) PAGES SPEC (PUBLIC WEBSITE)

\#\# 6.1 Homepage \`/\`  
\*\*Goal:\*\* jelaskan value \+ entry points.

\#\#\# Layout Blocks  
1\. Hero section  
   \- H1: “Trust Infrastructure for People & Businesses”  
   \- Sub: “Proof-based verification \+ claim ownership \+ growth widgets.”  
   \- CTA1: Search Directory  
   \- CTA2: Create Profile

2\. Quick Search Panel (search bar big)  
3\. Proof/Claim explainer cards (3 cards)  
4\. Featured categories grid  
5\. Featured verified entities list  
6\. Trust Score explainer section  
7\. Tools teaser section (viral tools)  
8\. Footer

\*\*UX Notes\*\*  
\- hero CTA sticky on mobile  
\- homepage should load \< 2 seconds

\---

\#\# 6.2 Search \`/search\`  
\*\*Goal:\*\* user menemukan provider.

\#\#\# Components  
\- search bar with suggestions  
\- filters (category, city, verified-only)  
\- sort dropdown  
\- results list (cards)  
\- pagination / infinite scroll

\#\#\# Smart UX  
\- show “verified-first”  
\- show “top results in your city” if geo detected

\---

\#\# 6.3 Directory Profile \`/directory/\[slug\]\`  
\*\*Goal:\*\* trust \+ inquiry conversion.

\#\#\# Above Fold Layout  
\- Name \+ badge \+ trust score  
\- proof summary (mini)  
\- CTA Inquiry  
\- CTA Copy Link  
\- CTA Save/Bookmark (optional)

\#\#\# Sections  
\- Quick Facts  
\- Proofs Summary (approved only)  
\- Services/Categories  
\- About  
\- Reviews  
\- Inquiry Form (captcha)  
\- Alternatives (internal linking)  
\- Footer

\#\#\# Sticky CTA  
Mobile: sticky button “Send Inquiry”.

\---

\#\# 6.4 Category Page \`/category/\[slug\]\`  
\*\*Goal:\*\* pSEO \+ conversion.

\#\#\# Blocks  
\- intro paragraph  
\- top providers list  
\- verified providers section  
\- FAQ  
\- related categories  
\- related cities

\---

\#\# 6.5 City Page \`/city/\[country\]/\[city\]\`  
\*\*Goal:\*\* pSEO local \+ GEO.

\#\#\# Blocks  
\- top providers in city  
\- category chips  
\- recently verified in city (freshness)  
\- FAQ  
\- nearby cities

\---

\#\# 6.6 Best Page \`/best/\[category\]/in/\[city\]\`  
\*\*Goal:\*\* high intent page.

\#\#\# Blocks  
\- ranking methodology  
\- top list  
\- filters (verified-only)  
\- CTA claim profile

\---

\#\# 6.7 Updates Feed \`/updates\`  
\*\*Goal:\*\* Google Discover engine.

\#\#\# Blocks  
\- trending updates  
\- filter by category/city  
\- update cards with timestamp  
\- entity link CTA

\---

\#\# 6.8 Tools Hub \`/tools\`  
\*\*Goal:\*\* viral utility center.

\#\#\# Blocks  
\- tools cards grid  
\- categories of tools  
\- CTA “Generate share link”

\---

\#\# 6.9 Tool Result Pages \`/tools/\[tool\]/\[id\]\`  
\*\*Goal:\*\* shareable output.

\#\#\# Requirements  
\- OG image dynamic  
\- share buttons  
\- CTA: claim profile / search provider

\---

\#\# 6.10 Leaderboard \`/leaderboard\`  
\*\*Goal:\*\* gamification viral loop.

\#\#\# Blocks  
\- global top entities  
\- by category filter  
\- by city filter  
\- badges displayed

\---

\#\# 6.11 About \`/about\`  
\*\*Goal:\*\* trust for platform itself.

Content:  
\- mission  
\- how verification works  
\- disclaimers  
\- transparency statement

\---

\#\# 6.12 Contact \`/contact\`  
\*\*Goal:\*\* partnership \+ support.

Components:  
\- contact form (captcha)  
\- email link  
\- social links  
\- partnership CTA

\---

\#\# 6.13 Legal Pages \`/legal/\*\`  
Mandatory:  
\- \`/legal/privacy-policy\`  
\- \`/legal/terms\`  
\- \`/legal/disclaimer\`  
\- \`/legal/copyright\`  
\- \`/legal/dmca\` (optional)  
\- \`/legal/data-retention\` (optional)

\*\*UX Rule:\*\*  
legal pages harus readable (typography besar, max width).

\---

\#\# 6.14 Letter Generator Page (Legal Letter Utility)  
Route:  
\- \`/legal/letter-generator\`

Output:  
\- template surat kerja sama / surat pernyataan / surat invoice  
\- downloadable (optional PDF)

\---

\# 7\) PAGES SPEC (DASHBOARD / APP)

\#\# 7.1 Dashboard Home \`/dashboard\`  
\*\*Goal:\*\* show progress \+ next steps.

\#\#\# Must Show  
\- trust score card  
\- verification progress bar  
\- next action CTA  
\- leads summary  
\- proof pipeline summary  
\- widget stats

\---

\#\# 7.2 Entity Editor \`/dashboard/entity/\[id\]\`  
Wizard-like UX recommended.

\#\#\# Tabs  
\- Profile  
\- Services  
\- Contact & Visibility  
\- Proofs shortcut  
\- Preview

\#\#\# Progress Bar  
Progress indicator:  
\- profile completeness %  
\- verification completeness %

\---

\#\# 7.3 Proofs \`/dashboard/proofs\`  
\- upload proof form  
\- proof list  
\- proof status timeline  
\- reject reason shown clearly

\---

\#\# 7.4 Claims \`/dashboard/claim\`  
Wizard flow:  
1\) choose method  
2\) show instructions  
3\) verify progress  
4\) success state

\---

\#\# 7.5 Widgets \`/dashboard/widgets\`  
\- widget generator \+ preview  
\- embed snippet copy  
\- installation list  
\- stats

\---

\#\# 7.6 Inquiries \`/dashboard/inquiries\`  
Inbox experience:  
\- filter (new/read/spam)  
\- quick reply buttons (copy template)  
\- export CSV (optional)

\---

\# 8\) ADMIN / VERIFIER UI SPEC

\#\# 8.1 Proof Queue \`/admin/proofs\`  
\- table \+ preview modal  
\- approve/reject with reason required  
\- quick tags (legal/academic/etc)

\#\# 8.2 Claim Queue \`/admin/claims\`  
\- claim method display  
\- approve/reject

\#\# 8.3 Moderation \`/admin/moderation\`  
\- flagged entities list  
\- block inquiry button  
\- block widget button

\#\# 8.4 System Events \`/admin/system-events\`  
\- logs table  
\- severity filter  
\- JSON modal viewer

\---

\# 9\) COMPONENT SPEC (UI KIT \+ DOMAIN COMPONENTS)

\#\# 9.1 Base UI Components (Required)  
\- Button  
\- Input  
\- Textarea  
\- Select  
\- Badge  
\- Card  
\- Tabs  
\- Modal/Dialog  
\- Drawer  
\- DropdownMenu  
\- Tooltip  
\- Table  
\- Pagination  
\- Skeleton  
\- Toast  
\- ProgressBar  
\- Stepper

\---

\#\# 9.2 Domain Components (Required)  
\- \`TrustScoreCard\`  
\- \`VerificationBadge\`  
\- \`VerificationProgressStepper\`  
\- \`ProofSummaryCard\`  
\- \`ProofListTable\`  
\- \`InquiryFormCard\`  
\- \`InquiryInboxTable\`  
\- \`WidgetPreview\`  
\- \`WidgetSnippetBox\`  
\- \`ClaimWizard\`  
\- \`EntityUpdateCard\`  
\- \`LeaderboardTable\`  
\- \`ToolCard\`

\---

\# 10\) COPY/CONTENT STYLE GUIDE (TRUST-FIRST)

\#\# 10.1 Tone  
\- clear  
\- short  
\- factual  
\- transparent

Avoid:  
\- “100% trusted”  
\- “guaranteed”  
\- “best ever”

Use:  
\- “Verified”  
\- “Based on submitted proofs”  
\- “Last verified on …”

\---

\#\# 10.2 Standard Copy Snippets  
\#\#\# Trust Score Tooltip  
“Trust Score dihitung dari bukti yang diverifikasi, klaim kepemilikan, dan aktivitas terkonfirmasi.”

\#\#\# Proof Disclaimer  
“Bukti ini telah diperiksa oleh verifier. Informasi tetap dapat berubah.”

\#\#\# Flagged Warning  
“Profil ini ditandai karena indikasi penyalahgunaan. Harap berhati-hati.”

\---

\# 11\) ANIMATIONS \+ TRANSITIONS (MODERN BUT LIGHT)

\#\# 11.1 Animation Library  
Recommended:  
\- Framer Motion

\#\# 11.2 Allowed Motion Patterns  
\- fade \+ slide up cards  
\- hover micro-scale  
\- smooth drawer slide  
\- progress bar animation  
\- skeleton shimmer

\#\# 11.3 Forbidden  
\- parallax heavy  
\- infinite looping background animation  
\- loading spinner tanpa skeleton

\---

\# 12\) INTERACTIVITY SPEC (SMART UX)

\#\# 12.1 Search Suggestions  
Search bar harus punya:  
\- popular queries  
\- recent searches (local storage)  
\- suggested categories

\#\# 12.2 Smart Filters  
Filters harus “sticky” pada search page.  
Mobile filter harus bottom sheet.

\#\# 12.3 Inline Editing (Dashboard)  
Entity editor bisa:  
\- inline add/remove category chips  
\- reorder services list drag-drop (optional)

\---

\# 13\) PERSONALIZATION UX

\#\# 13.1 Geo-Aware Defaults  
Jika user geo detected:  
\- homepage tampilkan “Top in your city”  
\- search default city filter

\#\# 13.2 Saved Entities (Bookmark)  
Logged in user bisa bookmark entity.  
Route:  
\- \`/dashboard/bookmarks\` (optional)

\---

\# 14\) ACCESSIBILITY (WCAG BASELINE)

Mandatory:  
\- keyboard nav for mega menu  
\- focus ring visible  
\- aria-label untuk icons  
\- color contrast AA  
\- semantic headings  
\- skip-to-content link

\---

\# 15\) RESPONSIVE STRATEGY (DEVICE-FIRST)

\#\# 15.1 Breakpoints  
\- 360px (small)  
\- 640px  
\- 768px  
\- 1024px  
\- 1280px

\#\# 15.2 Layout Rules  
\- tables → cards on mobile  
\- sidebar → drawer on mobile  
\- CTA sticky bottom on mobile directory page

\---

\# 16\) PERFORMANCE SPEC (CORE WEB VITALS)

\#\# 16.1 Public Page Rendering  
\- Server Components for public  
\- ISR caching (revalidate)  
\- minimize JS bundle

\#\# 16.2 Images  
\- Next/Image mandatory  
\- OG image generated server-side  
\- lazy load below fold

\#\# 16.3 Fonts  
\- local fonts preferred  
\- preload main font  
\- avoid multiple weights

\#\# 16.4 Caching Headers  
\- widget script must be cacheable  
\- tool result pages cacheable

\---

\# 17\) ADVANCED GROWTH UX HACKS (BUILT-IN)

\#\# 17.1 Progress-Based Onboarding  
Owner dashboard harus punya “Setup Checklist”:  
\- Add description  
\- Add services  
\- Upload proof  
\- Request claim  
\- Generate widget

Dengan progress bar %.

\#\# 17.2 “Share Profile” Viral CTA  
Setelah proof approved:  
\- show modal “Share your verified profile”  
\- copy link \+ share to WhatsApp/Telegram

\#\# 17.3 Trust Badge Embed as Marketing  
Widget generator harus memberikan 2 output:  
\- script embed  
\- static badge image embed (fallback)

\#\# 17.4 Compare Page Auto Suggestions  
Directory page harus punya:  
\- “Compare with similar providers”  
Auto generate compare links.

\#\# 17.5 Tools as Lead Magnet  
Tool results page wajib punya:  
\- “Find verified providers for this need”  
Auto link to category/city pages.

\---

\# 18\) SEO FILES (AUTOGENERATED)

\#\# 18.1 Dynamic sitemap.xml  
Sitemap harus include:  
\- directory pages indexable  
\- category pages  
\- city pages  
\- updates pages  
\- tools pages (optional)

\#\# 18.2 robots.txt  
Block:  
\- /dashboard  
\- /admin  
\- /api

Allow:  
\- /directory  
\- /category  
\- /city  
\- /updates  
\- /tools

\#\# 18.3 llms.txt (AI Crawler Guidance)  
Create \`/llms.txt\` with:  
\- project description  
\- allowed crawl routes  
\- canonical rules  
\- contact email

\---

\# 19\) FOOTER SPEC (TRUST FOOTER)

Footer harus menampilkan:  
\- About  
\- Legal pages  
\- Sitemap link  
\- Contact  
\- “Verification methodology”  
\- Social links

Minimal tapi authoritative.

\---

\# 20\) ACCEPTANCE CRITERIA (DOC-10 DONE)

Frontend dianggap sesuai spec jika:  
\- mobile navbar terasa native  
\- mega menu desktop usable \+ accessible  
\- onboarding checklist \+ progress bar berjalan  
\- semua pages punya skeleton loading  
\- typography readable dan tidak cramped  
\- lighthouse public pages \>= 90  
\- directory pages above fold menampilkan trust score \+ badge \+ CTA  
\- sitemap/robots/llms.txt tersedia dan valid

\---

\*\*Scope:\*\* Full page map, wireframe layout blocks, component hierarchy, navigation rules, routing rules, portal-style content publishing system (RSS/digest)    
\*\*Audience:\*\* AI Coder / Frontend Architect    
\*\*Goal:\*\* AI coder tidak improvisasi liar. Semua halaman punya struktur UI yang jelas, reusable, scalable, dan SEO-ready.

\---

\# 1\) ROUTE MAP (FULL)

\#\# 1.1 Public Pages (Portal Layer)  
\- \`/\` (Homepage)  
\- \`/search\`  
\- \`/directory/\[slug\]\`  
\- \`/category/\[slug\]\`  
\- \`/category/\[slug\]/verified\`  
\- \`/city/\[country\]/\[citySlug\]\`  
\- \`/best/\[category\]/in/\[citySlug\]\`  
\- \`/compare/\[slugA\]-vs-\[slugB\]\`  
\- \`/leaderboard\`  
\- \`/leaderboard/\[categorySlug\]\`  
\- \`/leaderboard/\[citySlug\]\`

\#\# 1.2 Content / Publishing Layer (RSS \+ Discover)  
\- \`/updates\`  
\- \`/updates/\[id\]\`  
\- \`/updates/entity/\[slug\]\`  
\- \`/updates/category/\[slug\]\`  
\- \`/updates/city/\[citySlug\]\`

\#\#\# Digest / RSS Pages  
\- \`/digest\`  
\- \`/digest/\[categorySlug\]\`  
\- \`/digest/\[categorySlug\]/\[yyyy-mm-dd\]\`  
\- \`/digest/source/\[sourceSlug\]\`  
\- \`/digest/source/\[sourceSlug\]/\[yyyy-mm-dd\]\`  
\- \`/digest/\[categorySlug\]/rss.xml\` (optional)

\#\# 1.3 Tools (Utility Growth Pages)  
\- \`/tools\`  
\- \`/tools/trust-score-checker\`  
\- \`/tools/invoice-generator\`  
\- \`/tools/contract-generator\`  
\- \`/tools/partnership-checklist\`  
\- \`/tools/seo-audit-lite\`  
\- \`/tools/\[toolSlug\]/result/\[resultId\]\`

\#\# 1.4 Static Trust Pages  
\- \`/about\`  
\- \`/contact\`  
\- \`/partners\`  
\- \`/methodology\` (trust score methodology page)

\#\# 1.5 Legal Pages  
\- \`/legal/privacy-policy\`  
\- \`/legal/terms\`  
\- \`/legal/disclaimer\`  
\- \`/legal/copyright\`  
\- \`/legal/letter-generator\`

\#\# 1.6 Auth Pages  
\- \`/login\`  
\- \`/register\`  
\- \`/forgot-password\`

\#\# 1.7 Dashboard (Owner/User)  
\- \`/dashboard\`  
\- \`/dashboard/entities\`  
\- \`/dashboard/entity/\[id\]\`  
\- \`/dashboard/proofs\`  
\- \`/dashboard/claim\`  
\- \`/dashboard/widgets\`  
\- \`/dashboard/inquiries\`  
\- \`/dashboard/settings\`

\#\# 1.8 Admin/Verifier  
\- \`/admin\`  
\- \`/admin/proofs\`  
\- \`/admin/claims\`  
\- \`/admin/moderation\`  
\- \`/admin/system-events\`  
\- \`/admin/feature-flags\` (optional)  
\- \`/admin/worker-jobs\` (optional)

\---

\# 2\) NAVIGATION WIREFRAME MAP

\#\# 2.1 Global Navbar Structure (Desktop)  
Left:  
\- Logo  
\- Search input inline

Center:  
\- Explore (Mega menu)  
\- Updates  
\- Tools

Right:  
\- Leaderboard  
\- Login/Dashboard CTA

Mega Menu Sections:  
\- Categories grid (top 12\)  
\- Cities list (top 10\)  
\- Featured verified entities (top 5\)  
\- Quick links (best/verified/new)

\---

\#\# 2.2 Mobile Navigation Structure  
Top:  
\- Logo \+ Search icon \+ Menu icon

Bottom Tab Bar:  
\- Home  
\- Search  
\- Updates  
\- Tools  
\- Profile/Dashboard

Menu Drawer (hamburger):  
\- About  
\- Methodology  
\- Contact  
\- Legal

\---

\# 3\) PAGE WIREFRAME \+ COMPONENT TREE (PUBLIC)

\---

\# 3.1 Homepage \`/\`

\#\# Wireframe Blocks (Top to Bottom)  
1\. Navbar  
2\. Hero Section  
3\. Quick Search Panel  
4\. Category Grid  
5\. Verified Highlights Carousel  
6\. Trust Methodology Explainer  
7\. Updates Preview Feed (freshness)  
8\. Tools Preview  
9\. Digest Preview (RSS content hub)  
10\. Footer

\#\# Component Tree  
\- \`PublicLayout\`  
  \- \`Navbar\`  
    \- \`Logo\`  
    \- \`SearchBarInline\`  
    \- \`MegaMenuExplore\`  
    \- \`NavLinks\`  
    \- \`AuthCTAButton\`  
  \- \`HeroSection\`  
    \- \`HeroHeadline\`  
    \- \`HeroSubtext\`  
    \- \`PrimaryCTA\`  
    \- \`SecondaryCTA\`  
  \- \`QuickSearchPanel\`  
    \- \`SearchInput\`  
    \- \`FilterChips\`  
  \- \`CategoryGrid\`  
    \- \`CategoryCard\[\]\`  
  \- \`FeaturedVerifiedCarousel\`  
    \- \`EntityMiniCard\[\]\`  
  \- \`TrustExplainerSection\`  
    \- \`TrustScoreExplainerCard\[\]\`  
  \- \`UpdatesPreviewFeed\`  
    \- \`UpdateCard\[\]\`  
  \- \`ToolsPreviewGrid\`  
    \- \`ToolCard\[\]\`  
  \- \`DigestPreviewSection\`  
    \- \`DigestCard\[\]\`  
  \- \`Footer\`

\---

\# 3.2 Search Page \`/search\`

\#\# Wireframe Blocks  
1\. Search bar large  
2\. Filter panel (left desktop, bottom sheet mobile)  
3\. Result list  
4\. Pagination

\#\# Component Tree  
\- \`PublicLayout\`  
  \- \`SearchHeader\`  
    \- \`SearchBar\`  
    \- \`SearchSuggestionsDropdown\`  
  \- \`SearchFilters\`  
    \- \`CategoryFilter\`  
    \- \`CityFilter\`  
    \- \`VerifiedToggle\`  
    \- \`SortDropdown\`  
  \- \`SearchResults\`  
    \- \`EntityResultCard\[\]\`  
  \- \`Pagination\`

\---

\# 3.3 Directory Page \`/directory/\[slug\]\`

\#\# Wireframe Blocks  
\#\#\# Above Fold (Critical)  
1\. Entity Header (name \+ badge \+ trust score)  
2\. Quick Facts row  
3\. Proof Summary compact  
4\. Primary CTA Inquiry (sticky mobile)

\#\#\# Mid Page  
5\. Services/Tags chips  
6\. Proofs list preview  
7\. Reviews preview  
8\. Timeline / Updates for this entity  
9\. Alternatives section

\#\#\# Bottom  
10\. Inquiry form (full)  
11\. Footer

\#\# Component Tree  
\- \`PublicLayout\`  
  \- \`DirectoryHero\`  
    \- \`EntityTitle\`  
    \- \`VerificationBadge\`  
    \- \`TrustScoreCard\`  
    \- \`CTAInquiryButton\`  
    \- \`ShareButton\`  
  \- \`QuickFactsRow\`  
    \- \`FactItem\[\]\`  
  \- \`ProofSummaryCard\`  
    \- \`ProofCountBadge\`  
    \- \`LastVerifiedDate\`  
    \- \`ViewAllProofsButton\`  
  \- \`ServiceChips\`  
    \- \`Chip\[\]\`  
  \- \`ProofPreviewSection\`  
    \- \`ProofCard\[\]\`  
  \- \`ReviewsPreviewSection\`  
    \- \`ReviewCard\[\]\`  
  \- \`EntityTimelineSection\`  
    \- \`EntityUpdateCard\[\]\`  
  \- \`AlternativesSection\`  
    \- \`EntityMiniCard\[\]\`  
  \- \`InquiryFormSection\`  
    \- \`InquiryForm\`  
      \- \`CaptchaWidget\`  
  \- \`Footer\`

\*\*Sticky Mobile Component\*\*  
\- \`StickyInquiryCTA\`

\---

\# 3.4 Category Page \`/category/\[slug\]\`

\#\# Wireframe Blocks  
1\. Category header \+ description  
2\. Top providers list  
3\. Verified only section  
4\. FAQ block  
5\. Related categories  
6\. Related cities

\#\# Component Tree  
\- \`PublicLayout\`  
  \- \`CategoryHero\`  
  \- \`CategoryTopList\`  
    \- \`EntityResultCard\[\]\`  
  \- \`VerifiedSection\`  
  \- \`FAQBlock\`  
  \- \`InternalLinksSection\`  
    \- \`CategoryLinks\`  
    \- \`CityLinks\`

\---

\# 3.5 City Page \`/city/\[country\]/\[citySlug\]\`

\#\# Wireframe Blocks  
1\. City header \+ intro  
2\. Category chips in city  
3\. Top providers list  
4\. Recently verified feed  
5\. FAQ  
6\. Nearby cities

\#\# Component Tree  
\- \`PublicLayout\`  
  \- \`CityHero\`  
  \- \`CityCategoryChips\`  
  \- \`CityTopProviders\`  
  \- \`RecentlyVerifiedFeed\`  
    \- \`UpdateCard\[\]\`  
  \- \`FAQBlock\`  
  \- \`NearbyCitiesSection\`

\---

\# 3.6 Best Page \`/best/\[category\]/in/\[citySlug\]\`

\#\# Wireframe Blocks  
1\. Title \+ “ranking methodology”  
2\. Top list (ranked)  
3\. Verified-only toggle  
4\. FAQ  
5\. CTA claim profile

\#\# Component Tree  
\- \`PublicLayout\`  
  \- \`BestHero\`  
  \- \`RankingMethodologyCard\`  
  \- \`RankedEntityList\`  
    \- \`RankedEntityCard\[\]\`  
  \- \`FAQBlock\`  
  \- \`CTAClaimSection\`

\---

\# 3.7 Compare Page \`/compare/\[slugA\]-vs-\[slugB\]\`

\#\# Wireframe Blocks  
1\. Compare header  
2\. Compare table (trust score, verified, proofs, reviews)  
3\. Pros/Cons summary (neutral)  
4\. Alternatives list  
5\. CTA inquiry

\#\# Component Tree  
\- \`PublicLayout\`  
  \- \`CompareHero\`  
  \- \`CompareTable\`  
  \- \`CompareSummaryNeutral\`  
  \- \`AlternativesSection\`  
  \- \`CTAInquirySplit\`

\---

\# 3.8 Leaderboard \`/leaderboard\`

\#\# Wireframe Blocks  
1\. Title \+ explanation  
2\. Filters (category/city)  
3\. Leaderboard table  
4\. CTA join directory

\#\# Component Tree  
\- \`PublicLayout\`  
  \- \`LeaderboardHero\`  
  \- \`LeaderboardFilters\`  
  \- \`LeaderboardTable\`  
  \- \`JoinCTA\`

\---

\# 4\) CONTENT PORTAL WIREFRAME (UPDATES \+ DIGEST)

\---

\# 4.1 Updates Feed \`/updates\`

\#\# Wireframe Blocks  
1\. Header \+ filter tabs (global/category/city/entity)  
2\. Trending updates list  
3\. Infinite scroll  
4\. Newsletter CTA (optional)

\#\# Component Tree  
\- \`PublicLayout\`  
  \- \`UpdatesHero\`  
  \- \`UpdatesFilterTabs\`  
  \- \`UpdatesList\`  
    \- \`UpdateCard\[\]\`  
  \- \`LoadMoreButton\`  
  \- \`Footer\`

\---

\# 4.2 Update Detail \`/updates/\[id\]\`

\#\# Wireframe Blocks  
1\. Update headline \+ timestamp  
2\. Summary  
3\. Related entity highlight  
4\. Related updates  
5\. CTA: view directory

\#\# Component Tree  
\- \`PublicLayout\`  
  \- \`UpdateDetailHeader\`  
  \- \`UpdateBody\`  
  \- \`EntityHighlightCard\`  
  \- \`RelatedUpdates\`  
  \- \`Footer\`

\---

\# 4.3 Digest Hub \`/digest\`

\#\# Purpose  
Portal halaman seperti media:  
\- menampilkan “daily digest”  
\- mengarahkan ke category digests  
\- internal linking ke directory providers

\#\# Wireframe Blocks  
1\. Digest hero  
2\. Latest digests by category  
3\. Trending sources  
4\. Top verified entities today  
5\. Footer

\#\# Component Tree  
\- \`PublicLayout\`  
  \- \`DigestHero\`  
  \- \`LatestDigestGrid\`  
    \- \`DigestCard\[\]\`  
  \- \`SourceListSection\`  
    \- \`SourceBadge\[\]\`  
  \- \`TopEntitiesToday\`  
  \- \`Footer\`

\---

\# 4.4 Digest Category \`/digest/\[categorySlug\]\`

\#\# Wireframe Blocks  
1\. Category digest header  
2\. Daily digest timeline list  
3\. Subscribe RSS button  
4\. Top providers in this category  
5\. Footer

\#\# Component Tree  
\- \`PublicLayout\`  
  \- \`DigestCategoryHero\`  
  \- \`DigestTimelineList\`  
    \- \`DigestDayCard\[\]\`  
  \- \`SubscribeRSSButton\`  
  \- \`CategoryTopProviders\`  
  \- \`Footer\`

\---

\# 4.5 Digest Day Detail \`/digest/\[categorySlug\]/\[yyyy-mm-dd\]\`

\#\# Wireframe Blocks  
1\. Title \+ date  
2\. Headlines list (5-20)  
3\. Each headline has:  
   \- source  
   \- short summary  
   \- external link  
4\. Related providers section  
5\. Related digests

\#\# Component Tree  
\- \`PublicLayout\`  
  \- \`DigestDayHeader\`  
  \- \`HeadlineList\`  
    \- \`HeadlineCard\[\]\`  
      \- \`ExternalLinkButton\`  
      \- \`SourceBadge\`  
  \- \`RelatedProvidersSection\`  
  \- \`RelatedDigestsSection\`  
  \- \`Footer\`

\---

\# 4.6 Digest Source \`/digest/source/\[sourceSlug\]\`

\#\# Wireframe Blocks  
1\. Source profile (logo/name/url)  
2\. Recent posts from this source  
3\. Related categories

\#\# Component Tree  
\- \`PublicLayout\`  
  \- \`SourceHero\`  
  \- \`SourcePostList\`  
  \- \`RelatedCategories\`  
  \- \`Footer\`

\---

\# 5\) TOOLS WIREFRAME MAP

\---

\# 5.1 Tools Hub \`/tools\`

\#\# Wireframe Blocks  
1\. Title  
2\. Tools category tabs  
3\. Tools grid  
4\. CTA share results

\#\# Component Tree  
\- \`PublicLayout\`  
  \- \`ToolsHero\`  
  \- \`ToolTabs\`  
  \- \`ToolsGrid\`  
    \- \`ToolCard\[\]\`  
  \- \`Footer\`

\---

\# 5.2 Tool Page \`/tools/\[toolSlug\]\`

\#\# Wireframe Blocks  
1\. Tool intro  
2\. Input form  
3\. Output preview section  
4\. Generate share link CTA

\#\# Component Tree  
\- \`PublicLayout\`  
  \- \`ToolHeader\`  
  \- \`ToolForm\`  
  \- \`ToolOutputPreview\`  
  \- \`ToolShareCTA\`  
  \- \`Footer\`

\---

\# 5.3 Tool Result \`/tools/\[toolSlug\]/result/\[resultId\]\`

\#\# Wireframe Blocks  
1\. Result summary  
2\. Download/share buttons  
3\. Recommended providers section (internal linking)  
4\. CTA claim profile

\#\# Component Tree  
\- \`PublicLayout\`  
  \- \`ToolResultHero\`  
  \- \`ToolResultBody\`  
  \- \`ShareButtonsRow\`  
  \- \`RecommendedProviders\`  
  \- \`Footer\`

\---

\# 6\) DASHBOARD WIREFRAME MAP

\---

\# 6.1 Dashboard Home \`/dashboard\`

\#\# Wireframe Blocks  
1\. Trust Score big card  
2\. Verification progress bar  
3\. Setup checklist  
4\. Proof pipeline mini list  
5\. Inquiry inbox preview  
6\. Widget performance preview

\#\# Component Tree  
\- \`DashboardLayout\`  
  \- \`DashboardHeader\`  
  \- \`TrustScoreHeroCard\`  
  \- \`VerificationProgressStepper\`  
  \- \`SetupChecklist\`  
    \- \`ChecklistItem\[\]\`  
  \- \`ProofPipelineMiniTable\`  
  \- \`InquiryPreviewList\`  
  \- \`WidgetStatsMiniChart\`

\---

\# 6.2 Entities \`/dashboard/entities\`

\#\# Wireframe Blocks  
1\. Entity list table  
2\. Create new entity button  
3\. Quick edit actions

\#\# Component Tree  
\- \`DashboardLayout\`  
  \- \`EntityListTable\`  
  \- \`CreateEntityModal\`

\---

\# 6.3 Entity Detail Editor \`/dashboard/entity/\[id\]\`

\#\# Wireframe Blocks  
Left:  
\- profile completion %  
\- trust score preview  
\- publish/preview buttons

Right:  
\- tabbed editor

Tabs:  
\- Profile  
\- Services  
\- Contact  
\- Visibility  
\- Preview

\#\# Component Tree  
\- \`DashboardLayout\`  
  \- \`EntityEditorHeader\`  
  \- \`EntityCompletionProgress\`  
  \- \`EntityEditorTabs\`  
    \- \`ProfileForm\`  
    \- \`ServicesForm\`  
    \- \`ContactForm\`  
    \- \`VisibilityForm\`  
    \- \`EntityPreviewPanel\`

\---

\# 6.4 Proofs \`/dashboard/proofs\`

\#\# Wireframe Blocks  
1\. Upload proof panel  
2\. Proof list table  
3\. Status filters

\#\# Component Tree  
\- \`DashboardLayout\`  
  \- \`ProofUploadCard\`  
  \- \`ProofFiltersRow\`  
  \- \`ProofListTable\`  
    \- \`ProofRow\`  
    \- \`ProofPreviewModal\`

\---

\# 6.5 Claims \`/dashboard/claim\`

\#\# Wireframe Blocks  
Wizard stepper:  
\- choose method  
\- show instructions  
\- waiting verification  
\- completed

\#\# Component Tree  
\- \`DashboardLayout\`  
  \- \`ClaimWizard\`  
    \- \`ClaimMethodSelector\`  
    \- \`ClaimInstructionsCard\`  
    \- \`ClaimStatusPanel\`

\---

\# 6.6 Widgets \`/dashboard/widgets\`

\#\# Wireframe Blocks  
1\. Widget generator  
2\. Widget preview live  
3\. Embed snippet copy  
4\. Installations list  
5\. Stats chart

\#\# Component Tree  
\- \`DashboardLayout\`  
  \- \`WidgetGeneratorPanel\`  
  \- \`WidgetPreview\`  
  \- \`EmbedSnippetBox\`  
  \- \`WidgetInstallationTable\`  
  \- \`WidgetStatsChart\`

\---

\# 6.7 Inquiries \`/dashboard/inquiries\`

\#\# Wireframe Blocks  
Inbox UI:  
\- left list  
\- right message detail

\#\# Component Tree  
\- \`DashboardLayout\`  
  \- \`InquiryInboxSplitView\`  
    \- \`InquiryListPanel\`  
    \- \`InquiryDetailPanel\`  
      \- \`QuickReplyButtons\`  
      \- \`MarkAsSpamButton\`

\---

\# 6.8 Settings \`/dashboard/settings\`

\#\# Wireframe Blocks  
\- profile settings  
\- notification toggles  
\- privacy toggles  
\- referral code display

\#\# Component Tree  
\- \`DashboardLayout\`  
  \- \`SettingsTabs\`  
    \- \`AccountSettings\`  
    \- \`PrivacySettings\`  
    \- \`NotificationSettings\`  
    \- \`ReferralPanel\`

\---

\# 7\) ADMIN WIREFRAME MAP

\---

\# 7.1 Proof Queue \`/admin/proofs\`  
Split view:  
\- left list table  
\- right preview \+ action

Component Tree:  
\- \`AdminLayout\`  
  \- \`ProofQueueSplitView\`  
    \- \`ProofQueueTable\`  
    \- \`ProofReviewPanel\`  
      \- \`ApproveButton\`  
      \- \`RejectButton\`  
      \- \`ReasonInput\`  
      \- \`AuditLogMini\`

\---

\# 7.2 Claim Queue \`/admin/claims\`  
Component Tree:  
\- \`AdminLayout\`  
  \- \`ClaimQueueTable\`  
  \- \`ClaimDetailModal\`  
  \- \`ApproveRejectPanel\`

\---

\# 7.3 Moderation \`/admin/moderation\`  
Component Tree:  
\- \`AdminLayout\`  
  \- \`FlaggedEntitiesTable\`  
  \- \`BanDomainModal\`  
  \- \`BanUserModal\`

\---

\# 7.4 System Events \`/admin/system-events\`  
Component Tree:  
\- \`AdminLayout\`  
  \- \`SystemEventsTable\`  
  \- \`JSONViewerModal\`

\---

\# 8\) SHARED UI PATTERNS (REUSABLE SYSTEM)

\#\# 8.1 Skeleton Standard  
All pages must have:  
\- header skeleton  
\- list skeleton  
\- card skeleton

\#\# 8.2 Empty States Standard  
If no results:  
\- show illustration icon  
\- show CTA button  
\- show suggestion search

\#\# 8.3 Error States Standard  
\- 404 friendly page  
\- 403 forbidden page  
\- flagged entity page (special warning layout)

\---

\# 9\) TRANSITION \+ INTERACTION RULES

\#\# 9.1 Page Transitions  
\- fade \+ slight translate  
\- preserve scroll position when returning from detail pages

\#\# 9.2 Micro Interactions  
\- hover card lift  
\- click ripple subtle (optional)  
\- badge tooltip

\#\# 9.3 Progress Navigation (Guided UX)  
Dashboard must show progress:  
\- onboarding checklist  
\- verification stepper  
\- profile completeness meter

\---

\# 10\) PERFORMANCE RULES (FOR FRONTEND ENGINEERING)

\#\# 10.1 Component Boundaries  
\- Public pages mostly server components  
\- Only interactive parts become client components

\#\# 10.2 Bundle Size Rules  
Avoid importing heavy libs on public pages.  
Charts only loaded on dashboard pages.

\#\# 10.3 SEO-Friendly Rendering  
\- directory/category/city/best pages must be SSR/ISR  
\- avoid client-only render for main content

\---

\# 11\) RSS \+ CONTENT MODULE INTEGRATION (PORTAL-STYLE)

\#\# 11.1 Data Flow  
RSS ingestion (worker) → store raw feed items → generate digest pages → update sitemap.

\#\#\# Recommended Tables  
\- \`rss\_sources\`  
\- \`rss\_items\_raw\`  
\- \`digest\_pages\`  
\- \`digest\_entries\`

\#\#\# Frontend Pages Use  
\- \`/digest/\*\` uses \`digest\_pages\` and \`digest\_entries\`  
\- \`/updates/\*\` uses \`entity\_updates\`

\---

\#\# 11.2 Internal Linking Rules (Portal ↔ Directory)  
Digest pages must link to:  
\- top providers in category  
\- best pages in city  
\- related directory entities

Update pages must link to:  
\- entity profile  
\- related updates

\---

\# 12\) ACCEPTANCE CRITERIA (DOC-11 DONE)

UI system dianggap siap jika:  
\- semua routes punya wireframe blocks jelas  
\- component tree reusable dan tidak duplikasi liar  
\- content portal (digest/updates) punya jalur internal linking kuat  
\- dashboard onboarding progress jelas  
\- admin moderation UI efisien (split view)  
\- mobile nav native feel  
\- page skeleton/empty/error states konsisten

\---

\# END OF DOC-2

