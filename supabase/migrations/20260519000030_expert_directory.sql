-- ==============================================================================
-- 🏢 INFRAMEET DATABASE SCHEMA MIGRATION - UPGRADE 5
-- Open Expert Network & Data Directory Schema
-- ==============================================================================

-- 1. Create expert_directory Table
CREATE TABLE IF NOT EXISTS expert_directory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    slug TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    title TEXT,
    category TEXT NOT NULL CHECK (category IN ('ACADEMIC', 'BUSINESS', 'TECH', 'LEGAL', 'PUBLIC_SERVICE', 'OTHER')),
    tags TEXT[],
    bio_summary TEXT,
    achievements JSONB DEFAULT '[]'::jsonb,
    contact_routing JSONB NOT NULL, -- Format: { "whatsapp": "...", "email": "..." } - MUST BE HIDDEN FROM PUBLIC SELECT
    profile_completion_score INTEGER DEFAULT 0 CHECK (profile_completion_score BETWEEN 0 AND 100),
    expert_tier TEXT DEFAULT 'BRONZE' CHECK (expert_tier IN ('BRONZE', 'SILVER', 'GOLD', 'ELITE')),
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create user_achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    unlocked_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Performance & Search Indexes
CREATE INDEX IF NOT EXISTS idx_expert_slug ON expert_directory(slug);
CREATE INDEX IF NOT EXISTS idx_expert_category ON expert_directory(category);
CREATE INDEX IF NOT EXISTS idx_expert_public ON expert_directory(is_public);
CREATE INDEX IF NOT EXISTS idx_achievements_user ON user_achievements(user_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE expert_directory ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- 5. Define expert_directory Security Policies
-- Policy: Public can only view approved/published profiles (is_public = true)
CREATE POLICY expert_public_read ON expert_directory
    FOR SELECT USING (is_public = true);

-- Policy: Platform Admins / Managers have full privileges
CREATE POLICY expert_admin_all ON expert_directory
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- 6. Define user_achievements Security Policies
-- Policy: Everyone can read achievements
CREATE POLICY achievements_public_read ON user_achievements
    FOR SELECT USING (true);

-- Policy: Platform Admins / Managers have full privileges
CREATE POLICY achievements_admin_all ON user_achievements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );
