-- Mengaktifkan ekstensi fuzzystrmatch untuk pencarian nama kampus/sekolah yang fleksibel
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;

-- 1. TABEL DIREKTORI PENDIDIKAN NASIONAL
CREATE TABLE IF NOT EXISTS education_directory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  npsn VARCHAR(50) UNIQUE,
  name VARCHAR(255) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('SEKOLAH', 'PERGURUAN_TINGGI')),
  type TEXT, -- e.g., 'NEGERI', 'SWASTA', 'Terdaftar'
  address TEXT,
  province VARCHAR(100),
  city VARCHAR(100),
  metadata JSONB DEFAULT '{}'::jsonb, -- Menyimpan koordinat, prodi, akreditasi, dll.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL CACHE REFERENSI AKADEMIK (GEO & CITATION REUSE)
CREATE TABLE IF NOT EXISTS cached_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doi VARCHAR(255) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  authors JSONB DEFAULT '[]'::jsonb,
  journal_name TEXT,
  pub_year INT,
  csl_json JSONB NOT NULL, -- Format standard Citation File Format JSON untuk reuse client-side
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL SHADOW RSS FEEDS & ITEMS
CREATE TABLE IF NOT EXISTS rss_feeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_url TEXT UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('ACADEMIC_JOURNAL', 'TECH_NEWS', 'B2B_INSIGHTS')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rss_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_id UUID REFERENCES rss_feeds(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  link TEXT NOT NULL,
  summary TEXT,
  content_html TEXT,
  author VARCHAR(100),
  published_at TIMESTAMPTZ NOT NULL,
  is_published_to_index BOOLEAN DEFAULT false, -- Menunggu approval admin untuk tayang di homepage
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEKSASI UNTUK KECEPATAN QUERY DAN GEOMETRIK SEARCH
CREATE INDEX IF NOT EXISTS idx_edu_dir_lookup ON education_directory(category, province, city);
CREATE INDEX IF NOT EXISTS idx_rss_items_pub ON rss_items(is_published_to_index, published_at DESC);

-- AKTIVASI ROW LEVEL SECURITY (RLS)
ALTER TABLE education_directory ENABLE ROW LEVEL SECURITY;
ALTER TABLE cached_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE rss_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE rss_items ENABLE ROW LEVEL SECURITY;

-- KEBIJAKAN KEAMANAN (RLS POLICIES)
CREATE POLICY "Publik dapat membaca direktori pendidikan" ON education_directory FOR SELECT USING (true);
CREATE POLICY "Publik dapat membaca cache referensi" ON cached_references FOR SELECT USING (true);
CREATE POLICY "Publik hanya melihat rss item yang di-approve" ON rss_items FOR SELECT USING (is_published_to_index = true);

-- Crowd-Sourcing Insert & Update Policies for Public School Searches
CREATE POLICY "Publik dapat menyisipkan direktori pendidikan baru" ON education_directory FOR INSERT WITH CHECK (true);
CREATE POLICY "Publik dapat memperbarui direktori pendidikan" ON education_directory FOR UPDATE USING (true);

-- Admin Override Policy
CREATE POLICY "Admin full CRUD on edu_dir" ON education_directory FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role::text = 'admin'));
CREATE POLICY "Admin full CRUD on cached_ref" ON cached_references FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role::text = 'admin'));
CREATE POLICY "Admin full CRUD on rss_feeds" ON rss_feeds FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role::text = 'admin'));
CREATE POLICY "Admin full CRUD on rss_items" ON rss_items FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role::text = 'admin'));
