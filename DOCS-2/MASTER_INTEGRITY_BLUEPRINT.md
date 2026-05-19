### **STRATEGI INTEGRASI: "TRUST AS A SERVICE"**

#### **1\. Arsitektur "Integrity-as-a-Service" (IaaS)**

Jangan membangun blockchain sendiri. Gunakan **Supabase \+ Cryptographic Signing** di sisi server (Serverless).

* **Keamanan:** Kunci privat disimpan di `Vercel Environment Variables` (di-masking).  
* **Verifikasi:** Siapa pun dapat memverifikasi integritas dokumen/sertifikat dengan membandingkan *hash* di halaman publik `/verify/[id]`.

#### **2\. Implementasi Teknikal (The Blueprint)**

# **INFRAMEET: INTEGRITY BADGE & VERIFIABLE CREDENTIAL SYSTEM**

## **1\. STRATEGI TEKNIS (NON-BLOCKCHAIN)**

* **Signature Mechanism:** Menggunakan jose (JSON Object Signing and Encryption) untuk membuat JWT yang ditandatangani secara kriptografis (ES256). JWT ini berfungsi sebagai *Verifiable Credential*.  
* **Storage:** Metadata sertifikat/dokumen disimpan di Supabase. Hash dokumen asli disimpan agar jika dokumen diubah, verifikasi akan gagal.  
* **Verification Page:** /verify/\[id\] akan mendekode JWT tersebut. Jika *signature* valid, halaman akan menampilkan lencana hijau "Verified by INFRAMEET".

## **2\. PENGEMBANGAN FITUR (SPRINT PLAN)**

### **Sprint A: The Integrity Badge (Ego-Bait)**

* **Fitur:** Setiap *Expert* yang telah *Verified* otomatis mendapatkan badge digital.  
* **Implementasi:** Badge berupa SVG dinamis (Serverless Function) yang bisa di-embed di LinkedIn/Website pakar.  
* **Value:** Pakar menampilkan badge ini sebagai bukti kredibilitas "Verified Expert by INFRAMEET".

### **Sprint B: Verifiable BAST (The Trust Anchor)**

* **Fitur:** Setelah BAST ditandatangani digital, sistem otomatis men-*generate* Verifiable Credential.  
* **Link Verifikasi:** Sertakan QR Code pada dokumen PDF hasil akhir. Saat QR di-scan, mengarah ke halaman verifikasi INFRAMEET.

### **Sprint C: The Reputation Graph (Intelligence Hub)**

* **Fitur:** Visualisasi hubungan Pakar, Proyek, dan Sitasi Jurnal di Dasbor Admin.  
* **Tools:** Gunakan @tremor/react untuk visualisasi relasi data (misalnya: *Heatmap* koneksi pakar dengan universitas).

### **3\. TATA KELOLA BRANDING (Re-Positioning)**

Untuk memastikan strategi ini memberikan dampak *Growth*, ubah cara kita berbicara di halaman publik:

* **TIDAK LAGI MENGGUNAKAN KATA:** *"Agensi"*, *"Jasa"*, *"Bantu Skripsi"*.  
* **GANTI DENGAN:**  
  * *"INFRAMEET Integrity Infrastructure"*  
  * *"Verified Research Deliverable"*  
  * *"Professional Performance Proof"*

**Contoh Copywriting di Halaman Profil Pakar:**

"Profil ini telah diverifikasi melalui protokol *Verifiable Execution* INFRAMEET. Setiap analisis statistik dan tata letak yang dihasilkan memiliki cap integritas kriptografis yang diakui dan dapat diverifikasi oleh instansi akademik/bisnis mana pun."

---

### **🤖 PROMPT EKSEKUSI UNTUK AI CODER (The "Trust Layer" Sprint)**

prompt ini untuk AI Coder memulai pembangunan modul integritas ini secara bertahap:

**Sprint 1 (Cryptographic Signing Foundation):** \> \`"@workspace Kita akan mengimplementasikan 'Integrity Infrastructure'.

1. Buat utilitas di `src/lib/integrity.ts` menggunakan pustaka `jose` untuk melakukan sign-data (ES256) terhadap dokumen/profil.  
2. Buat migrasi SQL untuk tabel `verifiable_credentials` (menyimpan hash, status revocation, dan signature).  
3. Buat halaman publik `/verify/[id]` yang dapat melakukan decode signature JWT dan menampilkan status 'VALID' jika signature cocok dengan public key kita."\`

**Sprint 2 (Visual Badging System):** `"@workspace Kita buat fitur 'Ego-Bait'. Setiap profil pakar yang 'Verified' harus memiliki tombol 'Share My Credential'. Tombol ini akan merender badge SVG dinamis (bisa di-embed di web luar) yang mengarah balik ke profil pakar kita dengan status 'Verified by INFRAMEET'. Pastikan badge ini bersifat responsive dan memiliki backlink SEO dolfollow."`

**Sprint 3 (Bounty & Reputation Hub):** `"@workspace Sesuai blueprint 'Master Growth', kita akan mulai mengintegrasikan logika reputasi. Tambahkan kolom` reputation\_score`ke tabel`expert\_directory`. Buat Server Action untuk mengupdate skor ini secara otomatis setiap kali proyek BAST ditandatangani sukses. Visualisasikan data ini di dasbor menggunakan @tremor/react."`

---

Dengan menambahkan **"Trust Layer"** (kriptografi & audit), INFRAMEET bukan lagi sekadar platform "bantu-bantu", melainkan menjadi **Lembaga Sertifikasi/Verifikasi Digital** yang sangat disegani.

