# INFRAMEET - Vision & Goals

## System Vision
To build the most secure, transparent, and low-cost directory network on the internet.

## Core Pillars
1. **Absolute Cost Efficiency**: Designed to operate completely within Vercel Free, Supabase Free, and GitHub Actions Free tiers.
2. **Server-Authoritative Security**: Strict Postgres Row-Level Security (RLS) and server-side RPC validation block client-side trust modifications or escrow workarounds.
3. **Decentralized Verifiability**: Any user can audit reputation logs to see exactly why an entity has a specific Trust Score.

---
# 2) SYSTEM PRINCIPLES (NON-NEGOTIABLE)

## 2.1 Anti-Spam Compliance
- outreach harus punya **approval step**
- semua outreach harus punya opt-out line
- store `do_not_contact` list
- daily outreach quota hard limit

## 2.2 Privacy-First Data Collection
- jangan simpan data personal yang tidak perlu
- store only business/public contact info
- hash IP jika ada logging
- jangan simpan raw cookies/session

## 2.3 Legal Safety
- jangan publish defamation
- jangan publish “scam allegation” tanpa sumber jelas
- complaint/report harus netral dan evidence-based

## 2.4 Deterministic Pipeline
Semua scraping/enrichment harus reproducible:
- log input source URL
- store extraction method
- store timestamps
- store raw snapshot reference

---
