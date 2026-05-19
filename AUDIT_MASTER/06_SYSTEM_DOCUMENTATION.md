# 🏛️ AUDIT MASTER: 06_SYSTEM_DOCUMENTATION
**INFRAMEET Platform - Product Requirements (PRD), Database Schema (ERD), Brand Canvas & Arsitektur Terpadu**  
**Tanggal:** 19 Mei 2026 | **Auditor:** Lead Enterprise Architect & Senior Consultant

---

## 🎯 1. PRODUCT REQUIREMENTS DOCUMENT (PRD)

Dokumen persyaratan produk ini mendefinisikan secara spesifik alur perjalanan pengguna (*user journeys*) untuk dua pilar layanan utama INFRAMEET: **Layanan Enterprise B2B** dan **Asistensi Akademik Berintegritas (Anti-Jokian)**.

### 1.1 Sektor Enterprise B2B (Infrastruktur Digital)
*   **Tujuan:** Membantu perusahaan skala kecil hingga menengah (SME) membangun solusi infrastruktur web handal, optimasi SEO, dan pemeliharaan server dengan skema transparan.
*   **Fitur Utama:**
    *   *Real-time Slider Budgeting:* Klien menggeser budget target dan sistem secara cerdas merumuskan daftar fitur web yang bisa didapatkan (*reverse feature engineering*).
    *   *Service Level Agreement (SLA):* Kontrak digital menyertakan SLA waktu respons dukungan 2 jam untuk masalah krusial.
    *   *Laporan UAT (User Acceptance Test) Terbimbing:* Klien memverifikasi hasil sebelum menyetujui BAST.

### 1.2 Sektor Asistensi Akademik (Ethical Research Infrastructure)
*   **Tujuan:** Menyediakan layanan pendukung olah data statistik kuantitatif (SPSS, SEM SmartPLS) dan layouting daftar pustaka tanpa menyentuh jasa perjokian yang melanggar hukum.
*   **Fitur Utama:**
    *   *Anti-Joki Protocol Ceklist:* Klien wajib menandatangani pernyataan integritas bahwa data riset didapatkan secara etis dan hak kepengarangan 100% milik mereka secara mutlak.
    *   *Turnitin Limit Lock:* Kampus klien diklasifikasikan berdasarkan batas maksimal plagiarisme Turnitin untuk disesuaikan saat penataan format layouting dokumen ilmiah.
    *   *Sidang Slide Deck Presentation Builder:* Membantu menyusun visual presentasi sidang skripsi yang menarik secara akademis tanpa melanggar etika orisinalitas riset.

---

## 💾 2. ENTITY-RELATIONSHIP DIAGRAM (ERD)

Arsitektur database INFRAMEET dirancang di atas PostgreSQL (Supabase) dengan hubungan relasi data terstruktur dan kebijakan isolasi Row Level Security (RLS) yang kuat.

```mermaid
erDiagram
    clients {
        uuid id PK
        string company_name
        string email UNIQUE
        string encrypted_whatsapp
        timestamp created_at
    }
    projects {
        uuid id PK
        uuid client_id FK
        string title
        string service_type
        string status
        decimal budget
        timestamp created_at
    }
    briefs {
        uuid id PK
        uuid project_id FK
        text requirements
        string file_attachments
        timestamp created_at
    }
    invoices {
        uuid id PK
        uuid project_id FK
        decimal amount
        string status
        string xendit_invoice_id
        timestamp created_at
    }
    escrow_ledger {
        uuid id PK
        uuid project_id FK
        uuid invoice_id FK
        decimal amount
        string status
        uuid executor_wallet_id
        timestamp created_at
    }
    contracts {
        uuid id PK
        uuid project_id FK
        string document_url
        string ecdsa_signature
        timestamp signed_at
    }
    bast {
        uuid id PK
        uuid project_id FK
        jsonb qa_checklist_passed
        string client_signature
        timestamp released_at
    }

    clients ||--o{ projects : "memiliki"
    projects ||--|| briefs : "menyertakan"
    projects ||--o{ invoices : "menerbitkan"
    projects ||--|| escrow_ledger : "mengunci dana"
    projects ||--|| contracts : "diikat hukum"
    projects ||--|| bast : "diserahterimakan"
    invoices ||--|| escrow_ledger : "memicu"
```

