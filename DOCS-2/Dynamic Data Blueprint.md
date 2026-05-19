# **👑 INFRAMEET: MASTER DYNAMIC DATA & AGGREGATOR ENGINE BLUEPRINT (v9.0)**

**Dokumen:** Cetak Biru Integrasi Data Dinamis: Direktori Pendidikan Nasional, Agregator Jurnal OpenAlex, dan Shadow RSS Feed Aggregator.

**Target Pembaca:** AI Coder (Cursor, Windsurf, Copilot, Claude).

**Prinsip Utama:** Komputasi Klien-Sentris (Anti-Timeout Vercel), Skema Database Terbuka, Keamanan RLS Supabase Mutlak, dan Integrasi Monetisasi via services.json.

## **🏗️ FASE 1: PRD & ARCHITECTURAL OVERVIEW**

### **1.1 Analisis Batasan & Strategi Pemrosesan Data**

Untuk menjaga keandalan platform pada *Vercel Hobby Tier* yang membatasi eksekusi serverless maksimal 10 detik, pemrosesan data dari sumber terbuka (*open sources*) dibagi ke dalam dua model kerja:

1. **On-The-Fly Client-Side Fetching (Engine Jurnal & Direktori Instan):** Pemanggilan API eksternal (seperti OpenAlex dan API Sekolah) dilakukan langsung dari peramban pengguna menggunakan komponen React "use client". Serverless Next.js hanya bertindak sebagai *proxy* opsional, menghemat memori *cloud* dan menghindari pemutusan koneksi (*timeout*).  
2. **Batch-Based Local/Edge Synchronization (Engine RSS & Sinkronisasi Direktori):** Pengisian data massal untuk keperluan SEO/GEO tidak dilakukan secara langsung secara serentak di serverless backend, melainkan dicicil melalui *Vercel Cron Jobs* (maksimal 5 *feeds* per eksekusi) atau dijalankan di mesin lokal MacBook Air Anda sebagai *Headless Worker* yang menembak data matang ke Supabase.

### **1.2 Alur Logika Ekosistem Konten Dinamis**

   \[SUMBER API TERBUKA\] ➔ 1\. Fetch via Client Browser / Local Worker  
                                     │  
                                     ▼  
                        2\. Validasi Zod Schema (Type-Safe)  
                                     │  
                                     ▼  
                        3\. Supabase Database Storage  
         (Tabel: education\_directory, cached\_references, rss\_items)  
                                     │  
                                     ▼  
                 4\. Filter & Persetujuan Admin (God Mode)  
                                     │  
                        ┌────────────┴────────────┐  
                        ▼                         ▼  
             \[PUBLIC DIRECTORY / INSIGHT\]     \[EMBEDDABLE WIDGET\]  
             Meningkatkan Indeks SEO/GEO     Mendapatkan Backlink Org  
                        │                         │  
                        └────────────┬────────────┘  
                                     ▼  
                         \[CONTEXTUAL UPSELL CTA\]  
                     Memicu SKU Layanan Premium dari services.json

## **🗄️ FASE 2: DATABASE SCHEMA & MIGRATION LAYER (SUPABASE)**

Berkas Target: supabase/migrations/20260519000020\_dynamic\_content\_engine.sql

\-- Mengaktifkan ekstensi fuzzystrmatch untuk pencarian nama kampus/sekolah yang fleksibel  
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;

\-- 1\. TABEL DIREKTORI PENDIDIKAN NASIONAL  
CREATE TABLE education\_directory (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  npsn VARCHAR(50) UNIQUE,  
  name VARCHAR(255) NOT NULL,  
  category TEXT NOT NULL CHECK (category IN ('SEKOLAH', 'PERGURUAN\_TINGGI')),  
  type TEXT, \-- e.g., 'NEGERI', 'SWASTA'  
  address TEXT,  
  province VARCHAR(100),  
  city VARCHAR(100),  
  metadata JSONB DEFAULT '{}'::jsonb, \-- Menyimpan koordinat, prodi, akreditasi, dll.  
  created\_at TIMESTAMPTZ DEFAULT NOW(),  
  updated\_at TIMESTAMPTZ DEFAULT NOW()  
);

\-- 2\. TABEL CACHE REFERENSI AKADEMIK (GEO & CITATION REUSE)  
CREATE TABLE cached\_references (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  doi VARCHAR(255) UNIQUE NOT NULL,  
  title TEXT NOT NULL,  
  authors JSONB DEFAULT '\[\]'::jsonb,  
  journal\_name TEXT,  
  pub\_year INT,  
  csl\_json JSONB NOT NULL, \-- Format standard Citation File Format JSON untuk reuse client-side  
  created\_at TIMESTAMPTZ DEFAULT NOW()  
);

