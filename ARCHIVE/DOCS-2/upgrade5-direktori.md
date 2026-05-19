# **🌐 INFRAMEET: UPGRADE 5 \- OPEN EXPERT NETWORK & DIRECTORY MASTER BLUEPRINT**

**Dokumen Terintegrasi:** Master AI Coder Prompt, PRD & User Stories, UI/UX Copywriting, dan Spesifikasi Teknis Implementasi Lengkap (Zod, Resend, Webhook, Schema.org).

## **🤖 BAGIAN 1: SYSTEM INSTRUCTIONS FOR AI CODER (MASTER PROMPT)**

*( bagian ini untuk AI Coder sebagai instruksi sistem dasar)*

### **\[ROLE\]**

Anda adalah **Lead Enterprise Architect & Senior Full-Stack Next.js Developer**. Keahlian absolut Anda ada pada ekosistem Next.js 15 (App Router), Supabase (PostgreSQL, RLS), Server Actions, arsitektur *Zero-Cost Serverless* di Vercel, serta desain UI/UX tingkat premium (Tailwind CSS, shadcn/ui, framer-motion). Anda sangat berorientasi pada keamanan (Zero-Trust), *type-safety* (TypeScript/Zod), otomatisasi (Resend/Webhooks), dan efisiensi *crawl budget* SEO (Schema.org/JSON-LD).

### **\[CONTEXT\]**

Kita melakukan ekspansi masif platform INFRAMEET melalui modul **Open Expert Network & Data Directory**. Kita mengubah direktori talenta menjadi jaringan pakar lintas sektoral (Akademik, Bisnis, Publik) dengan halaman dedikasi premium (*Ego-Bait Marketing*). Sistem ini menganut arsitektur **Form-to-Premium Page** (*Frictionless Onboarding* tanpa login awal) dan **Smart Contact Routing** (merahasiakan kontak pakar dari client-side sambil mencatat *leads*). Selain itu, kita mengintegrasikan sistem notifikasi Email otomatis (Resend) dan Webhook WhatsApp.

### **\[HARD RULES \- NON-NEGOTIABLE\]**

1. **Zero-Trust Security & Data Privacy:** Data contact\_routing (WA/Email) pakar **TIDAK BOLEH** bocor/diekspos ke sisi klien (frontend). Kontak harus diproses via Backend API yang mencatat *leads* (crm\_leads) sebelum memberikan URL redirect (wa.me/mailto).  
2. **Robust Type-Safety & Error Handling:** WAJIB gunakan Zod untuk validasi Server Actions. Tangani error secara anggun (graceful) dan WAJIB memanggil auditLog untuk setiap aksi CRUD (Sukses/Gagal).  
3. **UI/UX Premium Standards:** Dilarang menggunakan layar kosong saat loading (gunakan \<Skeleton\> atau *Blur-Up*). Gunakan framer-motion untuk *magnetic/tilt effects*. Terapkan gaya *Cyber-Minimalism Dark Glassmorphism*.  
4. **Database Integrity (Supabase RLS):** Jangan sentuh/bypass keamanan. Gunakan tabel expert\_directory dan user\_achievements dengan RLS ketat.

### **\[TASKS TO IMPLEMENT\]**

1. **Database & RLS:** Eksekusi migrasi SQL terpadu untuk expert\_directory dan user\_achievements.  
2. **Server Actions & Emails:** Bangun submitExpertOnboarding dan approveExpert dengan Zod \+ integrasi *React Email* (Resend) untuk notifikasi Admin dan Pakar.  
3. **Public Directory & Dedicated Page:** Bangun /experts dan /experts/\[slug\]. Wajib integrasi SEO generateMetadata dan Schema.org Person JSON-LD.  
4. **Frictionless Contact Routing:** Bangun SmartContactModal dan endpoint /api/experts/contact terintegrasi *lead capture* dan Webhook *Evolution API* WhatsApp.  
5. **Growth Hacks:** Buat Web Component (Shadow DOM) untuk *Embeddable Expert Badge*.

### **\[OUTPUT REQUIREMENTS\]**

**BERHENTI\! JANGAN TULIS KODE FITUR DULU.**

Sebagai langkah awal, Anda WAJIB menyusun **"Implementation Plan"** (Rencana Eksekusi) yang terstruktur:

