-- 💾 INFRAMEET DATABASE MIGRATION: 001_CORE_TABLES
-- Tanggal: 19 Mei 2026 | Sektor: Core Relational Schema

-- Aktivasi Ekstensi Kriptografi & UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum Domain Layanan & Status Proyek
CREATE TYPE service_domain AS ENUM ('B2B_ENTERPRISE', 'ACADEMIC_INTEGRITY');

-- 1. TABEL KLIEN (PDP Compliant dengan BYTEA)
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    encrypted_whatsapp BYTEA NOT NULL, -- Diperlakukan dengan AES-256
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABEL PROYEK
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    domain service_domain NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    budget DECIMAL(12, 2) NOT NULL CHECK (budget > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABEL BRIEF KUSTOM
CREATE TABLE IF NOT EXISTS briefs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    requirements TEXT NOT NULL,
    file_attachments TEXT, -- Tautan berkas lampiran
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABEL KUESIONER / QUIZ RESPONSES
CREATE TABLE IF NOT EXISTS quiz_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    raw_selections JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABEL AUDIT LOG (Pencatatan Audit Trail)
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor VARCHAR(255) NOT NULL DEFAULT 'SYSTEM',
    action VARCHAR(255) NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index Pencarian Kinerja Tinggi
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_briefs_project_id ON briefs(project_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
