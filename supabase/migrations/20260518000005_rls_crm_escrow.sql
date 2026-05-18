-- ==============================================================================
-- 🔒 HARDENING SECURITY: ROW LEVEL SECURITY (RLS) FOR CRM & ESCROW LEDGERS
-- May 2026 | Supabase PostgreSQL Security DDL
-- ==============================================================================

-- 1. Enable RLS on all remaining operational and CRM tables
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_click_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE operational_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE executor_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_transactions ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 2. POLICIES FOR CRM LEADS & COMMUNICATIONS
-- ==============================================================================

-- Public can submit briefs anonymously (intake funnel)
CREATE POLICY crm_leads_public_insert ON crm_leads
  FOR INSERT WITH CHECK (true);

-- Authenticated staff can view and manage leads
CREATE POLICY crm_leads_staff_all ON crm_leads
  FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager', 'developer', 'analyst'))
  );

-- Authenticated staff can manage communications logs
CREATE POLICY crm_communications_staff_all ON crm_communications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager', 'developer', 'analyst'))
  );

-- ==============================================================================
-- 3. POLICIES FOR CMS & AFFILIATE CLICK LOGS
-- ==============================================================================

-- Public can trigger click logging via edge middleware redirects
CREATE POLICY affiliate_click_logs_public_insert ON affiliate_click_logs
  FOR INSERT WITH CHECK (true);

-- Staff can analyze click data
CREATE POLICY affiliate_click_logs_staff_all ON affiliate_click_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager', 'developer', 'analyst'))
  );

-- ==============================================================================
-- 4. POLICIES FOR OPERATIONAL TASKS & SUBMISSIONS
-- ==============================================================================

-- Admins and managers have full CRUD rights
CREATE POLICY operational_tasks_staff_all ON operational_tasks
  FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager', 'developer'))
  );

-- Executors can view their own allocated tasks
CREATE POLICY operational_tasks_executor_select ON operational_tasks
  FOR SELECT USING (
    allocated_to_user_id IN (SELECT id FROM staff WHERE auth_user_id = auth.uid())
  );

-- Admins and managers can review all task submissions
CREATE POLICY task_submissions_staff_all ON task_submissions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager', 'developer'))
  );

-- Executors can submit and manage their own submissions
CREATE POLICY task_submissions_executor_all ON task_submissions
  FOR ALL USING (
    submitted_by IN (SELECT id FROM staff WHERE auth_user_id = auth.uid())
  );

-- ==============================================================================
-- 5. POLICIES FOR ESCROW, WALLETS, & PAYOUT TRANSACTIONS
-- ==============================================================================

-- Admins and financial managers have full control
CREATE POLICY escrow_ledger_staff_all ON escrow_ledger
  FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager', 'developer'))
  );

-- Executors can view their own held escrow ledger entries
CREATE POLICY escrow_ledger_executor_select ON escrow_ledger
  FOR SELECT USING (
    user_id IN (SELECT id FROM staff WHERE auth_user_id = auth.uid())
  );

-- Admins and financial managers can manage all wallets
CREATE POLICY executor_wallets_staff_all ON executor_wallets
  FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager', 'developer'))
  );

-- Executors can view their own available balances
CREATE POLICY executor_wallets_executor_select ON executor_wallets
  FOR SELECT USING (
    user_id IN (SELECT id FROM staff WHERE auth_user_id = auth.uid())
  );

-- Admins and financial managers can manage all withdrawals
CREATE POLICY payout_transactions_staff_all ON payout_transactions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager', 'developer'))
  );

-- Executors can request and monitor their own payouts
CREATE POLICY payout_transactions_executor_all ON payout_transactions
  FOR ALL USING (
    user_id IN (SELECT id FROM staff WHERE auth_user_id = auth.uid())
  );