1. Pemetaan *File Tree* yang akan disentuh/dibuat.  
2. Urutan eksekusi logis (Tahap 1, 2, 3...).  
3. Konfirmasi pemahaman Anda terhadap *Hard Rules* (khususnya penyembunyian contact\_routing dan RLS).  
   Tunggu persetujuan saya ("Setuju, lanjutkan") sebelum mulai coding Tahap 1\.

## **📂 BAGIAN 2: ARCHITECTURE & FILE TREE PLANNING**

Struktur direktori yang akan digunakan dan dibangun oleh AI Coder:

apps/frontend/src/  
├── app/  
│   ├── experts/  
│   │   ├── page.tsx                     \# Directory listing (Search, Filter, Grid)  
│   │   └── \[slug\]/  
│   │       └── page.tsx                 \# Premium profile (Ego-bait, Schema.org)  
│   ├── join-expert/  
│   │   └── page.tsx                     \# Zod-validated onboarding form  
│   ├── admin/  
│   │   └── expert-approvals/  
│   │       └── page.tsx                 \# Moderation queue, approve button  
│   └── api/  
│       ├── experts/contact/route.ts     \# Lead capture & WA/Email redirect  
│       ├── webhooks/whatsapp/route.ts   \# Evolution API webhook handler  
│       └── test-email/route.ts          \# Endpoint testing Resend  
├── components/  
│   ├── experts/  
│   │   ├── ExpertCard.tsx               \# Reusable grid card  
│   │   ├── ExpertHero.tsx               \# Glassmorphic header profile  
│   │   ├── SmartContactModal.tsx        \# Frictionless lead form  
│   │   └── AchievementBadges.tsx        \# Gamification visual  
│   └── widgets/  
│       └── ExpertBadgeWidget.tsx        \# Web Component for shadow DOM  
├── lib/  
│   ├── expert.ts                        \# Server actions & Zod schemas  
│   ├── audit.ts                         \# Audit log helper  
│   └── email.ts                         \# Resend mailer functions  
├── emails/                              \# React Email Templates  
│   ├── ExpertApprovalEmail.tsx          \# Admin alert template  
│   └── ExpertWelcomeEmail.tsx           \# Expert welcome template  
└── supabase/migrations/  
    └── 20260519\_expert\_directory.sql    \# Core database schema

## **🎨 BAGIAN 3: UI/UX & COPYWRITING FRAMEWORK**

**Design System:**

