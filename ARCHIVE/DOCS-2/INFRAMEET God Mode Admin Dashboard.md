# **👑 INFRAMEET: GOD MODE ADMIN PANEL & MONEV CONSOLE (v1.0)**

**Dokumen:** Spesifikasi Master Arsitektur Dasbor Admin (Monev, Konfigurasi, & Integrasi Ekosistem)

**Tujuan:** Mengkonsolidasikan data B2B CRM, Escrow Ledger, dan Mesin Afiliasi (v12.0) ke dalam satu antarmuka visual yang aman, terpusat, dan mudah dikontrol tanpa menyentuh kode.

**Tech Stack:** Next.js 14 App Router (Rute /admin), Tremor.so (UI Analitik), Supabase Auth (Admin Role RLS), Server Actions.

## **📑 1\. PRODUCT REQUIREMENTS DOCUMENT (PRD)**

### **1.1 Objektif Utama (The "All-Seeing Eye")**

Menyediakan antarmuka tunggal bagi *Founder* dan Manajer Operasional untuk:

1. **Monev Finansial:** Memantau arus kas dari dua sumber berbeda: Proyek B2B/Akademik (Escrow) dan *Passive Income* (Afiliasi v12.0).  
2. **Kontrol Operasional:** Mengelola prospek CRM, menyetujui BAST, dan mengotorisasi penarikan dana (*Withdrawal*) dari *Executor Wallets*.  
3. **Konfigurasi Mesin (No-Code Config):** Mengaktifkan/menonaktifkan jaringan afiliasi, memantau *Inbound Links*, dan melihat log audit sistem.

### **1.2 Aturan Keamanan Absolut (Sesuai llm.txt)**

* **Route Protection:** Seluruh rute /admin/\* wajib dilindungi oleh Next.js Middleware. Hanya *user* dengan UUID yang terdaftar di tabel staff dengan role \= 'admin' yang dapat mengaksesnya.  
* **RLS Bypass:** Dasbor ini adalah satu-satunya tempat di mana kebijakan *Row Level Security* (RLS) Supabase mengizinkan pembacaan kolom sensitif (seperti affiliate\_url atau persentase komisi).  
* **Atomic Approvals:** Saat admin menyetujui penarikan dana eksekutor, proses harus menggunakan *Database Transaction* (Pessimistic Lock) untuk mencegah *double-spending*.

## **🎨 2\. UI/UX ARCHITECTURE & NAVIGATION (TREMOR.SO)**

Dasbor menggunakan **Tremor.so** (Pustaka React khusus untuk dasbor analitik) yang terintegrasi dengan *Tailwind CSS* untuk visualisasi data tingkat *Enterprise*.

### **2.1 Struktur Navigasi (Sidebar Kiri)**

* 📊 **Overview (Command Center)** ➔ Ringkasan metrik utama.  
* 💼 **CRM & Projects** ➔ Pipeline Leads, SOW, dan Kontrak.  
* 💸 **Finance & Escrow** ➔ Invoice Xendit, Ledger Penahanan, Wallet Eksekutor.  
* 🚀 **Affiliate & Inbound Engine** ➔ Metrik Konversi Afiliasi, Log *Deep Link*, Manajemen Tag AI.  
* ⚙️ **System & Audit Logs** ➔ Status Cron Job (UptimeRobot), Log aktivitas *staff*.

### **2.2 Command Center Widgets (Halaman Depan)**

* **Widget 1: Total Revenue Pipeline (Bar Chart):** Membandingkan Gross Revenue (Invoice Lunas) vs Escrow HELD (Belum Selesai) vs Released Profit (Bersih Agensi).  
* **Widget 2: Affiliate Passive Income (Area Chart):** Menampilkan tren harian konversi dari PartnerStack & Involve Asia.  
* **Widget 3: Pending Actions (Task List):** Notifikasi merah untuk aksi yang butuh persetujuan admin: *"3 Penarikan Wallet Eksekutor Menunggu"*, *"5 BAST Siap Ditinjau"*.

## **🔌 3\. INTEGRASI BACKEND-FRONTEND (MODUL KONTROL)**

Bagian ini mendefinisikan bagaimana Dasbor Admin berinteraksi dengan arsitektur yang sudah ada (services.json, Afiliasi v12.0, Escrow).

### **3.1 Modul 1: Affiliate Engine Controller (v12.0 Integration)**

Admin tidak perlu menyentuh database untuk mengatur afiliasi.

* **Fitur UI:** Tabel tools\_directory dengan *Toggle Switch* untuk mengubah affiliate\_network (dari 'manual' ke 'involve\_asia', dsb).  
* **Inbound Link Monitor:** Tabel yang merender data dari inbound\_link\_logs. Admin dapat melihat URL website mana saja yang memasang *Trust Badge* INFRAMEET secara *real-time*.  
* **Sinkronisasi Data:** Menggunakan Server Actions untuk menarik data konversi dari tabel affiliate\_conversions dan merendernya ke grafik Tremor (\<DonutChart /\> untuk distribusi jaringan afiliasi).

### **3.2 Modul 2: Finance & Escrow Master Control**

Sesuai aturan llm.txt, uang klien yang masuk dari Xendit akan dikunci di escrow\_ledger.

* **Withdrawal Approval UI:** Admin melihat daftar eksekutor yang meminta pencairan dana dari executor\_wallets.  
* **Logika Backend (Server Action):**

// app/admin/actions/finance.ts

'use server'

