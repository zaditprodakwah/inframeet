-- ==============================================================================
-- 🗄️ INFRAMEET DATABASE MIGRATION: DYNAMIC CATALOG & SYSTEM SETTINGS
-- Berkas: 20260518000011_dynamic_catalog_settings.sql
-- ==============================================================================

-- 1. Create table for dynamic services catalog overrides
CREATE TABLE IF NOT EXISTS services_catalog (
  sku VARCHAR(255) PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  name TEXT NOT NULL,
  base_price_idr BIGINT NOT NULL DEFAULT 0,
  description TEXT,
  features_checklist JSONB DEFAULT '[]'::jsonb,
  price_flat_idr BIGINT,
  price_per_unit_idr BIGINT,
  unit_label VARCHAR(100),
  is_volume_based BOOLEAN DEFAULT false,
  min_units INT,
  max_units INT,
  limit_description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create table for system environment & config settings
CREATE TABLE IF NOT EXISTS system_settings (
  key VARCHAR(255) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row-Level Security
ALTER TABLE services_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- 4. Set up policies
-- Public can read catalog
CREATE POLICY "Public read services catalog"
  ON services_catalog
  FOR SELECT
  USING (true);

-- Admins and Managers can manage catalog
CREATE POLICY "Admins/Managers manage services catalog"
  ON services_catalog
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- Public cannot read system settings directly (Admins only)
CREATE POLICY "Admins/Managers manage system settings"
  ON system_settings
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- Seed initial system configurations if not already populated
INSERT INTO system_settings (key, value, description)
VALUES 
  ('finance_settings', '{"nominal_unik_min": 1, "nominal_unik_max": 999, "midtrans_fallback": true}', 'Konfigurasi gerbang invoicing dan pembayaran hibrida manual nominal unik.'),
  ('fonnte_whatsapp', '{"enabled": true, "token_masked": "ACTIVE", "recipient_phone": "muhzadit@gmail.com"}', 'Status integrasi WhatsApp admin gateway.'),
  ('sitemap_configurations', '{"change_frequency": "weekly", "priority_home": 1.0, "priority_routes": 0.8}', 'Konfigurasi dynamic sitemap priorities.')
ON CONFLICT (key) DO NOTHING;
