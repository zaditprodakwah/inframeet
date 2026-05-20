-- 1. Enable RLS on core tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_transactions ENABLE ROW LEVEL SECURITY;

-- 2. Profiles RLS Policies
-- Users can only select their own profile, or admins can select all
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- 3. Payout Transactions RLS Policies
-- Users can only view their own payout transactions
CREATE POLICY "Users can view own payout transactions" 
ON payout_transactions FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Users can insert their own payout transactions
CREATE POLICY "Users can insert own payout transactions" 
ON payout_transactions FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Prevent users from updating payout transactions (only admin/system can do this via RPC)
CREATE POLICY "Users cannot update payout transactions" 
ON payout_transactions FOR UPDATE 
TO authenticated 
USING (false);

-- Prevent users from deleting payout transactions
CREATE POLICY "Users cannot delete payout transactions" 
ON payout_transactions FOR DELETE 
TO authenticated 
USING (false);