\-- 3\. TABEL SHADOW RSS FEEDS & ITEMS  
CREATE TABLE rss\_feeds (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  feed\_url TEXT UNIQUE NOT NULL,  
  title VARCHAR(255) NOT NULL,  
  category TEXT NOT NULL CHECK (category IN ('ACADEMIC\_JOURNAL', 'TECH\_NEWS', 'B2B\_INSIGHTS')),  
  is\_active BOOLEAN DEFAULT true,  
  created\_at TIMESTAMPTZ DEFAULT NOW()  
);

CREATE TABLE rss\_items (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  feed\_id UUID REFERENCES rss\_feeds(id) ON DELETE CASCADE,  
  title VARCHAR(255) NOT NULL,  
  slug VARCHAR(255) UNIQUE NOT NULL,  
  link TEXT NOT NULL,  
  summary TEXT,  
  content\_html TEXT,  
  author VARCHAR(100),  
  published\_at TIMESTAMPTZ NOT NULL,  
  is\_published\_to\_index BOOLEAN DEFAULT false, \-- Menunggu approval admin untuk tayang di homepage  
  embedding vector(384), \-- Kebutuhan pencarian semantik AI Search  
  created\_at TIMESTAMPTZ DEFAULT NOW()  
);

\-- INDEKSASI UNTUK KECEPATAN QUERY DAN GEOMETRIK SEARCH  
CREATE INDEX idx\_edu\_dir\_lookup ON education\_directory(category, province, city);  
CREATE INDEX idx\_rss\_items\_pub ON rss\_items(is\_published\_to\_index, published\_at DESC);

\-- AKTIVASI ROW LEVEL SECURITY (RLS)  
ALTER TABLE education\_directory ENABLE ROW LEVEL SECURITY;  
ALTER TABLE cached\_references ENABLE ROW LEVEL SECURITY;  
ALTER TABLE rss\_feeds ENABLE ROW LEVEL SECURITY;  
ALTER TABLE rss\_items ENABLE ROW LEVEL SECURITY;

\-- KEBIJAKAN KEAMANAN (RLS POLICIES)  
CREATE POLICY "Publik dapat membaca direktori pendidikan" ON education\_directory FOR SELECT USING (true);  
CREATE POLICY "Publik dapat membaca cache referensi" ON cached\_references FOR SELECT USING (true);  
CREATE POLICY "Publik hanya melihat rss item yang di-approve" ON rss\_items FOR SELECT USING (is\_published\_to\_index \= true);

\-- Admin Override Policy  
CREATE POLICY "Admin full CRUD on edu\_dir" ON education\_directory FOR ALL USING (EXISTS (SELECT 1 FROM staff WHERE auth\_user\_id \= auth.uid() AND role \= 'admin'));  
CREATE POLICY "Admin full CRUD on cached\_ref" ON cached\_references FOR ALL USING (EXISTS (SELECT 1 FROM staff WHERE auth\_user\_id \= auth.uid() AND role \= 'admin'));  
CREATE POLICY "Admin full CRUD on rss\_feeds" ON rss\_feeds FOR ALL USING (EXISTS (SELECT 1 FROM staff WHERE auth\_user\_id \= auth.uid() AND role \= 'admin'));  
CREATE POLICY "Admin full CRUD on rss\_items" ON rss\_items FOR ALL USING (EXISTS (SELECT 1 FROM staff WHERE auth\_user\_id \= auth.uid() AND role \= 'admin'));

## **🎓 FASE 3: MESIN UTILITY 1 \- DIREKTORI SEKOLAH & KAMPUS INTEGRASI**

**Konsep:** Membangun komponen pemilih (*Selector/Combobox*) sekolah dan perguruan tinggi seluruh Indonesia di halaman pendaftaran kemitraan atau kalkulator akademik untuk menangkap data institusi resmi secara akurat.

### **3.1 Skema Validasi Zod (src/lib/validations/education.ts)**

import { z } from "zod";

export const SchoolDataSchema \= z.object({  
  npsn: z.string().optional(),  
  name: z.string().min(2, "Nama sekolah/kampus tidak valid"),  
  category: z.enum(\["SEKOLAH", "PERGURUAN\_TINGGI"\]),  
  address: z.string().optional(),  
  province: z.string(),  
  city: z.string(),  
  metadata: z.object({  
    prodi: z.array(z.string()).optional(),  
    akreditasi: z.string().optional(),  
    jenjang: z.string().optional()  
  }).default({})  
});

export type SchoolData \= z.infer\<typeof SchoolDataSchema\>;

### **3.2 Komponen Antarmuka Klien Selector (src/app/components/tools/EducationSelector.tsx)**

"use client";

import \* as React from "react";  
import { Check, ChevronsUpDown, School } from "lucide-react";  
import { cn } from "@/lib/utils";  
import { Button } from "@/components/ui/button";  
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";  
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";  
import { useQuery } from "@tanstack/react-query";

