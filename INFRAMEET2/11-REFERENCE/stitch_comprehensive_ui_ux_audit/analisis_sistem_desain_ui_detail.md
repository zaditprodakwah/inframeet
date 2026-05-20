# Analisis Mendalam Sistem Desain & UI/UX INFRAMEET

## 1. Analisis Sistem Desain & Visual Identity
### Tipografi (Typography)
*   **Status Saat Ini:** Menggunakan sans-serif standar. Terasa bersih namun kurang memiliki karakter "teknis" yang kuat untuk brand infrastruktur.
*   **Evaluasi:** Kurangnya kontras ukuran (type scale) antara heading (H1-H3) membuat pemindaian konten (scanning) sedikit sulit pada halaman teks padat.
*   **Rekomendasi:** Implementasikan font **Monospace** (seperti JetBrains Mono atau Roboto Mono) khusus untuk label data, angka statistik, dan elemen teknis. Gunakan font sans-serif geometris (seperti Inter atau Plus Jakarta Sans) untuk teks bodi guna meningkatkan modernitas.

### Palet Warna & Gaya CSS (Theme & Styling)
*   **Status Saat Ini:** Dominasi warna Ungu (#6366F1) dengan latar belakang putih bersih.
*   **Evaluasi:** Palet ungu saat ini sangat "SaaS generic". Belum sepenuhnya mencerminkan kedalaman "Cloud Native" atau "Integritas Kriptografis".
*   **Rekomendasi:** Terapkan konsep **"Cyber Purple"** dengan menambahkan gradien gelap (Deep Space Blue) dan efek *glassmorphism* halus pada kartu (cards). Gunakan variabel CSS untuk mempermudah transisi ke Dark Mode di masa depan.

---

## 2. Evaluasi Halaman & Layout (UI Pages)
### Alur & Navigasi (Flow & Navigation)
*   **Navigasi Utama:** Menu "Informasi" dan "Layanan Solusi" bersifat dropdown. Ini bagus untuk kerapian, namun menyembunyikan pilar utama (B2B vs Akademik).
*   **Flow Pengguna:** User diarahkan ke kalkulator (Formulator) terlalu cepat sebelum memahami nilai unik (USP) tiap layanan.
*   **Rekomendasi:** Gunakan "Mega Menu" untuk membagi kategori layanan secara visual (B2B di kiri, Akademik di kanan) sehingga user bisa langsung memilih jalur mereka sejak landing page.

### Layout & Spasi (Grid & Spacing)
*   **Landing Page:** Bagian testimoni dan studi kasus menggunakan layout kartu yang seragam.
*   **Evaluasi:** Spasi antar elemen (whitespace) pada bagian deskripsi layanan terasa terlalu rapat, membuat teks terlihat "menumpuk" pada resolusi layar tertentu.
*   **Rekomendasi:** Gunakan sistem grid 12-kolom yang lebih konsisten dan tambahkan *vertical rhythm* (padding yang lebih besar antar section) untuk memberikan "ruang bernapas" pada konten.

---

## 3. Riset Pengalaman Pengguna (Experience)
### Kejelasan Proposisi (Clarity)
*   **Pesan "Anti-Joki":** Sangat kuat, namun perlu diperhalus dengan pendekatan edukatif agar tidak terasa mengintimidasi mahasiswa yang murni butuh bantuan statistik.
*   **Integrasi Kriptografis:** Istilah "Verifikasi Kriptografis" mungkin terlalu teknis bagi user awam. Perlu visualisasi (ikon lencana/shield) yang lebih intuitif.

### Interaktivitas
*   **Kalkulator Biaya:** Merupakan fitur unggulan. Interface-nya harus lebih interaktif (menggunakan slider atau visual step-by-step) daripada sekadar formulir input statis.

---

## Peta Jalan Perbaikan (Action Plan)
1.  **Iterasi 1:** Penyesuaian Tipografi & Refinement Warna (CSS Tokens).
2.  **Iterasi 2:** Restrukturisasi Navigasi & Mega Menu.
3.  **Iterasi 3:** Redesign Kartu Direktori & Penambahan Visual ROI Dashboard.