* **Tema:** Cyber-Minimalism Dark Glassmorphism (bg-slate-950, border slate-800/60).  
* **Aksen Warna:** Emerald (\#10b981) untuk sukses/verifikasi, Indigo (\#4f46e5) untuk interaksi.  
* **Motion:** Magnetic buttons, tilt cards, skeleton loaders, canvas-confetti saat approval/success.

**Copywriting Guidelines (Public Facing):**

* **Halaman /experts:**  
  * *Headline:* "Temukan Pakar Terbaik untuk Proyek Anda"  
  * *Sub:* "Dosen, Konsultan, dan Profesional Terverifikasi siap membantu dengan presisi tinggi."  
* **Halaman /join-expert:**  
  * *Headline:* "Dapatkan Halaman Profil Premium Gratis"  
  * *Sub:* "Bangun kredibilitas digital Anda dan terhubung dengan klien berkualitas (Tanpa perlu buat akun)."  
* **SmartContactModal:**  
  * *Headline:* "Hubungi {name} via WhatsApp/Email"  
  * *Sub:* "Kami akan mencatat pesan Anda untuk memastikan respons yang tepat dan cepat dari Pakar."

## **💻 BAGIAN 4: SPESIFIKASI IMPLEMENTASI TEKNIS LENGKAP**

### **4.1 SQL Migration (Supabase RLS & Gamification)**

**File:** supabase/migrations/20260519\_expert\_directory.sql

CREATE TABLE IF NOT EXISTS expert\_directory (  
    id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    user\_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,  
    slug TEXT UNIQUE NOT NULL,  
    full\_name TEXT NOT NULL,  
    title TEXT,  
    category TEXT NOT NULL CHECK (category IN ('ACADEMIC', 'BUSINESS', 'TECH', 'LEGAL', 'PUBLIC\_SERVICE', 'OTHER')),  
    tags TEXT\[\],  
    bio\_summary TEXT,  
    achievements JSONB DEFAULT '\[\]'::jsonb,  
    contact\_routing JSONB NOT NULL, \-- { "whatsapp": "...", "email": "..." } \- MUST BE HIDDEN  
    profile\_completion\_score INTEGER DEFAULT 0 CHECK (profile\_completion\_score BETWEEN 0 AND 100),  
    expert\_tier TEXT DEFAULT 'BRONZE' CHECK (expert\_tier IN ('BRONZE', 'SILVER', 'GOLD', 'ELITE')),  
    is\_public BOOLEAN DEFAULT false,  
    created\_at TIMESTAMPTZ DEFAULT NOW(),  
    updated\_at TIMESTAMPTZ DEFAULT NOW()  
);

CREATE TABLE IF NOT EXISTS user\_achievements (  
    id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    user\_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,  
    achievement\_type TEXT NOT NULL,  
    metadata JSONB DEFAULT '{}'::jsonb,  
    unlocked\_at TIMESTAMPTZ DEFAULT NOW()  
);

CREATE INDEX idx\_expert\_slug ON expert\_directory(slug);  
CREATE INDEX idx\_expert\_category ON expert\_directory(category);  
CREATE INDEX idx\_expert\_public ON expert\_directory(is\_public);

ALTER TABLE expert\_directory ENABLE ROW LEVEL SECURITY;

\-- Policy: Public hanya bisa baca yang Approved (is\_public \= true)  
CREATE POLICY expert\_public\_read ON expert\_directory   
    FOR SELECT USING (is\_public \= true);

\-- Policy: Admin punya akses penuh  
CREATE POLICY expert\_admin\_all ON expert\_directory   
    FOR ALL USING (EXISTS (SELECT 1 FROM staff WHERE auth\_user\_id \= auth.uid() AND role IN ('admin', 'manager')));

### **4.2 Zod, Server Actions, & Robust Error Handling**

**File:** src/lib/expert.ts

'use server';

import { z } from 'zod';  
import { createClient } from '@supabase/supabase-js';  
import { revalidatePath } from 'next/cache';  
import { auditLog } from '@/lib/audit';  
import { sendAdminApprovalEmail } from '@/lib/email';  
import slugify from 'slugify';

const supabase \= createClient(process.env.NEXT\_PUBLIC\_SUPABASE\_URL\!, process.env.SUPABASE\_SERVICE\_ROLE\_KEY\!);

export const ExpertOnboardingSchema \= z.object({  
  full\_name: z.string().min(3),  
  title: z.string().min(5),  
  category: z.enum(\["ACADEMIC", "BUSINESS", "TECH", "LEGAL", "PUBLIC\_SERVICE", "OTHER"\]),  
  tags: z.array(z.string()).max(10),  
  bio\_summary: z.string().min(20).max(1000),  
  contact\_routing: z.object({  
    whatsapp: z.string().regex(/^628\\d{8,13}$/, "Format WA harus 628xxxxxxxxxx"),  
    email: z.string().email(),  
  }),  
});

export async function submitExpertOnboarding(prevState: any, formData: FormData) {  
  try {  
    const rawData \= Object.fromEntries(formData.entries());  
    const validated \= ExpertOnboardingSchema.safeParse({  
      ...rawData,  
      tags: JSON.parse((rawData.tags as string) || '\[\]'),  
      contact\_routing: {  
        whatsapp: rawData.whatsapp,  
        email: rawData.email,  
      },  
    });

    if (\!validated.success) return { success: false, errors: validated.error.flatten().fieldErrors, message: "Validasi gagal." };

    const baseSlug \= slugify(validated.data.full\_name, { lower: true, strict: true });  
    const uniqueSlug \= \`${baseSlug}-${Math.floor(1000 \+ Math.random() \* 9000)}\`;

    const { data: expert, error } \= await supabase.from('expert\_directory').insert({  
      ...validated.data,  
      slug: uniqueSlug,  
      is\_public: false,  
      profile\_completion\_score: 65, // Base Gamification score  
    }).select().single();

    if (error) throw new Error(error.message);

    await auditLog({ entity\_type: 'expert\_directory', entity\_id: expert.id, action: 'CREATE\_PENDING', changes: { status: 'pending' }, ip\_address: 'system', user\_agent: 'onboarding' });  
    await sendAdminApprovalEmail(expert); // Resend Integration

    revalidatePath('/admin/expert-approvals');  
    return { success: true, message: "Pendaftaran berhasil\! Profil Anda akan ditinjau admin dalam 24 jam.", expertId: expert.id };

  } catch (err: any) {  
    await auditLog({ entity\_type: 'expert\_directory', entity\_id: 'unknown', action: 'CREATE\_FAILED', changes: { error: err.message }, ip\_address: 'system', user\_agent: 'onboarding' });  
    return { success: false, message: "Terjadi kesalahan sistem. Silakan coba lagi." };  
  }  
}

### **4.3 Schema.org Integration (SEO)**

**File:** src/app/experts/\[slug\]/page.tsx

import { Person, Organization } from 'schema-dts';

export async function generateMetadata({ params }: { params: { slug: string } }) {  
  // ...fetch expert data...  
  const personSchema: Person \= {  
    "@context": "\[https://schema.org\](https://schema.org)",  
    "@type": "Person",  
    name: expert.full\_name,  
    jobTitle: expert.title,  
    description: expert.bio\_summary,  
    url: \`https://inframeet.com/experts/${expert.slug}\`,  
    knowsAbout: expert.tags,  
    affiliation: {  
      "@type": "Organization",  
      name: "INFRAMEET Verified Expert Network"  
    }  
  };

  return {  
    title: \`${expert.full\_name} | Pakar INFRAMEET\`,  
    description: expert.bio\_summary,  
    other: { 'script:ld+json': JSON.stringify(personSchema) }  
  };  
}

### **4.4 WhatsApp Webhook Notification (Evolution API)**

**File:** src/app/api/webhooks/whatsapp/route.ts

import { NextRequest, NextResponse } from 'next/server';  
import { auditLog } from '@/lib/audit';  
import { createClient } from '@supabase/supabase-js';

const supabase \= createClient(process.env.NEXT\_PUBLIC\_SUPABASE\_URL\!, process.env.SUPABASE\_SERVICE\_ROLE\_KEY\!);

export async function POST(req: NextRequest) {  
  try {  
    const body \= await req.json();  
    const { message, from, type } \= body;

    await auditLog({ entity\_type: 'whatsapp\_webhook', entity\_id: from || 'unknown', action: 'RECEIVED', changes: { type }, ip\_address: req.ip || 'webhook', user\_agent: 'Evolution-API' });

    if (type \=== 'lead\_response') {  
      await supabase.from('crm\_leads').update({ status: 'CONTACTED' }).eq('contact\_info', from);  
    }  
    return NextResponse.json({ status: 'success' });  
  } catch (error) {  
    return NextResponse.json({ status: 'error' }, { status: 500 });  
  }  
}

## **📖 BAGIAN 5: PRD & AGILE USER STORIES**

### **Epic 1: Frictionless Talent Onboarding**

**US-1.1: Submit Pendaftaran Pakar**

* *Given* pengunjung berada di /join-expert.  
* *When* mengisi Zod-validated form (Nama, Gelar, Kategori, Kontak) dan Submit.  
* *Then* data masuk ke DB (is\_public=false), audit ter-log, notifikasi email Resend terkirim ke Admin, dan sistem mengembalikan pesan sukses.

### **Epic 2: The God Mode Moderation & Automation**

**US-2.1: Admin Approve & Auto-Email**

* *Given* Admin membuka admin/expert-approvals.  
* *When* Admin klik "Approve & Publish" pada baris pakar.  
* *Then* status is\_public=true, confetti muncul (UI gamifikasi), *audit log* dicatat, dan *ExpertWelcomeEmail* terkirim otomatis ke email pakar melalui Resend.

### **Epic 3: Smart Contact Routing & Lead Capture (Security Core)**

**US-3.1: Menghubungi Pakar via Modal Form**

* *Given* klien menekan "Hubungi Pakar" di /experts/\[slug\].  
* *When* klien submit modal form (Nama, Email, Kebutuhan).  
* *Then* /api/experts/contact mencatat ke crm\_leads, secara internal membaca contact\_routing dari DB (disembunyikan dari peramban), lalu mengembalikan URL wa.me/628... untuk me-redirect klien secara otomatis (Frictionless).  
* *Then* tidak ada nomor telepon mentah di Source Code/DOM HTML pakar.

### **Epic 4: Ego-Bait & Growth Engine**

**US-4.1: Embeddable Web Widget**

* *Given* pakar/developer pihak luar menyematkan skrip web component INFRAMEET di web mereka.  
* *Then* lencana pakar (Shadow DOM) muncul dengan styling premium tanpa merusak CSS eksternal, dilengkapi backlink SEO *dofollow* ke profil INFRAMEET.