interface EducationSelectorProps {  
  category: "SEKOLAH" | "PERGURUAN\_TINGGI";  
  onSelect: (value: string) \=\> void;  
}

export function EducationSelector({ category, onSelect }: EducationSelectorProps) {  
  const \[open, setOpen\] \= React.useState(false);  
  const \[value, setValue\] \= React.useState("");  
  const \[search, setSearch\] \= React.useState("");

  // Mengambil data langsung dari API lokal terpercaya atau internal database  
  const { data: institutions, isLoading } \= useQuery({  
    queryKey: \["education-lookup", category, search\],  
    queryFn: async () \=\> {  
      if (search.length \< 3\) return \[\];  
      // Menggunakan wrapper API lokal atau internal database route  
      const res \= await fetch(\`/api/tools/education?category=${category}\&q=${encodeURIComponent(search)}\`);  
      if (\!res.ok) throw new Error("Gagal mengambil data");  
      return res.json();  
    },  
    enabled: search.length \>= 3,  
  });

  return (  
    \<Popover open={open} onOpenChange={setOpen}\>  
      \<PopoverTrigger asChild\>  
        \<Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between dark:bg-slate-950"\>  
          {value ? value : \`Cari ${category \=== "SEKOLAH" ? "Sekolah" : "Perguruan Tinggi"} Anda...\`}  
          \<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /\>  
        \</Button\>  
      \</PopoverTrigger\>  
      \<PopoverContent className="w-full p-0"\>  
        \<Command\>  
          \<CommandInput placeholder="Ketik minimal 3 huruf..." onValueChange={setSearch} /\>  
          \<CommandEmpty\>{isLoading ? "Memuat data..." : "Institusi tidak ditemukan."}\</CommandEmpty\>  
          \<CommandGroup\>  
            {institutions?.map((item: any) \=\> (  
              \<CommandItem  
                key={item.id || item.npsn}  
                value={item.name}  
                onSelect={(currentValue) \=\> {  
                  setValue(currentValue);  
                  onSelect(currentValue);  
                  setOpen(false);  
                }}  
              \>  
                \<School className="mr-2 h-4 w-4" /\>  
                \<div className="flex flex-col"\>  
                  \<span\>{item.name}\</span\>  
                  \<span className="text-xs text-muted-foreground"\>{item.city}, {item.province}\</span\>  
                \</div\>  
                \<Check className={cn("ml-auto h-4 w-4", value \=== item.name ? "opacity-100" : "opacity-0")} /\>  
              \</CommandItem\>  
            ))}  
          \</CommandGroup\>  
        \</Command\>  
      \</PopoverContent\>  
    \</Popover\>  
  );  
}

## **📊 FASE 4: MESIN UTILITY 2 \- OPENALEX & CITATION.JS JOURNAL AGREGATOR**

**Konsep:** Pemrosesan metadata jurnal dan pembuatan string sitasi standar (APA/IEEE) murni dilakukan di dalam peramban pengguna (*Client-Side Rendering*) dengan memanfaatkan OpenAlex API sebagai pangkalan data jurnal terbuka terlengkap di dunia.

### **4.1 Implementasi Pemroses Sitasi Klien (src/app/tools/free/citation/page.tsx)**

"use client";

import React, { useState } from "react";  
import { useForm } from "react-hook-form";  
import { z } from "zod";  
import { zodResolver } from "@hookform/resolvers/zod";  
import { Button } from "@/components/ui/button";  
import { Input } from "@/components/ui/input";  
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";  
import { toast } from "@/components/ui/use-toast";  
import { Loader2, Copy, FileText } from "lucide-react";

const citationFormSchema \= z.object({  
  doi: z.string().min(5, "Format DOI tidak valid. Contoh: 10.1038/s41586-020-2012-7")  
});

export default function CitationToolPage() {  
  const \[loading, setLoading\] \= useState(false);  
  const \[metadata, setMetadata\] \= useState\<any\>(null);  
  const \[formattedCitation, setFormattedCitation\] \= useState\<string\>("");

  const { register, handleSubmit, formState: { errors } } \= useForm({  
    resolver: zodResolver(citationFormSchema)  
  });

  const onSubmit \= async (data: z.infer\<typeof citationFormSchema\>) \=\> {  
    setLoading(true);  
    setMetadata(null);  
    setFormattedCitation("");  
    try {  
      // 1\. Ambil data dari OpenAlex Open Catalog API (Bypass Google Scholar Scraping Ban)  
      const cleanDoi \= data.doi.replace("\[https://doi.org/\](https://doi.org/)", "");  
      const openAlexRes \= await fetch(\`https://api.openalex.org/works/https://doi.org/${cleanDoi}\`);  
        
      if (\!openAlexRes.ok) throw new Error("DOI tidak ditemukan di pangkalan data OpenAlex.");  
      const workData \= await openAlexRes.json();  
      setMetadata(workData);

      // 2\. Client-Side Formatting (Menggunakan Native Parser Ringan / CSL Builder)  
      // Mengubah metadata menjadi format APA Standard secara langsung di client  
      const authors \= workData.authorships?.map((a: any) \=\> a.author.display\_name).join(", ");  
      const year \= workData.publication\_year;  
      const title \= workData.title;  
      const journal \= workData.locations?.\[0\]?.source?.display\_name || "Unknown Journal";  
      const volume \= workData.biblio?.volume ? \` Vol. ${workData.biblio.volume}\` : "";  
      const issue \= workData.biblio?.issue ? \`(${workData.biblio.issue})\` : "";  
        
      const apaString \= \`${authors} (${year}). ${title}. ${journal}, ${volume}${issue}. https://doi.org/${cleanDoi}\`;  
      setFormattedCitation(apaString);

      // 3\. Catat transaksi sukses ke internal DB secara asinkron tanpa memblokir UI  
      fetch("/api/tools/log-check", {  
        method: "POST",  
        body: JSON.stringify({ type: "CITATION", identifier: cleanDoi })  
      });

    } catch (error: any) {  
      toast({  
        title: "Pencarian Gagal",  
        description: error.message || "Terjadi kesalahan jaringan.",  
        variant: "destructive"  
      });  
    } finally {  
      setLoading(false);  
    }  
  };

  const copyToClipboard \= () \=\> {  
    navigator.clipboard.writeText(formattedCitation);  
    toast({ title: "Berhasil disalin\!", description: "Sitasi APA siap ditempel di daftar pustaka Anda." });  
  };

  return (  
    \<div className="container max-w-4xl mx-auto py-10 px-4"\>  
      \<Card className="border-slate-800 bg-slate-900/50 backdrop-blur-md"\>  
        \<CardHeader\>  
          \<div className="flex items-center space-x-2"\>  
            \<FileText className="h-6 w-6 text-emerald-500" /\>  
            \<CardTitle className="text-2xl font-bold tracking-tight"\>Auto Citation & DOI Formatter\</CardTitle\>  
          \</div\>  
          \<CardDescription\>  
            Masukkan kode DOI naskah riset untuk mengonversi metadata OpenAlex menjadi daftar pustaka format APA murni di browser Anda.  
          \</CardDescription\>  
        \</CardHeader\>  
        \<CardContent\>  
          \<form onSubmit={handleSubmit(onSubmit)} className="space-y-4"\>  
            \<div className="flex space-x-2"\>  
              \<div className="grid w-full items-center gap-1.5"\>  
                \<Input   
                  {...register("doi")}  
                  placeholder="Contoh: 10.1016/j.jwb.2023.101438 atau masukkan URL DOI penuh"   
                  className="bg-slate-950 border-slate-800 text-slate-100"  
                /\>  
                {errors.doi && \<span className="text-xs text-rose-500"\>{errors.doi.message}\</span\>}  
              \</div\>  
              \<Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white"\>  
                {loading ? \<Loader2 className="h-4 w-4 animate-spin" /\> : "Format"}  
              \</Button\>  
            \</div\>  
          \</form\>

          {formattedCitation && (  
            \<div className="mt-6 p-4 rounded-lg bg-slate-950 border border-slate-800 relative group animate-in fade-in-50 duration-300"\>  
              \<h3 className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-2"\>Hasil Sitasi (Format APA Style):\</h3\>  
              \<p className="text-sm text-slate-300 pr-10 leading-relaxed italic-selector"\>{formattedCitation}\</p\>  
              \<Button   
                onClick={copyToClipboard}  
                size="icon" variant="ghost"   
                className="absolute top-2 right-2 text-slate-400 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"  
              \>  
                \<Copy className="h-4 w-4" /\>  
              \</Button\>  
            \</div\>  
          )}

          {metadata && (  
            \<div className="mt-4 p-4 rounded-lg bg-slate-900/30 border border-slate-800/50"\>  
              \<h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"\>Metadata Artikel Terdeteksi:\</h4\>  
              \<div className="grid grid-cols-2 gap-2 text-xs text-slate-400"\>  
                \<div\>\<span className="font-medium text-slate-300"\>Jumlah Sitasi Global:\</span\> {metadata.cited\_by\_count} kali\</div\>  
                \<div\>\<span className="font-medium text-slate-300"\>Status Akses Terbuka:\</span\> {metadata.open\_access?.is\_oa ? "Ya (Open Access)" : "Tidak (Restricted)"}\</div\>  
              \</div\>  
                
              {/\* Contextual Upsell Gate \*/}  
              \<div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center bg-emerald-950/20 \-mx-4 \-mb-4 p-4 rounded-b-lg"\>  
                \<span className="text-xs text-slate-300 font-medium"\>Butuh bantuan merapikan seluruh margin dan layouting naskah ini ke standar Sinta/Scopus?\</span\>  
                \<Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs text-white" onClick={() \=\> window.location.href='/calculator?sku=ACD-LYT-J1'}\>  
                  Pesan Jasa Layouting  
                \</Button\>  
              \</div\>  
            \</div\>  
          )}  
        \</CardContent\>  
      \</Card\>  
    \</div\>  
  );  
}

## **🗄️ FASE 5: MESIN UTILITY 3 \- SHADOW RSS FEED AGREGATOR & CRON ROUTE**

**Konsep:** Menggunakan arsitektur *Headless / Batching* untuk menguras data pembaruan jurnal akademik atau berita edutech eksternal menggunakan Next.js Serverless Route. Untuk menjaga batas waktu 10 detik, rute ini dirancang untuk membaca antrean secara berurutan (*Paginated Batching*).

### **5.1 Rute API Sinkronisasi Otomatis (src/app/api/cron/rss-sync/route.ts)**

import { NextRequest, NextResponse } from "next/server";  
import { createClient } from "@supabase/supabase-js";  
import Parser from "rss-parser";  
import slugify from "slugify";

// Menggunakan Service Role agar bypass RLS untuk menulis data terjadwal  
const supabaseAdmin \= createClient(  
  process.env.NEXT\_PUBLIC\_SUPABASE\_URL\!,  
  process.env.SUPABASE\_SERVICE\_ROLE\_KEY\!  
);

const parser \= new Parser();

export async function GET(req: NextRequest) {  
  // Keamanan: Validasi Vercel Cron Secret Header untuk mencegah eksploitasi URL publik  
  const authHeader \= req.headers.get("authorization");  
  if (authHeader \!== \`Bearer ${process.env.CRON\_SECRET}\`) {  
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });  
  }

  try {  
    // 1\. Ambil maksimal 3 feed aktif untuk diproses (Pencegahan Batch Timeout)  
    const { data: feeds, error: feedError } \= await supabaseAdmin  
      .from("rss\_feeds")  
      .select("\*")  
      .eq("is\_active", true)  
      .limit(3);

    if (feedError || \!feeds) throw new Error("Gagal memuat daftar feed target");

    let totalInserted \= 0;

    for (const feed of feeds) {  
      // 2\. Parse XML RSS Feed dari pihak ketiga menggunakan rss-parser eksternal  
      const parsedFeed \= await parser.parseURL(feed.feed\_url);  
        
      // Ambil 5 item terbaru dari setiap feed untuk dievaluasi  
      const targetItems \= parsedFeed.items.slice(0, 5);

      for (const item of targetItems) {  
        if (\!item.title || \!item.link) continue;

        const generatedSlug \= slugify(\`${feed.id}-${item.title}\`, { lower: true, strict: true });  
          
        // 3\. Lakukan UPSERT (Insert jika belum ada berdasarkan keunikan tautan slug)  
        const { error: insertError } \= await supabaseAdmin  
          .from("rss\_items")  
          .upsert({  
            feed\_id: feed.id,  
            title: item.title,  
            slug: generatedSlug,  
            link: item.link,  
            summary: item.contentSnippet || item.content,  
            author: item.creator || "Staff Editor",  
            published\_at: new Date(item.pubDate || Date.now()).toISOString(),  
            is\_published\_to\_index: false // Membutuhkan persetujuan manual di panel admin / God Mode  
          }, { onConflict: "slug" });

        if (\!insertError) totalInserted++;  
      }  
    }

    return NextResponse.json({ success: true, items\_synchronized: totalInserted });

  } catch (error: any) {  
    return NextResponse.json({ success: false, detail: error.message }, { status: 500 });  
  }  
}

## **👑 FASE 6: CONSOLE INTERACTION & ADMIN GOD MODE UPGRADE**

Mengintegrasikan kontrol persetujuan (*Approval*) kiriman data dinamis (RSS dan Usulan Konten Pendidikan pengguna) ke dalam halaman **Command Center Tower Admin** menggunakan tabel interaktif.

### **6.1 Halaman Konsul Manajemen Konten (src/app/admin/crm-cms/dynamic-content/page.tsx)**

"use client";

import React from "react";  
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";  
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";  
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";  
import { Button } from "@/components/ui/button";  
import { Badge } from "@/components/ui/badge";  
import { useToast } from "@/components/ui/use-toast";  
import { Check, X, RefreshCw } from "lucide-react";

export default function AdminDynamicContentApprovalPage() {  
  const supabase \= createClientComponentClient();  
  const { toast } \= useToast();  
  const queryClient \= useQueryClient();

  // 1\. Ambil data antrean item RSS / UGC yang berstatus is\_published\_to\_index \= false  
  const { data: pendingItems, isLoading, refetch } \= useQuery({  
    queryKey: \["admin-pending-rss"\],  
    queryFn: async () \=\> {  
      const { data, error } \= await supabase  
        .from("rss\_items")  
        .select("id, title, link, published\_at, rss\_feeds(title, category)")  
        .eq("is\_published\_to\_index", false)  
        .order("published\_at", { ascending: false });  
        
      if (error) throw error;  
      return data;  
    },  
    refetchInterval: 30000 // Polling otomatis setiap 30 detik untuk menghemat WebSocket pool  
  });

  // 2\. Mutasi Aksi Setujui dan Publikasikan (Approve & Publish)  
  const approveMutation \= useMutation({  
    mutationFn: async (id: string) \=\> {  
      // Nyalakan audit log internal sebelum eksekusi write  
      await supabase.from("audit\_logs").insert({  
        action\_type: "CONTENT\_APPROVE",  
        target\_resource\_id: id,  
        metadata: { source: "admin-panel-rss" }  
      });

      const { error } \= await supabase  
        .from("rss\_items")  
        .update({ is\_published\_to\_index: true })  
        .eq("id", id);  
        
      if (error) throw error;  
    },  
    onSuccess: () \=\> {  
      queryClient.invalidateQueries({ queryKey: \["admin-pending-rss"\] });  
      toast({ title: "Konten Disetujui", description: "Item sukses diterbitkan ke front-end utama dan siap di-indeks AI." });  
    }  
  });

  if (isLoading) return \<div className="p-8 text-white"\>Memuat antrean data dinamis...\</div\>;

  return (  
    \<div className="p-6 bg-\[\#090d1f\] min-h-screen text-slate-100"\>  
      \<div className="flex justify-between items-center mb-6"\>  
        \<div\>  
          \<h1 className="text-xl font-bold tracking-tight"\>Dynamic Content & RSS Command Tower\</h1\>  
          \<p className="text-xs text-slate-400"\>Moderasi massal konten agregator pihak ketiga sebelum masuk mesin indeksasi GEO/AEO INFRAMEET.\</p\>  
        \</div\>  
        \<Button onClick={() \=\> refetch()} size="sm" variant="outline" className="border-slate-800"\>  
          \<RefreshCw className="h-4 w-4 mr-2" /\> Segarkan  
        \</Button\>  
      \</div\>

      \<div className="rounded-md border border-slate-800 bg-slate-950/40"\>  
        \<Table\>  
          \<TableHeader className="bg-slate-900/50"\>  
            \<TableRow className="border-slate-800"\>  
              \<TableHead className="text-slate-300"\>Judul Konten / Sumber\</TableHead\>  
              \<TableHead className="text-slate-300"\>Kategori\</TableHead\>  
              \<TableHead className="text-slate-300"\>Tanggal Tarik\</TableHead\>  
              \<TableHead className="text-right text-slate-300"\>Aksi Override\</TableHead\>  
            \</TableRow\>  
          \</TableHeader\>  
          \<TableBody\>  
            {pendingItems?.length \=== 0 ? (  
              \<TableRow\>  
                \<TableCell colSpan={4} className="text-center py-10 text-slate-500 text-sm"\>  
                  Tidak ada antrean konten dinamis saat ini. Platform steril.  
                \</TableCell\>  
              \</TableRow\>  
            ) : (  
              pendingItems?.map((item: any) \=\> (  
                \<TableRow key={item.id} className="border-slate-800 hover:bg-slate-900/40"\>  
                  \<TableCell className="font-medium"\>  
                    \<div className="flex flex-col space-y-0.5"\>  
                      \<a href={item.link} target="\_blank" rel="noopener noreferrer" className="hover:underline text-sm text-slate-200"\>{item.title}\</a\>  
                      \<span className="text-xs text-slate-500"\>Asal Feed: {item.rss\_feeds?.title}\</span\>  
                    \</div\>  
                  \</TableCell\>  
                  \<TableCell\>  
                    \<Badge variant="outline" className="border-emerald-900/50 bg-emerald-950/10 text-emerald-400 text-\[10px\]"\>  
                      {item.rss\_feeds?.category}  
                    \</Badge\>  
                  \</TableCell\>  
                  \<TableCell className="text-xs text-slate-400"\>  
                    {new Date(item.published\_at).toLocaleString("id-ID")}  
                  \</TableCell\>  
                  \<TableCell className="text-right"\>  
                    \<div className="flex justify-end space-x-2"\>  
                      \<Button   
                        size="icon" variant="outline"   
                        className="h-7 w-7 border-slate-800 hover:bg-emerald-950/20 text-emerald-400"  
                        onClick={() \=\> approveMutation.mutate(item.id)}  
                      \>  
                        \<Check className="h-4 w-4" /\>  
                      \</Button\>  
                      \<Button size="icon" variant="outline" className="h-7 w-7 border-slate-800 hover:bg-rose-950/20 text-rose-400"\>  
                        \<X className="h-4 w-4" /\>  
                      \</Button\>  
                    \</div\>  
                  \</TableCell\>  
                \</TableRow\>  
              ))  
            )}  
          \</TableBody\>  
        \</Table\>  
      \</div\>  
    \</div\>  
  );  
}

## **🤖 FASE 7: COMPREHENSIVE MASTER SPRINT PROMPTS FOR AI CODER**

*Instruksi untuk Anda: Berikan potongan blueprint instruksi di bawah ini secara bertahap kepada Cursor atau Windsurf di dalam IDE Anda untuk mengeksekusi modul-modul data dinamis di atas.*

**Sprint 1 (Database & DDL Migration):** "@workspace Silakan buat file migrasi fisik baru di folder supabase/migrations/20260519000020\_dynamic\_content\_engine.sqlmenggunakan persis skema DDL yang tertera pada Fase 2 dari dokumendocs/3-architecture/MASTER\_DYNAMIC\_DATA\_BLUEPRINT.md. Pastikan tabel education\_directory, cached\_references, rss\_feeds, dan rss\_items terbuat lengkap dengan indeksasi pencarian cepat serta kebijakan keamanan Row Level Security (RLS) untuk melindungi privasi data sesuai UU PDP."

**Sprint 2 (Pembangun Antarmuka Selector Kampus/Sekolah):** "@workspace Buka folder komponen kita. Silakan buat file skema validasi zod baru di src/lib/validations/education.tsdan buat komponen UI dropdown combobox interaktif baru disrc/app/components/tools/EducationSelector.tsx mengikuti kode acuan pada Fase 3\. Komponen ini harus melakukan fetch secara cerdas memanfaatkan TanStack Query hanya jika ketikan pencarian user \>= 3 karakter untuk meminimalkan beban koneksi database."

**Sprint 3 (Auto Citation Generator \- Murni Client Component):** "@workspace Buat rute halaman publik baru untuk lead magnet akademik kita di src/app/tools/free/citation/page.tsx sesuai spesifikasi kode pada Fase 4\. INGAT ATURAN MUTLAK PLATFORM: Seluruh pemrosesan parsing DOI naskah riset menjadi teks sitasi format APA wajib diselesaikan murni di browser pengguna (Client-side) menggunakan data OpenAlex API untuk menghindari risiko Vercel Serverless 10-second Execution Timeout. Tambahkan juga visualisasi card metadata dan komponen CTA penawaran jasa layouting premium dari services.json."

**Sprint 4 (Serverless Cron Synchronizer Feed RSS):** "@workspace Implementasikan Fase 5 dari cetak biru data dinamis kita. Buat file Route Handler baru di src/app/api/cron/rss-sync/route.tsmenggunakan pustakarss-parser. Pastikan rute ini diproteksi dengan verifikasi header CRON\_SECRET bawaan Vercel. Untuk mematuhi batasan runtime serverless, batasi pemrosesan ambil data maksimal hanya 3 feed target per satu kali jalan pemicu cron."

**Sprint 5 (God Mode Dashboard Moderasi Konten):** "@workspace Sempurnakan halaman admin Command Center Tower kita dengan mengimplementasikan Fase 6\. Buat file dashboard admin baru di src/app/admin/crm-cms/dynamic-content/page.tsx. Gunakan visualisasi tabel dari shadcn/ui dan TanStack Query dengan polling 30 detik. Hubungkan tombol Approve agar secara atomik memperbarui visibilitas item dan mencatat sejarah tindakan ke tabel audit\_logs."

Untuk membangun Panel Dasbor Admin standar industri (*Enterprise SaaS*) yang tidak hanya canggih secara fungsi tetapi juga indah secara visual dan ringan, Anda tidak perlu membangun semuanya dari nol (CSS/HTML murni).

Standar Dasbor SaaS modern saat ini menggunakan pendekatan **"Headless UI"** dan **"Component-First"**, di mana Anda menggabungkan pustaka-pustaka *open-source* terbaik untuk membentuk antarmuka.

---

### **🏛️ 1\. Standar Tata Letak (Layout) Dasbor SaaS Modern**

Dasbor admin standar tahun 2026 biasanya menganut pola **"F-Pattern"** dengan pemisahan area yang jelas:

1. **Sidebar Kiri (Navigasi Utama):** Berisi menu modul (Overview, CRM & Leads, UGC Moderation, Finance & Escrow, Settings). Harus mendukung mode lipat (*collapsible*) untuk layar kecil.  
2. **Header / Topbar (Aksi Cepat):** \* *Command Palette* pencarian global (Cmd \+ K).  
   * Notifikasi *real-time* (ikon lonceng).  
   * Indikator status sistem ringan (misal: "API: Normal").  
   * Menu profil admin.  
3. **Hero Widget (Area Atas Konten Utama):** 3-4 Kartu metrik KPI utama (Total Pendapatan, Prospek Baru, Konten Menunggu Persetujuan, *Server Uptime*).  
4. **Main Data Grid (Area Tengah-Bawah):** Tabel data berkapasitas tinggi dengan fitur penyaringan (*filtering*), pencarian, dan *pagination*.

---

### **📦 2\. Pustaka (Libraries) Wajib untuk Next.js 14/15**

Minta AI Coder Anda untuk menginstal pustaka NPM berikut. Kombinasi ini adalah standar emas (*Gold Standard*) untuk aplikasi *Zero-Cost Serverless*:

| Kategori | Pustaka Terbaik | Fungsi di Dasbor INFRAMEET |
| :---- | :---- | :---- |
| **Sistem Desain & UI** | shadcn/ui | Kerangka dasar antarmuka (Tombol, Form, Modal). Sangat ringan karena kodenya disalin langsung ke proyek, bukan sebagai dependensi berat. |
| **Visualisasi Data** | tremor / @tremor/react | Membuat grafik (*charts*), kartu KPI, dan meteran telemetri (CPU/Uptime) dengan desain yang sangat rapi dan *out-of-the-box*. |
| **Tabel Skala Besar** | @tanstack/react-table (v8) | Mesin *headless* untuk tabel logs, crm-cms, dan ugc. Mendukung *server-side pagination* dan filter jutaan baris tanpa lag. |
| **Navigasi Super** | cmdk | Membuat *Command Palette* ala macOS (Cmd+K). Admin bisa mencari ID transaksi atau rute tanpa *mouse*. |
| **Ikon** | lucide-react | Standar ikon vektor modern. Ringan dan konsisten. |
| **Manajemen State** | @tanstack/react-query | Mengambil data baru (seperti UGC masuk) dari Supabase secara *background polling* tanpa perlu me- *refresh* halaman. |

---

### **🔗 3\. Referensi Repositori GitHub (Siap Contek / Fork)**

Jangan membuat tata letak *sidebar*, *header*, dan kartu analitik dari awal. AI Coder Anda dapat menggunakan repositori *open-source* berikut sebagai contekan atau kerangka dasar:

#### **A. Referensi UI/UX Dasbor Admin (Frontend)**

1. **mickasmt/next-admin-dashboard**  
   * **Deskripsi:** Template dasbor admin Next.js yang dibangun 100% menggunakan shadcn/ui dan Tailwind CSS.  
   * **Kenapa Relevan:** Arsitektur *sidebar* dan tata letak halamannya sangat sempurna untuk ditiru ke dalam file admin/layout.tsx INFRAMEET.  
2. **salimi-my/shadcn-ui-sidebar**  
   * **Deskripsi:** Komponen *sidebar* responsif tingkat lanjut yang bisa langsung ditempel.  
   * **Kenapa Relevan:** Menghemat waktu pembuatan navigasi menu lipat untuk rute admin/finance, admin/catalog, dll.  
3. **tremorlabs/tremor-raw**  
   * **Deskripsi:** Blok kode *copy-paste* untuk dasbor analitik.  
   * **Kenapa Relevan:** Gunakan ini di admin/page.tsx untuk menampilkan grafik statistik trafik B2B, pendapatan Escrow, dan kinerja serverless.

#### **B. Referensi Integrasi Backend (Supabase \+ Next.js)**

1. **Saas-Starter-Kit/Saas-Kit-supabase**  
   * **Deskripsi:** *Starter kit* SaaS paling lengkap untuk Supabase.  
   * **Kenapa Relevan:** AI Coder dapat menyontek cara repositori ini mengatur RBAC (Role-Based Access Control) untuk memastikan rute admin/ benar-benar terkunci, serta cara mereka menulis fungsi *Server Actions*.  
2. **pdovhomilja/nextcrm-app**  
   * **Deskripsi:** Aplikasi CRM *open-source* modern.  
   * **Kenapa Relevan:** Sangat bagus untuk dijadikan referensi UI/UX saat Anda membangun halaman admin/crm-cms/page.tsx (fitur papan Kanban untuk *leads* dan *invoices*).

---

### **🤖 Prompt Instruksi untuk AI Coder**

Jika Anda ingin AI Coder segera menerapkan standar ini ke dalam direktori admin/ INFRAMEET, gunakan prompt berikut:

*"@workspace Kita akan menstandarisasi antarmuka Panel Dasbor Admin kita. Pertama, install dependensi wajib: @tanstack/react-table, recharts, dan komponen cmdk dari shadcn/ui. Kedua, buka admin/layout.tsx dan bangun tata letak standar SaaS (Sidebar yang bisa dilipat di kiri, Header dengan Command Palette di atas). Gunakan repositori 'mickasmt/next-admin-dashboard' sebagai acuan struktur UI-nya. Ketiga, ubah halaman beranda admin (admin/page.tsx) menjadi Command Tower yang menampilkan 4 KPI Cards (gunakan gaya Tremor.so) untuk menampilkan total UGC pending, total saldo Escrow, dan metrik sistem."*