### 2.1 Spesifikasi Skema SQL PostgreSQL Rencana Terapkan
```sql
-- Aktivasi Ekstensi Keamanan & Enkripsi
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum Tipe Layanan
CREATE TYPE service_domain AS ENUM ('B2B_ENTERPRISE', 'ACADEMIC_INTEGRITY');
CREATE TYPE escrow_status AS ENUM ('HELD', 'RELEASED', 'DISPUTED');
CREATE TYPE invoice_status AS ENUM ('UNPAID', 'PAID', 'EXPIRED');

-- Tabel Klien (Enkripsi PDP kolom WhatsApp)
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    encrypted_whatsapp BYTEA NOT NULL, -- Diperlakukan dengan AES-256
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Proyek
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    domain service_domain NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    budget DECIMAL(12, 2) NOT NULL CHECK (budget > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Escrow Ledger (Penyimpanan Dana Sementara)
CREATE TABLE escrow_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    status escrow_status NOT NULL DEFAULT 'HELD',
    executor_wallet_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🎨 3. UI/UX & COPYWRITING BLUEPRINT

Platform INFRAMEET mengusung tema estetika premium yang berkarakter kuat, kontras tinggi, dan futuristik:

*   **Palet Warna Harmonious (Dark Mode Spesifik):**
    *   *Primary Background:* Slate hitam pekat (`#020617` / `bg-[#020617]`) untuk nuansa korporat premium.
    *   *Accent Indigo:* Indigo elektrik (`#4f46e5` / `text-indigo-400`) melambangkan kecerdasan teknologi.
    *   *Trust Emerald:* Emerald hijau solid (`#10b981` / `text-emerald-400`) menandakan sertifikasi keamanan/kepatuhan anti-joki.
*   **Tipografi Modern:** Menggunakan Google Fonts **Outfit** (untuk judul berkekuatan tajam/black) dan **Inter** (untuk keterbacaan copywriting tubuh esai ilmiah).
*   **Micro-Animations & Glassmorphism:**
    *   Setiap elemen tombol transaksional menggunakan efek hover halus dengan bayangan berpendar (*glow effects*).
    *   Panel fungsional dihiasi dengan properti kartu semi-transparan (`glass-panel` / `backdrop-blur-md`).
*   **Lucide Icons Premium:** Menggunakan ikon elegan bersudut ramping (seperti `ShieldCheck`, `Scale`, `FileSignature`) untuk menggantikan emoji pasaran yang kekanak-kanakan.

---

## 💼 4. BRAND & BUSINESS CANVAS

Strategi komersialisasi INFRAMEET dirancang untuk memastikan keberlanjutan bisnis jangka panjang dengan memahami dinamika operasional, sosio-ekonomi, dan hukum:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        INFRAMEET BUSINESS CANVAS                       │
├──────────────────────────┬──────────────────────────┬──────────────────┤
│ KEY PARTNERS             │ KEY ACTIVITIES           │ VALUE PROPOSITIONS│
│ - Penyedia Cloud (Vercel)│ - Kurasi data akademis    │ - Escrow Kripto  │
│ - Payment Gateway Xendit │ - Verifikasi anti-joki   │   ES256 aman     │
│ - Jaringan Akademisi     │ - Pembangunan web B2B    │ - 100% Bebas Joki│
├──────────────────────────┼──────────────────────────┼──────────────────┤
│ CUSTOMER RELATIONSHIPS   │ CUSTOMER SEGMENTS        │ CHANNELS         │
│ - Portal Verifikasi Ril  │ - Klien SME Korporasi    │ - verify/portal  │
│ - Sistem Reputasi Pakar  │ - Peneliti & Dosen       │ - Jaringan Kampus│
├──────────────────────────┴──────────────────────────┴──────────────────┤
│ COST STRUCTURE                                      │ REVENUE STREAMS  │
│ - Serverless Cloud Infras                           │ - Fee Escrow (5%)│
│ - Biaya Kurator Ahli                                │ - Jasa Enterprise│
└────────────────────────────────────────────────────────────────────────┘
```
