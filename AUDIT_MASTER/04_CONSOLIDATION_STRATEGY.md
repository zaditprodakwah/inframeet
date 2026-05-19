# 🔍 AUDIT MASTER: 04_CONSOLIDATION_STRATEGY
**INFRAMEET Platform - Documentation Consolidation Strategy & Maintenance Rules**  
**Tanggal:** 19 Mei 2026 | **Auditor:** Lead Enterprise Architect & Senior Consultant

---

## 🗺️ THE DOCUMENTATION MESS DIAGRAM

Kondisi dokumentasi sebelum konsolidasi mengalami masalah redundansi akut (*scattered knowledge*). Tiga folder dokumentasi terpisah ditambah file `llm.txt` dan `README.md` berukuran besar sering kali menyajikan informasi yang bertolak belakang mengenai skema database dan rute API.

```
KONDISI SEBELUMNYA (REDUNDAN & MEMBINGUNGKAN)
├── README.md (41KB) ───────────────────────┐
├── llm.txt (42KB - Duplikasi Kasar) ───────┼─> Tersebar di mana-mana!
├── DOCS-1/ (15 file spesifikasi arsitektur) ├─> Versi API berbeda-beda
├── DOCS-2/ (5 file fitur lanjutan) ────────┼─> Skema database bentrok
└── DOCS-3/ (6 file audit & branding) ──────┘

          │
          ▼ REKONSILIASI SISTEMIK

KONDISI SEKARANG (SINGLE SOURCE OF TRUTH)
├── README.md (Akses Ringkas & Informasi Onboarding)
└── AUDIT_MASTER/
    ├── 01_EXECUTIVE_SUMMARY.md       (Kesehatan platform & isu kritis)
    ├── 02_CODE_AUDIT.md             (Inventori kode & matriks keamanan)
    ├── 04_CONSOLIDATION_STRATEGY.md  (File ini - Peta migrasi dokumen)
    ├── 05_EXECUTION_ROADMAP.md       (Peta jalan 12 minggu & Jira backlog)
    └── 06_SYSTEM_DOCUMENTATION.md    (PRD, ERD terpadu, UI/UX, & Business Canvas)
```

---

## 📈 legacy DOCS MIGRATION MAP

Untuk merapikan workspace tanpa menghilangkan data historis arsitektur yang penting, kami memetakan migrasi dokumen-dokumen lama ke dalam struktur `AUDIT_MASTER` yang baru:

| Legacy File Path | Target Master File | Status Konsolidasi |
| :--- | :--- | :--- |
| `DOCS-1/DATABASE_SCHEMA.md` | `AUDIT_MASTER/06_SYSTEM_DOCUMENTATION.md` | **Dipindahkan & Diperbarui** dengan skema ERD PostgreSQL relational terpadu. |
| `DOCS-1/DASHBOARD_ARCHITECTURE.md` | `AUDIT_MASTER/06_SYSTEM_DOCUMENTATION.md` | **Diintegrasikan** ke dalam spesifikasi PRD admin dashboard. |
| `DOCS-2/pricing.md` | `AUDIT_MASTER/06_SYSTEM_DOCUMENTATION.md` | **Diintegrasikan** ke bagian PRD kalkulator & library server-side `pricingMath.ts`. |
| `DOCS-2/upgrade5-direktori.md` | `AUDIT_MASTER/02_CODE_AUDIT.md` | **Direkonsiliasi** ke dalam daftar checklist implementasi direktori pendidikan/perkakas. |
| `DOCS-3/Master Rebranding Tahap 2.md` | `AUDIT_MASTER/01_EXECUTIVE_SUMMARY.md` | **Diterjemahkan** menjadi analisis bisnis strategis dan geopolitik anti-jokian. |

---

## 🧹 CLEANUP & ARCHIVAL PROCESS

Proses pembersihan dilakukan dengan hati-hati untuk menjaga integritas riwayat git (*git commit history*):

1.  **Langkah 1: Backup & Integrasi Dokumen**
    *   Seluruh konten esensial dari folder `DOCS-1/`, `DOCS-2/`, dan `DOCS-3/` dipindahkan ke dalam modul masing-masing di `06_SYSTEM_DOCUMENTATION.md` dan `01_EXECUTIVE_SUMMARY.md`.
2.  **Langkah 2: Pembuatan Arsip**
    *   Folder-folder legacy (`DOCS-1`, `DOCS-2`, `DOCS-3`) dan berkas duplikasi `llm.txt` dapat dimasukkan ke dalam folder `.archive/` jika masih dibutuhkan sebagai bahan referensi historis, or dihapus sepenuhnya secara permanen menggunakan perintah git untuk mengurangi ukuran repositori.
3.  **Langkah 3: Konsolidasi README.md**
    *   Menyederhanakan `README.md` utama di root folder agar hanya fokus pada panduan instalasi lokal (*local development guide*), prasyarat pnpm, dan tautan langsung ke folder `AUDIT_MASTER/`.

---

## 🛡️ LONG-TERM MAINTENANCE RULES (Aturan Pemeliharaan)

Untuk mencegah dokumentasi kembali ke keadaan tidak teratur di masa depan, tim pengembang wajib mematuhi aturan berikut:

*   > **Rule 1: Code-First Sync.** Setiap perubahan pada skema tabel Supabase or rute API wajib diiringi pembaruan langsung pada file `06_SYSTEM_DOCUMENTATION.md` dalam *pull request* yang sama.
*   > **Rule 2: No Duplicate Files.** Dilarang keras membuat file penjelasan terpisah di luar folder `AUDIT_MASTER/`.
*   > **Rule 3: Indonesian as Primary Copywriting.** Seluruh dokumentasi tingkat tinggi dan penjelasan legalitas bisnis (TOS, TOR, MoU) wajib menggunakan bahasa Indonesia yang baku, formal, dan mencerminkan etika riset ilmiah yang steril dari perjokian.
