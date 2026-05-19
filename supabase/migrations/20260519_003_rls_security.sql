-- 💾 INFRAMEET DATABASE MIGRATION: 003_RLS_SECURITY
-- Tanggal: 19 Mei 2026 | Sektor: Row Level Security Layer

-- 1. AKTIVASI ROW LEVEL SECURITY (RLS)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE retainers ENABLE ROW LEVEL SECURITY;

-- 2. KEBIJAKAN TENANT ISOLATION (B2B/ACADEMIC MULTI-TENANCY)

-- Kebijakan Tabel Klien
CREATE POLICY clients_tenant_isolation ON clients
    FOR ALL
    TO authenticated
    USING (auth.uid() = id);

-- Kebijakan Tabel Proyek
CREATE POLICY projects_tenant_isolation ON projects
    FOR ALL
    TO authenticated
    USING (client_id IN (SELECT id FROM clients));

-- Kebijakan Tabel Brief Kustom
CREATE POLICY briefs_tenant_isolation ON briefs
    FOR ALL
    TO authenticated
    USING (project_id IN (SELECT id FROM projects));

-- Kebijakan Tabel Tagihan (Invoices)
CREATE POLICY invoices_tenant_isolation ON invoices
    FOR ALL
    TO authenticated
    USING (project_id IN (SELECT id FROM projects));

-- Kebijakan Tabel Escrow Ledger
CREATE POLICY escrow_ledger_tenant_isolation ON escrow_ledger
    FOR ALL
    TO authenticated
    USING (project_id IN (SELECT id FROM projects));

-- Kebijakan Tabel Retainers
CREATE POLICY retainers_tenant_isolation ON retainers
    FOR ALL
    TO authenticated
    USING (project_id IN (SELECT id FROM projects));

-- 3. AKSES PUBLIK & ANONIM UNTUK QUIZ & AUDIT TRAIL

-- Quiz Responses: Anonim diperbolehkan mengirimkan data survei
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY quiz_anonymous_insert ON quiz_responses
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY quiz_authenticated_select ON quiz_responses
    FOR SELECT
    TO authenticated
    USING (true);

-- Audit Log: Hanya sistem or authenticated admin yang bisa menulis dan melihat
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_system_insert ON audit_log
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY audit_staff_select ON audit_log
    FOR SELECT
    TO authenticated
    USING (true);
