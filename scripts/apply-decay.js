// ============================================================================
// 🛡️ INFRAMEET — AUTOMATED TRUST DECAY CRON WORKER
// ============================================================================
// File Path: scripts/apply-decay.js
// Purpose: Trigger stagnation penalty (-5.0 reputation score points if no approved
//          trust proof was uploaded in the past 60 days).
// ============================================================================

const { createClient } = require("@supabase/supabase-js");

// Load variables from standard shell execution environments
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://iwowggzeqkzewdrdjkvu.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function executeDecay() {
  console.log("====================================================================");
  console.log("🕒 Starting Automated Trust Score Decay Cron Job...");
  console.log(`📡 Targeting Supabase Cluster: ${supabaseUrl}`);

  if (!supabaseServiceKey) {
    console.error("❌ CRITICAL ERROR: SUPABASE_SERVICE_ROLE_KEY environment variable is missing.");
    console.error("   Cannot authenticate as superuser admin to execute decay penalties.");
    process.exit(1);
  }

  // Create authoritative superuser bypass client
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  try {
    console.log("🚀 Invoking PL/pgSQL server-authoritative RPC: apply_trust_decay()...");
    
    // Call stored procedure
    const { data, error } = await supabase.rpc("apply_trust_decay");

    if (error) {
      throw error;
    }

    console.log("✅ CRON WORK SUCCESSFUL: Stagnation penalty calculations executed clean.");
    console.log("====================================================================");
    process.exit(0);
  } catch (err) {
    console.error("❌ CRON EXECUTION FAILED: An unexpected error occurred:", err.message);
    console.log("====================================================================");
    process.exit(1);
  }
}

executeDecay();