export async function approveWithdrawal(transactionId: string) {

  // 1\. Verifikasi role admin

  const isAdmin \= await checkAdminRole();

  if (\!isAdmin) throw new Error('Unauthorized');

  // 2\. Eksekusi Atomic Transaction via Supabase RPC (Stored Procedure)

  const { data, error } \= await supabase.rpc('process\_wallet\_withdrawal', {

    p\_transaction\_id: transactionId

  });

  // 3\. Panggil API Xendit Disbursement (jika sukses di database)

  if (\!error) await triggerXenditDisbursement(data.amount, data.account\_info);

}

* 

### **3.3 Modul 3: Dynamic Pricing Catalog Viewer**

Admin dapat melihat katalog harga aktif yang bersumber dari packages/config/services.json.

* Karena services.json adalah *Single Source of Truth* (file statis), dasbor akan memuat ( *read-only*) isi file tersebut dan merendernya dalam bentuk tabel agar *Founder* bisa memastikan harga yang berlaku di sistem saat ini tanpa harus membuka GitHub.

## **🛡️ 4\. KONFIGURASI KEAMANAN (MIDDLEWARE & RLS)**

### **4.1 Next.js Edge Middleware (middleware.ts)**

Middleware memblokir akses ke rute /admin sebelum halaman di-*render*.

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {

  const res \= NextResponse.next()

  const supabase \= createMiddlewareClient({ req, res })


  // Rute Admin Protection

  if (req.nextUrl.pathname.startsWith('/admin')) {

    const { data: { session } } \= await supabase.auth.getSession()

    if (\!session) return NextResponse.redirect(new URL('/login', req.url))

    

    // Validasi ke tabel staff

    const { data: staff } \= await supabase

      .from('staff')

      .select('role')

      .eq('auth\_user\_id', session.user.id)

      .single()

      

    if (\!staff || staff.role \!== 'admin') {

      return NextResponse.redirect(new URL('/unauthorized', req.url))

    }

  }


  // (Logika Affiliate Route Masking /r/\[slug\] tetap berjalan di sini)


  return res

}

### **4.2 SQL Supabase: RPC untuk Withdrawal (Keamanan Transaksi)**

*Instruksi untuk AI Coder: Tambahkan Stored Procedure ini ke database.*

\-- SQL: Fungsi Transaksi Atomik untuk Persetujuan Penarikan Wallet Eksekutor

CREATE OR REPLACE FUNCTION process\_wallet\_withdrawal(p\_transaction\_id UUID)

RETURNS JSONB

LANGUAGE plpgsql

SECURITY DEFINER \-- Berjalan dengan hak akses bypass RLS

AS $$

DECLARE

  v\_amount DECIMAL;

  v\_user\_id UUID;

BEGIN

  \-- Kunci baris transaksi (Pessimistic Lock)

  SELECT amount\_idr, user\_id INTO v\_amount, v\_user\_id

  FROM payout\_transactions 

  WHERE id \= p\_transaction\_id AND status \= 'PENDING'

  FOR UPDATE;

  IF NOT FOUND THEN

    RAISE EXCEPTION 'Transaksi tidak valid atau sudah diproses';

  END IF;

  \-- Kurangi saldo dompet

  UPDATE executor\_wallets 

  SET available\_balance\_idr \= available\_balance\_idr \- v\_amount,

      total\_withdrawn\_idr \= total\_withdrawn\_idr \+ v\_amount

  WHERE user\_id \= v\_user\_id;

  \-- Update status transaksi

  UPDATE payout\_transactions 

  SET status \= 'PROCESSED', processed\_at \= NOW() 

  WHERE id \= p\_transaction\_id;

  RETURN json\_build\_object('status', 'success', 'amount', v\_amount);

END;

$$;

## **🤖 5\. SPRINT INSTRUCTIONS UNTUK AI CODER**

Jika Anda memberikan prompt kepada AI Coder (Cursor / Windsurf / Copilot), gunakan perintah berikut untuk membangun Dasbor God Mode ini:

**Sprint 1 (Security & Layout):** "@workspace Baca ADMIN\_DASHBOARD\_GOD\_MODE.md dan llm.txt. Pertama, perbarui middleware.ts untuk melindungi rute /admin. Kedua, *install* tremor.so dan buat kerangka *layout* untuk dasbor (Sidebar \+ Topbar). Pastikan pengecekan role admin divalidasi ke tabel staff."

**Sprint 2 (Finance & Escrow Module):** "@workspace Buat halaman /admin/finance. Render tabel dari escrow\_ledger dan executor\_wallets. Implementasikan Server Action yang memanggil RPC process\_wallet\_withdrawal untuk menyetujui penarikan dana eksekutor. Gunakan prinsip *Atomic Transaction* seperti yang tercantum dalam *Hard Rules* llm.txt."

**Sprint 3 (Affiliate Engine Monev):** "@workspace Baca AFFILIATE\_ENGINE\_ARCHITECTURE.md (v12.0). Buat halaman /admin/affiliate. Gunakan komponen grafik Tremor (AreaChart) untuk merender data dari tabel affiliate\_conversions. Buat tabel untuk menampilkan log dari inbound\_link\_logs agar saya bisa memantau siapa saja yang menanam *Trust Badge* kita."

**Sprint 4 (System Overview):** "@workspace Buat halaman depan /admin/page.tsx (Command Center). Kumpulkan agregasi data: Total Invoice Lunas, Total Escrow HELD, dan Total Affiliate Commission. Gunakan komponen Card dan Metric dari Tremor untuk menyajikannya secara elegan."

